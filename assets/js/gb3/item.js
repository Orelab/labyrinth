


FW.Item = function( x, y, z, data ){

	THREE.MorphAnimMesh.apply( this )

	this.type = "item"
	
	this.castShadow = true
	this.receiveShadow = true

	this.anisotropy = FW.renderer.getMaxAnisotropy()

	this.rotation.x = this.radian( 90 )
	
	this.position.x = x ? x : 0
	this.position.y = y ? y : 0
	this.position.z = z ? z : 0

	this.direction = "stop"

	// data from server
	
	this.data = false
	this.dataprev = false

	if( typeof data != "undefined" ){
		this.dataprev = data
		this.dataprev.timer = FW.register.timer
		this.data = data
		this.data.timer = FW.register.timer
	}


}


FW.Item.prototype = Object.create( THREE.MorphAnimMesh.prototype )
FW.Item.prototype.constructor = FW.Item






// http://cwestblog.com/2012/11/12/javascript-degree-and-radian-conversion/

FW.Item.prototype.radian = function( degree ) {
	return degree * Math.PI / 180
}



	
FW.Item.prototype.update = function( delta ){

	if( ! this.data ) return
	

	var now = ( new Date() ).getTime() // - FW.register.latency.average()
	var id = this.data._id
	var datareg = FW.register.data[id]	

	if( ! datareg ) return

	// Updating data
	
//	if( this.data.timer != FW.register.timer ){
	if( this.data.x != datareg.x || this.data.y != datareg.y ){
		this.dataprev = this.data
		this.data = datareg
		this.data.timer = FW.register.timer
		
//		console.log( this.data.x + "/" + this.data.y + "/" + this.data.timer )
	}


	// Player direction

	if( this.data.x == this.dataprev.x && this.data.y == this.dataprev.y ){
		this.direction = "stop"
	}
	
	if( this.data.x > this.dataprev.x ) {
		this.direction = "right"
	}
	
	if( this.data.x < this.dataprev.x ) {
		this.direction = "left"
	}
	
	if( this.data.y > this.dataprev.y ) {
		this.direction = "bottom"
	}
	
	if( this.data.y < this.dataprev.y ) {
		this.direction = "top"
	}

	
	
	// Calculate speed (in square per second)

	var speedX = ( this.data.x - this.dataprev.x ) / ( this.dataprev.timer - this.data.timer ) * 1000
	var speedY = ( this.data.y - this.dataprev.y ) / ( this.dataprev.timer - this.data.timer ) * 1000
	speedX = 0.2
	speedY = 0.2
	

	// Moving Item
	
	var pos = {
		fromX	: this.dataprev.x * config.brickSize.x + 1,
		fromY	: - this.dataprev.y * config.brickSize.y - 1,
		fromTimer	: this.dataprev.timer,

		toX		: this.data.x * config.brickSize.x + 1,
		toY		: - this.data.y * config.brickSize.y - 1,
		toTimer	: this.data.timer,
		
		realX	: this.position.x,
		realY	: this.position.y,
		realTimer	: (new Date()).getTime() //- FW.register.latency.average()
	}

	if( pos.realX != pos.toX || pos.realY != pos.toY ) {

		
		diffX = pos.toX - pos.fromX
		diffY = pos.toY - pos.fromY
		
		newPosX = pos.realX + ( diffX * delta / 0.2 )
		newPosY = pos.realY + ( diffY * delta / 0.2 )


		// Check that newPos is between fromX and toX
		// and recording moving direction

		this.direction = "none"
		
		if( pos.fromX > pos.toX ) {								// Go left
			
			if( pos.fromX > newPosX && newPosX > pos.toX ) {
				this.position.x = newPosX
				this.direction = "left"
			} else {
				this.position.x = pos.toX
			} 
			
		} else {												// Go right
			 
			if( pos.fromX < newPosX && newPosX < pos.toX ) {
				this.position.x = newPosX
				this.direction = "right"
			} else {
				this.position.x = pos.toX
			} 
		}
		
		
		if( pos.fromY > pos.toY ) {								// Go bottom
			 
			if( pos.fromY > newPosY && newPosY > pos.toY ) {
				this.position.y = newPosY
				this.direction = "bottom"
			} else {
				this.position.y = pos.toY
			}
			
		} else {												// Go top
			 
			if( pos.fromY < newPosY && newPosY < pos.toY ) {
				this.position.y = newPosY
				this.direction = "top"
			} else {
				this.position.y = pos.toY
			} 
		}
		
		// Debug
		
		if( config.dev ) {
//			this.parent.add( new FW.Marker( this.position.x, this.position.y, 2 ) )
		}
	}
}






FW.Item.prototype.playSound = function( sample ) {
	if( config.audio ){
		var snd  = new Audio()
		var src  = document.createElement("source")
		src.type = 'audio/mpeg'
		src.src  = '/assets/audio/' + sample + '.mp3'
		snd.appendChild(src)
		snd.play()
	}
}



FW.Item.prototype.die = function( lifetime ) {

	var scope = this

	var id = scope.data._id

	var dying = function(){
		scope.playSound('metalplate')
		
		delete FW.register.objects[id]
		scope.parent.remove( scope )
	}

	if( lifetime )
		setTimeout( dying, lifetime*1000 )
		else
		dying()
}





