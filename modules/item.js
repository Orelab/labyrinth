
/**
 *
 *	Special items
 *
 */

game.item = {}

game.item.i = 0;			// needed to launch only one sendObject process (the crazy way)

game.item.recursive = true;	// set to false will stop sending objects



// These items are somemotionless gift player can take in their bag

game.item.speed = function(){
	this.name   = 'speed'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'yellow'
	this.speed  = 1
}

game.item.rocket = function(){
	this.name   = 'rocket'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'red'
	this.rocket = 1
}

game.item.trap = function(){
	this.name   = 'trap'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'lightGreen'
	this.trap   = 1
}

game.item.bomb = function(){
	this.name   = 'bomb'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'lightBlue'
	this.bomb   = 1
}

game.item.thief = function(){
	this.name   = 'thief'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'lightGrey'
	this.thief  = 1
}

game.item.strong = function(){
	this.name   = 'strong'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'brown'
	this.strong = 1
}


game.item.life = function(){
	this.name   = 'life'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'pink'
	this.life   = 1
}


// Now we only use a generic GIFT item

game.item.gift =function() {
	this.name   = 'gift'
	this.type   = 'item'
	this.room   = 'default'
	this.color  = 'pink'
	this.gift   = 1
}



// Here are some special (movable or not) items. These one are created by player
// and have a short lifetime...

game.item.weaponrocket = function( user ){
	var self		= this						// closure
	this.name      = "rocket"
	this.type      = "weapon"
	this.speed	= 3000						// latency between two moves
	this.direction = user.lastDirection
	this.x		= user.x
	this.y		= user.y

	this.move = function(){
		coords = game.arena.convDir2Coord( self, self.direction )
		if( coords ){
			if( game.arena.getPosition(coords.x, coords.y) ){
				self.x = coords.x
				self.y = coords.y
				game.player.move( self._id, {x:coords.x,y:coords.y} )		// player ? WTF !?
			} else game.item.destroy( self._id )
		} else game.item.destroy( self._id )
		
		setTimeout(self.move, self.latency)
	}
//	this.move()
}

game.item.weapontrap = function(){
	this.name      = "trap"
	this.type      = "weapon"
	this.lifetime  = 10	// in seconds
}

game.item.weaponbomb = function(){
	var self       = this						// closure
	this.name      = "bomb"
	this.type      = "weapon"
	this.timer     = 4							// number of second before explosion
	this.power     = 5							// number of shot squares
	
	setTimeout(function(){
		
		// At the end of the timer, does the bomb still here ?
		// If someone walk on the bomb before it explode, it
		// shouldn't explode.
		
		game.db.items.count({_id:self._id}, function(err,nb){

			if( err ) return
			if( nb ){	
				size=game.arena.getSize()
				var flames = []
				
				for( var i=self.x ; i>self.x-self.power && i>0  ; i--){			// left
					if( game.arena.getPosition(i, self.y) ){
						game.item.create('weaponflame',{x:i,y:self.y})
					} else break
				}
				
				for( var i=self.x ; i<self.x+self.power && i<size.x ; i++){			// right
					if( game.arena.getPosition(i, self.y) ){
						game.item.create('weaponflame',{x:i,y:self.y})
					} else break
				}
				
				for( var j=self.y ; j>self.y-self.power && j>0  ; j--){			// top
					if( game.arena.getPosition(self.x, j) ){
						game.item.create('weaponflame',{x:self.x,y:j})
					} else break
				}
				
				for( var j=self.y ; j<self.y+self.power && j<size.y ; j++){			// bottom
					if( j>0 && j<size.y && game.arena.getPosition(self.x, j) ){
						game.item.create('weaponflame',{x:self.x,y:j})
					} else break
				}
				
				game.item.destroy( self._id )				
			}
		})

	}, self.timer*1000)
}



game.item.weaponflame =function( user ){
	var self = this	// closure
	
	this.name = "flame"
	this.type = "weapon"
	this.lifetime = 2
	this.x = user.x
	this.y = user.y

	//	
	// Here is the list of object which
	// will be destructed
	//
	destructedObjects = ['player','item','weapon']

	game.arena.getItemsAtPosition( destructedObjects, self.x, self.y, function( err, obj ){
		if( err )return
		if( ! obj )return
	
		if( obj.type=='player' ){
			console.log( obj.name + ' has been touched by a ' + self.name )
			game.player.looseLife( obj._id )
		} else {
			game.item.destroy( obj._id, true )
		}
	})
	
	setTimeout(function(){
		game.item.destroy( self._id, false )	// gameboard will know by itself when these objects are destroyed
	}, this.lifetime*1000)					// But admin can't know that !? (bug)
}





//
//	@param o must be an object containing x and y attribute
//
//
game.item.create = function( name, o ){
	if( name )
		var item = new game.item[name]( o )		// {x,y} is especially for weaponflame which needs it in construction
		else
		var item = new game.item.gift
		
	item.x = o.x								// This is for the other items, which don't need
	item.y = o.y								// coords during construction
	
	item._id = new require('mongodb').ObjectID()

	game.db.items.insert( item, function( err, newItem ){
		if( err ){
			console.log( err )
			return
		}
		if( newItem === 'undefined' ){
			console.log( newItem )
			return
		}
		
		if( ! game.socket ){		
			console.log( 'SOCKET ERROR ! ! !' )
			return
		}

		game.socket.emit( 'addObject', newItem )
		game.socket.broadcast.emit( 'addObject', newItem )
	})
	
	return item
}


//
//	Remove an item/player/weapon
//	and notify its disappearance to everybody
//	 - id : id of object to remove
//	 - emit (optional) : notify (true) or not (false) to the network 
//
game.item.destroy = function( id, emit ){
	game.db.items.remove({_id:id})
	
	if( emit!==false ){
		if( ! game.socket ) return
		game.socket.emit('deleteObject', id)
		game.socket.broadcast.emit('deleteObject', id)
	}
}






