



FW.Wall = function(){

	FW.Item.apply( this, arguments )
	
	this.type = "wall"

	switch( Math.floor(Math.random()*3) ) {
		case 0 :
			this.geometry = FW.Objects.wall.geometry
			this.material = new THREE.MeshFaceMaterial( FW.Objects.wall.material )
			break
	
		case 1 :
			this.geometry = FW.Objects.wall_var2.geometry
			this.material = new THREE.MeshFaceMaterial( FW.Objects.wall_var2.material )
			break
	
		case 2 :
			this.geometry = FW.Objects.wall_var3.geometry
			this.material = new THREE.MeshFaceMaterial( FW.Objects.wall_var3.material )
			break
	}
	
	this.update = function(delta){}
}



FW.Wall.prototype = Object.create( FW.Item.prototype )
FW.Wall.prototype.constructor = FW.Wall









