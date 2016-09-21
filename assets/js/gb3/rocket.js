



FW.Rocket = function(){

	FW.Item.apply( this, arguments )

	this.type = "rocket"
	
	this.rotationSpeed = 15

	this.geometry = FW.Objects.rocket.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.rocket.material )

	this.rotation.y = Math.random() * this.radian( 360 )

}



FW.Rocket.prototype = Object.create( FW.Item.prototype )
FW.Rocket.prototype.constructor = FW.Rocket



/*FW.Rocket.prototype.die = function(){
	console.log( "mort" )
	
	FW.Item.prototype.die()
}
*/


FW.Rocket.prototype.update = function( delta ){
	
	FW.Rocket.prototype.updateItem = FW.Item.prototype.update

	if( this.type != "wall" && this.typer != "map") {
		this.rotation.y += this.rotationSpeed * delta
	}

	this.updateItem( delta )
}






