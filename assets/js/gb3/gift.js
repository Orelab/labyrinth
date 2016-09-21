



FW.Gift = function(){

	FW.Item.apply( this, arguments )

	this.type = "gift"
	
	this.maxHeight = 4.5
	this.minHeight = 3.2
	this.rotationSpeed = 1
	this.jumpingSpeed = 0.04
	
	this.rebond = true	// true : monte ; false : descent

	this.geometry = FW.Objects.gift.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.gift.material )
	
	this.position.z = ( this.maxHeight - this.minHeight ) * Math.random() + this.minHeight

	this.update = function( delta ) {
		
		this.rotation.y += this.rotationSpeed * delta

		if( this.position.z > this.maxHeight )
			this.rebond = false

		if( this.position.z < this.minHeight )
			this.rebond = true
			
		this.position.z += this.rebond ? this.jumpingSpeed : -this.jumpingSpeed
	}

}



FW.Gift.prototype = Object.create( FW.Item.prototype )
FW.Gift.prototype.constructor = FW.Gift










