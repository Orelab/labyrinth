
//-- App

var app = {}



//-- JQ optim
	
app.avatar = $('#avatar>div')
app.name = $('#avatar>p')
app.life = $('#lifegauge>p')
app.gift = $('#giftgauge>p')

app.nextmove = $('#nextmove')
app.altmove = $('#altmove')

app.message = $('#message')

app.cursor = $('#cursor')




//-- pointer



app.pointerMemory = {moving: 0}

mouseStart = function( ev ){
	ev.preventDefault()
	$(this).css('background-color', 'red')

	app.pointerMemory = {
		originalPageX : ev.originalEvent.touches ? ev.originalEvent.touches[0].pageX : ev.pageX,
		originalPageY : ev.originalEvent.touches ? ev.originalEvent.touches[0].pageY : ev.pageY,
		deltaPageX    : 0,
		deltaPageY    : 0,
		//originalLeft    : ev.target.offsetLeft,
		//originalTop     : ev.target.offsetTop,
		originalLeft    : 107,	// static prevent bugs ;)
		originalTop     : 107,
		moving          : 2	// must start at 2 for modulo
	}
}

mouseMove = function( ev ){
	ev.preventDefault()

	if( app.pointerMemory.moving>0 && app.pointerMemory.moving%4==0 ){	// calculate 1 move of 4 to decrease processing load

		app.pointerMemory.deltaPageX = app.pointerMemory.originalPageX - ( ev.originalEvent.touches ? ev.originalEvent.touches[0].pageX : ev.pageX )
		app.pointerMemory.deltaPageY = app.pointerMemory.originalPageY - ( ev.originalEvent.touches ? ev.originalEvent.touches[0].pageY : ev.pageY )

		cssleft = parseInt( app.pointerMemory.originalLeft - app.pointerMemory.deltaPageX )
		csstop = parseInt( app.pointerMemory.originalTop - app.pointerMemory.deltaPageY )

		
		$(this).css({
			top  : csstop + 'px',
			left : cssleft + 'px'
		})
	}
	if( app.pointerMemory.moving>0 ){
		app.pointerMemory.moving++
	}
}

mouseEnd = function( ev ){
	ev.preventDefault()
	$(this).css('background-color', 'lightBlue')

	app.pointerMemory.moving = 0
	app.pointerMemory.deltaPageX = 0
	app.pointerMemory.deltaPageY = 0
	
	app.pointer.animate({
		top  : app.pointerMemory.originalTop + 'px',
		left : app.pointerMemory.originalLeft + 'px'
	},200)

	app.stop()
}

app.pointer = $('#pointer').on({
	mousedown  : mouseStart,
	touchstart : mouseStart,

	mousemove  : mouseMove,
	touchmove  : mouseMove,

	mouseup    : mouseEnd,
	mouseleave : mouseEnd,
	touchend   : mouseEnd
})

/*			$('body').on({
	mouseup    : mouseEnd,
	mouseleave : mouseEnd,
	touchend   : mouseEnd
})
*/			
	
	








	
//-- misc vars

app.socket = io.connect(':8088');

app.p = {
	_id     : 0,
	name    : '',
	color   : '',
	speed   : 0,
	rocket  : 0,
	trap    : 0,
	bomb    : 0,
	strong  : 0,
	thief   : 0,
	life    : 2,
	gift    : 2,
	nextMove: 'stop',
	altMove: 'stop'
}
	
	
	
//-- functions
	
app.blink = function(id){
	$('#'+id)
		.clearQueue()
		.animate({backgroundColor:'yellow'},50,'easeInOutElastic')
		.animate({backgroundColor:'#e9e8e8'},50,'easeInOutElastic')

	app.playSound('metalplate')
}
	
app.playSound = function( sound ){
	var snd  = new Audio()
	var src  = document.createElement("source")
	src.type = 'audio/mpeg'
	src.src  = '/assets/audio/' + sound + '.mp3'
	snd.appendChild(src)
	snd.play()
}

app.headWheely = function(){
	$({deg:0}).animate({deg:720},{
		duration: 250,
		step: function(now){
			app.avatar.css({
				transform: 'rotate('+now+'deg)'
			})
		}
	})
}
		

app.stop = function(e,ui){
	app.p.nextMove = 'stop'
	app.p.altMove = 'stop'

	app.nextmove.html('<img src="/assets/img/stop.png"/>')
	app.altmove.html('<img src="/assets/img/stop.png"/>')
}

app.calculateDirections = function(){

	if( app.pointerMemory.deltaPageX === undefined || app.pointerMemory.deltaPageY === undefined )
		return

	dx = -app.pointerMemory.deltaPageX
	dy = -app.pointerMemory.deltaPageY

	adx = Math.abs(dx)
	ady = Math.abs(dy)

	if( dx && dy ){
		
		// calculate the prefered move
		
		if( dx<0 && adx>ady ) app.p.nextMove = 'left'
		if( dx>0 && adx>ady ) app.p.nextMove = 'right'
		if( dy<0 && adx<ady ) app.p.nextMove = 'top'
		if( dy>0 && adx<ady ) app.p.nextMove = 'bottom'
		if( adx<30 && ady<30 ) return app.stop()
		
		app.p.lastMove = app.p.nextMove


		// calculate the alt move now

		app.p.altMove = 'stop'
		if( dx<0 && dy<-20 && adx>ady ) app.p.altMove = 'top'
		if( dx<0 && dy> 20 && adx>ady ) app.p.altMove = 'bottom'
		if( dx>0 && dy<-20 && adx>ady ) app.p.altMove = 'top'
		if( dx>0 && dy> 20 && adx>ady ) app.p.altMove = 'bottom'
		if( dy<0 && dx<-20 && adx<ady ) app.p.altMove = 'left'
		if( dy<0 && dx> 20 && adx<ady ) app.p.altMove = 'right'
		if( dy>0 && dx<-20 && adx<ady ) app.p.altMove = 'left'
		if( dy>0 && dx> 20 && adx<ady ) app.p.altMove = 'right'

		if( app.p.altMove == 'stop' ) app.p.altMove = app.p.nextMove
	}
	app.nextmove.html('<img src="/assets/img/' + app.p.nextMove + '.png"/>')
	app.altmove.html('<img src="/assets/img/' + app.p.altMove + '.png"/>')
}




//-- callback


app.updateNewPlayer = function(p){
	$.each(p,function(i,v){
		app.p[i] = v
	})
	app.name.html( p.name )
	app.life.html( p.life )
	app.updatePlayerInfo(p)
	move()
}

app.updatePlayerInfo = function(p){
	if(p._id==app.p._id){
	
		app.p.life=p.life
		app.life.html(p.life)

		app.p.gift=p.gift
		app.gift.html(p.gift)
		app.avatar.css('background-color',app.p.color)
	}
}

app.updateDeleteObject = function(id){
	if( id==app.p._id ){
		if( confirm("C'est fini pour toi !") )
			window.location.reload()
	}
}







//-- misc

Array.prototype.has=function(v){
	for (i=0;i<this.length;i++){
		if (this[i]==v) return true;
	}
	return false;
}







//-- player name

while( !app.p.name ){ app.p.name = prompt('login ?') }
//app.p.name = 'orel'







//-- event

app.socket.emit('newPlayer',{name:app.p.name},app.updateNewPlayer)
app.socket.on('newObjectInfo', app.updatePlayerInfo)
app.socket.on('deleteObject', app.updateDeleteObject)

/*			
$('#goodies').delegate('button', 'click', function(){
	app.socket.emit('playerUse',{_id:app.p._id,item:$(this).attr('id')}, app.updatePlayerInfo)
})
*/
$('#goodies').delegate('button', 'touchstart', function(){
	app.socket.emit('playerUse',{_id:app.p._id,item:$(this).attr('id')}, app.updatePlayerInfo)
})




//-- timer

move = function(){
	app.calculateDirections()

	if( app.p.nextMove != 'stop' ){
		
		app.socket.emit('playerMove',{
			_id:app.p._id,
			direction:app.p.nextMove,
			alternative:app.p.altMove
		})
	}
	setTimeout('move()', 200)
}