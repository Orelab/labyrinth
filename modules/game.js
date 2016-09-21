
//-- private

databaseUrl = "localhost/basededonnees"				// "username:password@example.com/mydb"
collections = ["messages","items","rooms"]



//-- Database

mongojs = require("mongojs")
db = mongojs.connect( databaseUrl, collections )


//-- HTTP(S) Server

//
//	For Secure HTTP, see this doc :
//	http://www.gettingcirrius.com/2012/06/securing-nodejs-and-express-with-ssl.html
//

express = require('express');
app = express();

server = require('http').Server(app).listen(8088);
//server = require('http').Server(app).listen(8088, 'game.funworks.fr');

io = require('socket.io')(server);







module.exports = {
	mongojs:		mongojs,
	db:			db,
	express:		express,
	app:			app,
	server:		server,
	io:			io
}
