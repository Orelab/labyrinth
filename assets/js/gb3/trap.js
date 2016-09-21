



FW.Trap = function(){

	FW.Item.apply( this, arguments )

	this.type = "trap"

	this.geometry = FW.Objects.trap.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.trap.material )

	this.rotation.y = this.radian( 120 )

	this.update = function( delta ){
//		this.rotation.y += 0.5 * delta
	}
	
	
}



FW.Trap.prototype = Object.create( FW.Item.prototype )
FW.Trap.prototype.constructor = FW.Trap










