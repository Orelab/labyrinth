

//-- requires

game = require(__dirname + '/modules/game.js')
game.arena = require(__dirname + '/modules/arena.js')
require(__dirname + '/modules/player.js')
require(__dirname + '/modules/item.js')
game.util = require(__dirname + '/modules/util.js')
game.lang = require(__dirname + '/modules/lang.js')




//-- router

game.app.use( '/assets', game.express.static(__dirname + '/assets'));

game.app.all('/', function(req, res){ res.sendfile(__dirname + '/html/gameboard2.html') })
game.app.all('/admin', function(req, res){ res.sendfile(__dirname + '/html/admin.html') })
game.app.all('/control', function(req, res){ res.sendfile(__dirname + '/html/controller4.html') })
game.app.all('/credits', function(req, res){ res.sendfile(__dirname + '/html/credits.html') })

game.app.all('/webgl', function(req, res){ res.sendfile(__dirname + '/html/webgl.html') })
game.app.all('/test', function(req, res){ res.sendfile(__dirname + '/html/test.html') })


mongojs = require("mongojs")
db = mongojs.connect( "localhost/basededonnees", ["messages","items","rooms","bug"] )

game.io.on('connection', function(socket){


	
	for( var i=0 ; i<50 ; i++ ){
	
		obj = {
			_id : require('mongodb').ObjectID(),
			index : i
		}
		
		db.bug.insert( obj, function( err, obj ){
			if( err ){
				console.log( err )
				return
			}
			if( obj === 'undefined' ){
				console.log( obj )
				return
			}
			
			if( ! socket ){		
				console.log( 'SOCKET ERROR ! ! !' )
			}
			
			socket.emit('addObject', obj)
			socket.broadcast.emit('addObject', obj)
	
			console.log( obj )
		})
	}


})



