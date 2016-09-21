

FW.Objects = {

	player : {
		url			: 'assets/3d/player.js',
		geometry		: null,
		material		: null
	},

	wall : {
		url			: 'assets/3d/wall.js',
		geometry		: null,
		material		: null
	},

	wall_var2 : {
		url			: 'assets/3d/wall_var2.js',
		geometry		: null,
		material		: null
	},

	wall_var3 : {
		url			: 'assets/3d/wall_var3.js',
		geometry		: null,
		material		: null
	},

	monster : {
		url			: 'assets/3d/monster/monster.js',
		geometry		: null,
		material		: null
	},

	gift : {
		url			: 'assets/3d/gift.js',
		geometry		: null,
		material		: null
	},
	
	rocket : {
		url			: 'assets/3d/os.js',
		geometry		: null,
		material		: null
	},
	
	trap : {
		url			: 'assets/3d/trap.js',
		geometry		: null,
		material		: null
	},
	
	bomb : {
		url			: 'assets/3d/bomb.js',
		geometry		: null,
		material		: null
	},
	
	flame : {
		url			: 'assets/3d/flame.js',
		geometry		: null,
		material		: null
	},
	
	marker : {
		url			: 'assets/3d/marker.js',
		geometry		: null,
		material		: null
	}

	
}





FW.Preloader = function( appCallback ){
	
	THREE.JSONLoader.apply( this )

	this.callback = appCallback
	
	this.onLoadComplete = function(){

		for( var i in FW.Objects ){

			if( FW.Objects[i].geometry == null && FW.Objects[i].material == null ) {

				this.load( FW.Objects[i].url, function( geometry, material ){

				//	
					
					FW.Objects[i].geometry = geometry
					FW.Objects[i].material = material
					
					/*
					//-- texture covering the mesh
					image = '/assets/img/wall.png'
					for( j in material ) {
						if( material[j].map ) {
							if( material[j].map.image ) {
								image = material[j].map.image.sourceFile
								return
							}
						}
					}
					FW.Objects[i].material = new THREE.MeshPhongMaterial({
						map: THREE.ImageUtils.loadTexture( image, new THREE.UVMapping()  )
					})
					*/

				}, '/assets/img/' )
				
				
				return
			}
		}
		this.callback()
	}
	
	this.onLoadComplete()
}




FW.Preloader.prototype = Object.create( THREE.JSONLoader.prototype )
FW.Preloader.prototype.constructor = FW.Preloader




			
			
			
			
			