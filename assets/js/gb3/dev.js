

FW.Dev = function(){

	THREE.Mesh.apply( this )

	this.grid.position.y = -0.1
	this.grid.rotation.x = 90 * Math.PI / 180 // radian
	
	this.add( this.grid )
	this.add( this.axis  )

}



FW.Dev.prototype = Object.create( THREE.Mesh.prototype )
FW.Dev.prototype.constructor = FW.Dev




FW.Dev.prototype.grid = new THREE.GridHelper( 50, 2 )


/*
	red : x
	green : y
	blue : z
*/
FW.Dev.prototype.axis = new THREE.AxisHelper( 10 )





