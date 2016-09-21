

FW.Objects = {

	player : {
		url			: 'assets/3d/player.dae',
//		geometry		: null,
//		material		: null,
		collada		: null
	},
	
	wall : {
		url			: 'assets/3d/wall.dae',
//		geometry		: null,
//		material		: null,
		collada		: null
	},
	
	wall2 : {
		url			: 'assets/js/three.js-master/examples/models/collada/monster/monster.dae',
		collada		: null
	},

	gift : {
		url			: 'assets/3d/gift.dae',
//		geometry		: null,
//		material		: null,
		collada		: null
	},

	rocket : {
		url			: 'assets/3d/os.dae',
//		geometry		: null,
//		material		: null,
		collada		: null
	},

	trap : {
		url			: 'assets/3d/trap.dae',
//		geometry		: null,
//		material		: null,
		collada		: null
	},
/*
	bomb : {
		url			: 'assets/3d/bomb.dae',
//		geometry		: null,
//		material		: null,
		collada		: null
	}
*/

}



/*

FW.Preloader = function( appCallback ){
	
	var loader = new THREE.ColladaLoader()

	for( var i in FW.Objects ){
		
		loader.load( FW.Objects[i].url, function( collada ) {
			
console.log( FW.Objects[i].url )
console.log( collada )		
/*
			collada.scene.traverse( function( child ) {
				if( child instanceof THREE.SkinnedMesh ) {
					var animation = new THREE.Animation( child, child.geometry.animation )
					animation.play()
				}
			})
* /
			FW.Objects[i].collada = collada.scene

		})

	}

	appCallback()
}
*/




FW.Preloader = function( appCallback ){

	THREE.ColladaLoader.apply( this )

	var scope = this

	this.callback = appCallback
	
	this.onLoadComplete = function(){

		for( var i in FW.Objects ){

			if( FW.Objects[i].collada == null ) {

				this.load( FW.Objects[i].url, function( collada ) {
/*	
					collada.scene.traverse( function( child ) {
						if( child instanceof THREE.SkinnedMesh ) {
							var animation = new THREE.Animation( child, child.geometry.animation )
							animation.play()
						}
					})
					collada.scene.updateMatrix()
		
					FW.Objects[i].collada = collada.scene
*/					

					FW.Objects[i].collada = collada.scene

					scope.onLoadComplete()
				} )
				
				return
			}
		}

		console.log( FW.Objects )
		this.callback()
	}
	
	this.onLoadComplete()
}





FW.Preloader.prototype = new THREE.ColladaLoader()
FW.Preloader.prototype.constructor = FW.Preloader
	
			