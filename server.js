/**
 *	http://socket.io/docs/#
 *
 * 	This sample works with http, express ans socket.io
 *
 *
 *	EXPRESS :
 *	 - http://expressjs.com/4x/api.html
 *
 *	SOCKET.IO :
 *	 - http://socket.io/docs/
 *	 - http://atinux.developpez.com/tutoriels/javascript/utiliser-socket-io/
 *
 *	MONGODB :
 *	 - http://howtonode.org/node-js-and-mongodb-getting-started-with-mongojs
 *	 - http://docs.mongodb.org/manual/reference/method/
 *	 - http://docs.mongodb.org/manual/reference/operator/
 *
 *	MONGOJS :
 *	 - https://github.com/mafintosh/mongojs/blob/master/README.md
 *
 *	DATABASE SCHEME :
 *	 - messages ( _id )
 *	 - items ( _id, type, room, name, x, y, color, lastMove, speed, thief, life, slide, punch )
 *	 - rooms ( _id, name )
 *
 */




//-- requires

game = require(__dirname + '/modules/game.js')
game.arena = require(__dirname + '/modules/arena.js')
require(__dirname + '/modules/player.js')
require(__dirname + '/modules/item.js')
game.util = require(__dirname + '/modules/util.js')
game.lang = require(__dirname + '/modules/lang.js')



//-- router

game.app.use(function(req, res, next){
	if( req.query.arena ){
		app.arena = req.query.arena
		console.log( app.arena )
	}
	next()
})

game.app.use( '/assets', game.express.static(__dirname + '/assets'));

//game.app.all('/', function(req, res){ res.sendfile(__dirname + '/html/index.html') })
//game.app.all('/32', function(req, res){ res.sendfile(__dirname + '/html/gameboard.html') })

game.app.all('/', function(req, res){ res.sendfile(__dirname + '/html/gameboard.html') })


game.app.all('/admin', function(req, res){ res.sendfile(__dirname + '/html/admin.html') })
game.app.all('/control', function(req, res){ res.sendfile(__dirname + '/html/controller.html') })
game.app.all('/credits', function(req, res){ res.sendfile(__dirname + '/html/credits.html') })




//-- sockets

game.io.on('connection', function(socket){
	
	game.socket = socket;						// export socket for modules
	

	socket.on('gameboard',function(obj, callback){
		callback(game.arena.grid);
	})


	socket.on('newPlayer',function(data, callback){
		p = game.player.create( data.name )
	
		game.db.items.save(p,function(err,player){

console.log(player);

			callback( player )
			socket.broadcast.emit('addObject', player)
		})
	})


	socket.on('playerMove',function(data){

		if( ! data._id ) return
		if( ! data.direction ) return
		if( ! data.alternative ) return
		
		id = mongojs.ObjectId( data._id )
		

		game.db.items.findOne({_id:id,type:'player'}, function(err, user){

			if(err) return
			if( ! user) return

			coords = game.arena.convDir2Coord(user, data.direction )
			
			if( coords ){
				if( game.arena.getPosition(coords.x, coords.y) ){
					dir = data.direction
				} else dir = data.alternative
			} else return
			
			game.player.rememberLastDirection( id, dir )

			switch( dir ){
				case "top":
					if( game.arena.getPosition(user.x, user.y-1) )
						game.player.move( id, {y:user.y-1} )
					break;
					
				case "right":
					if( game.arena.getPosition(user.x+1, user.y) )
						game.player.move( id, {x:user.x+1} )
					break;
					
				case "bottom":
					if( game.arena.getPosition(user.x, user.y+1) )
						game.player.move( id, {y:user.y+1} )
					break;
					
				case "left":
					if( game.arena.getPosition(user.x-1, user.y) )
						game.player.move( id, {x:user.x-1} )
					break;
			}			
		})
	})
	
	
	socket.on('playerUse',function(data, callback){
		
		if( ! data._id ) return
		if( ! data.item ) return
		
		id = mongojs.ObjectId( data._id )

		game.db.items.findOne({_id:id,type:'player'}, function(err, player){

			if( err ) return
			if( ! player) return
			if( player.gift <= 0 ) return
			
			req = {
				gift: --player.gift,
				life: ( data.item=='life' ? ++player.life : player.life )
			}

			game.db.items.update({_id:id}, {$set:req}, {}, function(err, status){
				if(status.n == 1 ){	// 1 row updated
				
					console.log(player.name + ' use ' + data.item)

					switch(data.item){
						case "rocket" :
							game.item.create( "weaponrocket", player )
							break

						case "trap" :
							game.item.create( "weapontrap", player )
							break

						case "bomb" :
							game.item.create( "weaponbomb", player )
							break

						case "speed" :
							now = (new Date()).getTime()
							game.db.items.update({_id:id}, {is_speed:now})
							break

						case "strong" :
							now = (new Date()).getTime()
							game.db.items.update({_id:id}, {is_strong:now})
							break

						case "life":	// important : if retired, default:return will be trigger
							break
							
						default: return
					}
					
					callback( player )
				}
			})
		})
	})

	
	socket.on('clearObjects',function(obj,callback){
		game.db.items.remove({type:obj.type}, function(){
			callback()
			socket.broadcast.emit('removeAllObject',obj.type)
			console.log(obj.type + ' cleared')
		})
	})

	
	socket.on('deleteObject',function(id,callback){
		game.db.items.remove({_id:mongojs.ObjectId(id)}, function(err,o){
			callback()
			socket.broadcast.emit('removeObject',id)
			console.log('item removed')
		})
	})

})




	
	

var giftSender = function(){
	game.db.items.count({type:'item'},function(err,n){
		
		if(n<=20){
			coords = game.arena.getRandomLandingPlace()
			game.item.create( "gift", coords )
			//console.log( 'new item in ' + (wait/1000) + ' seconds' )
		}		
	})
}



var garbageCollector = function(){

	//-- remove idle players

	tenMinutes = (new Date()).getTime() - 600000
	hundredMinutes = (new Date()).getTime() - 6000000
	
	game.db.items.find({
		type: 'player',
		lastMove: {$lt:hundredMinutes}
	}).forEach(function(err, p){
		if( err ) return
		if( ! p ) return
		
		game.item.destroy(p._id)
	})
	
	//-- remove bugged items (seems some dead players remains empty in DB !?)
	
	game.db.items.find({
		type: {$exists:false}				// remove items with no 'type' field
	}).forEach(function(err, p){
		if( err ) return
		if( ! p ) return

		game.item.destroy(p._id)
	})
}




	
var update = function(){

	if( ! game.socket ) return

	game.db.items.find({}, function(err, objects){

		if( err || !objects.length ) return

		structure = {
			'objects'	: objects,
			'time'	: (new Date()).getTime()
		}

		game.socket.emit( 'update', structure )
		game.socket.broadcast.emit( 'update', structure )
	})
}


setInterval(giftSender, 10000)
setInterval(garbageCollector, 20000)
setInterval(update, 50)








