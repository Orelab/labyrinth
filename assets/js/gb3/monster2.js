



FW.Monster2 = function( x, y, z ){
	
	THREE.MorphAnimMesh.apply( this )

	this.type = "monster2"

	this.position.x = x
	this.position.y = y
	this.position.z = z
	this.rotation.x = 90 * Math.PI / 180

	FW.Objects.monster.material[0].morphTargets = true
	this.w = new THREE.MorphAnimMesh( FW.Objects.monster.geometry, new THREE.MeshFaceMaterial( FW.Objects.monster.material ) )
	this.w.scale.x = this.w.scale.y = this.w.scale.z = 0.001

	this.w.duration = 1000
	this.w.time = 1000 * Math.random()
	this.add( this.w )

	this.update = function( delta ){ this.w.updateAnimation(1000*delta) }

}



FW.Monster2.prototype = Object.create( THREE.MorphAnimMesh.prototype )
FW.Monster2.prototype.constructor = FW.Monster2






