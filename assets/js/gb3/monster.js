



FW.Monster = function( x, y, z){


	this.type = "monster"

	FW.Objects.monster.material[0].morphTargets = true

	this.geometry = FW.Objects.monster.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.monster.material )

//	FW.Item.apply( this, arguments )
	THREE.MorphAnimMesh.apply( this, this.geometry, this.material )
	this.position.x = x ? x : 0
	this.position.y = y ? y : 0
	this.position.z = z ? z : 0

	
	this.duration = 1000
	this.time = 1000 * Math.random()

	this.matrixAutoUpdate = false

	this.scale.x = this.scale.y = this.scale.z = 0.001

	this.updateMatrix()
	
	this.update = function( delta ){
		if( this.morphTargetInfluences !== undefined ) {
			console.log('monster updating')
			this.updateAnimation( 1000 * delta )
		}
	}
	
	
	


}



FW.Monster.prototype = Object.create( FW.Item.prototype )
FW.Monster.prototype.constructor = FW.Monster







