
self.addEventListener('message', function( e ){

	id = e.data.i
	bloc = e.data.b
	object = e.data.o

	if( object.type=="player" ){
		if( bloc.x>object.x*app.config.spriteWidth+20 ) bloc.x-=20
		else if( bloc.x>object.x*app.config.spriteWidth ) bloc.x-=5

		if( bloc.x<object.x*app.config.spriteWidth-20 ) bloc.x+=20
		else if( bloc.x<object.x*app.config.spriteWidth ) bloc.x+=5
		
		if(-bloc.y>object.y*app.config.spriteHeight+20 ) bloc.y+=20
		else if(-bloc.y>object.y*app.config.spriteHeight ) bloc.y+=5

		if(-bloc.y<object.y*app.config.spriteHeight-20 ) bloc.y-=20
		else if(-bloc.y<object.y*app.config.spriteHeight ) bloc.y-=5
	}


	self.postMessage({
		i: id,
		b: bloc,
		o: object
	})
})
