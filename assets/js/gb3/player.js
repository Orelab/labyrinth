


FW.Player = function(){

	FW.Item.apply( this, arguments )

	this.type = "player"

	this.geometry = FW.Objects.player.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.player.material )

	this.material.color = this.data.color

}



FW.Player.prototype = Object.create( FW.Item.prototype )
FW.Player.prototype.constructor = FW.Player



FW.Player.prototype.update = function( delta ){

	FW.Player.prototype.updateItem = FW.Item.prototype.update

	updateInnerHTML( document.getElementById('report'), this.direction )
	
	switch( this.direction ) {
		case "left" :		this.rotation.z += 10 * delta ;break
		case "right" :		this.rotation.z -= 10 * delta ;break
		case "top" :		this.rotation.x -= 10 * delta ;break
		case "bottom" :	this.rotation.x += 10 * delta ;break
		case "stop" :
		default :			;
	}

//	console.log( this.data )
//	console.log( this.data.x + '/' + this.data.y )
//	console.log( this.direction )
		
	this.updateItem( delta )
}




