


FW.Bomb = function(){

	FW.Item.apply( this, arguments )

	this.type = "bomb"

	this.geometry = FW.Objects.bomb.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.bomb.material )


	// empty function increase game speed
	// ( an attribute 'immobile' should be more easy to understand... )
	
	this.update = function(delta){}
}



FW.Bomb.prototype = Object.create( FW.Item.prototype )
FW.Bomb.prototype.constructor = FW.Bomb










