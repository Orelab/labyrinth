



FW.Flame = function(){

	FW.Item.apply( this, arguments )

	this.type = "flame"


	this.geometry = FW.Objects.flame.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.flame.material )
	this.transparent = true
	this.blending = THREE.AdditiveBlending

	this.rotation.y = this.radian( 120 )



	
/*	
	this.smokeParticles = new THREE.Geometry;
	for (var i = 0; i < 10; i++) {
		this.smokeParticles.vertices.push(
			new THREE.Vector3(Math.random() * 3.2 - 1.6, Math.random() * 23.0, Math.random() * 3.2 - 1.6)
		)
	}
	
	this.smokeMaterial = new THREE.PointCloudMaterial({
		map: THREE.ImageUtils.loadTexture('/assets/img/smoke.png'),
		transparent: true,
		blending: THREE.AdditiveBlending,
		size: 10,
		color: 0x111111
	})
	
	this.smoke = new THREE.PointCloud( this.smokeParticles, this.smokeMaterial )
	this.smoke.sortParticles = true
	
	this.add( this.smoke )
*/

	this.update = function( delta ){
/*				
		var particleCount = this.smokeParticles.vertices.length;
		while (particleCount--) {
		    var particle = this.smokeParticles.vertices[particleCount];
		    particle.y += delta * 5.0;
		     
		    if (particle.y >= 23.0) {
		        particle.y = Math.random() * 1.6;
		        particle.x = Math.random() * 3.2 - 1.6;
		        particle.z = Math.random() * 3.2 - 1.6;
		    }
		}
		this.smokeParticles.__dirtyVertices = true;
*/
		this.rotation.y += 25 * delta
	}
	
	
}



FW.Flame.prototype = Object.create( FW.Item.prototype )
FW.Flame.prototype.constructor = FW.Flame










