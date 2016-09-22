


FW.Map = function( callback ){
	

	THREE.Mesh.apply( this )

	
	this.onMapLoaded = callback
	
	this.gameboard = []					// Array of points describing the gameboard
	

	var socket = io.connect( config.port )

	var scope = this						// Closure for socket



	socket.emit('gameboard', {}, function( gb ){

		scope.gameboard = gb

		// walls

		for( var y=0 ; y<gb.length ; y++ ){
			for( var x=0 ; x<gb[y].length ; x++ ){

				if( gb[y][x] == 0 ) {
					var w = new FW.Wall( x * config.brickSize.x + 1, - y * config.brickSize.y - 1, 2 )
					scope.add( w )
				}

			}
		}

		// ground
		
		var pos = scope.getDimension()
		var g = new FW.Item( pos.x, -pos.y, 1 )
		g.type = "ground"
		g.geometry = new THREE.BoxGeometry( config.brickSize.x * x, 2, config.brickSize.y * y )

		var texture = THREE.ImageUtils.loadTexture( '/assets/img/ground-big-alt.png' )
		g.material = new THREE.MeshPhongMaterial({map: texture })
/*
		g.material = new THREE.MeshFaceMaterial([
			new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture( '/assets/img/ground-big.png' ) }),
			new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture( '/assets/img/ground-big-alt.png' ) })
		])
*/
		scope.add( g )


		// stars
		
		var geometry = new THREE.Geometry
				
		for( p=0 ; p<config.world.stars ; p++) {
			
			geometry.vertices.push( new THREE.Vector3(
				Math.random() * 1000 - 500,
				Math.random() * - 1000 - 150,
				Math.random() * 1000 - 500
			))
		}
		
		var material = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 1 })
		

		 
		i = new FW.Item(0,0,0)
		i.add( new THREE.ParticleSystem( geometry, material ) )
		scope.parent.add( i )

		
		// callback
		
		scope.onMapLoaded()

	})



}



FW.Map.prototype = Object.create( THREE.Mesh.prototype )
FW.Map.prototype.constructor = FW.Map







FW.Map.prototype.getDimension = function(){
	
	y = this.gameboard.length
	x = y ? this.gameboard[0].length : 0
	
	return { x:x, y:y }
}




FW.Map.prototype.getIdealCameraPosition = function(){

	gameboardDimension = this.getDimension()
	
	x =   gameboardDimension.x * config.brickSize.x / 2
	y = - gameboardDimension.y * config.brickSize.y / 2

	return { x:x, y:y, z: config.camera.distance }
}









