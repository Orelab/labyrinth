/**
 *
 *	Player
 *
 */

game.player = {}


game.player.create = function( name ){
	return {
		name:		( name ? name : 'patator' ),
		type:		'player',
		room:		'default',
		x:			7+(Math.round(Math.random()*5)),
		y:			6+(Math.round(Math.random()*5)),
		color:		game.util.getRandomColor(),
		lastMove: 	(new Date()).getTime(),
		lastDirection: false,
		life: 		2,
		gift:		20,
		invincible:	false,	// false, or start date
		speed: 		false	// false, or start date
	}
}




game.player.get = function( id ){
	
}


game.player.getItem = function( id ){
	
}

game.player.move = function( id, change ){
	change.lastMove = (new Date()).getTime()

	//-- update the player position
		
	game.db.items.findAndModify({
			query:{_id:id},
			update:{$set:change},
			new: true
		},
		function( err, user ){
			if( err ) return
			if( ! user ) return


			//-- collecting the items

			game.arena.getItemsAtPosition( ['item','weapon'], user.x, user.y, function( err, item ){
				if( err ) return
				if( ! item ) return

				if( item.type=='item' ){
					console.log( user.name + ' get a ' + item.name )
	
					user[item.name] += item[item.name]					// for now, only gift (eq. user.gift++)
					game.db.items.update({_id:user._id},user)
					game.item.destroy( item._id )
	
					game.socket.emit('newObjectInfo', user)				// for proprietary
					game.socket.broadcast.emit('newObjectInfo', user)		// for the other
				}

				if( item.type=='weapon' ){
					console.log( user.name + ' walked on a ' + item.name )
					game.player.looseLife( user._id )
					game.item.destroy( item._id )
				}
			})
			
			
			//-- broadcast the new position

			game.db.items.findOne({_id:id},function( err, p ){
				if( err ) return
				if( ! p ) return
				
				//console.log( p.name + ' moved to ' + p.x + ':' + p.y)
			
				game.socket.emit('moveObject', p )				// for proprietary
				game.socket.broadcast.emit('moveObject', p )		// for the other
			})
		}
	)
}


game.player.looseLife = function( id ){
	game.db.items.findAndModify({
		query:{_id:id},
		update:{
			$inc:{life:-1}
		},
		new: true
	},
	function( err, obj ){
		
		if( err ) return
		if( !obj ) return

		if( obj.life > 0 ){
			game.socket.emit('newObjectInfo', obj );			// for proprietary
			game.socket.broadcast.emit('newObjectInfo', obj );	// for the other
		} else {
			console.log( obj.name + ' is dead' )
			game.item.destroy( obj._id )
		}
	})
}



game.player.rememberLastDirection = function( id, dir ){
	game.db.items.update({_id:id},{$set:{lastDirection:dir}})
}



