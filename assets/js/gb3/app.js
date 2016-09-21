
var FW = ( FW===undefined ) ? {} : FW






if ( ! Detector.webgl ) {
	Detector.addGetWebGLMessage()

	panel = document.getElementById( 'panel' )
	document.getElementsByTagName('body')[0].removeChild( panel )
}


if( ! window.Worker ) {
	newel=xmlDoc.createElement( 'p' )
	newtext=xmlDoc.createTextNode( 'Sorry, your browser do not suppport websocket' )
	newel.appendChild(newtext)
	document.getElementsByTagName('body')[0].appendChild(newel)

	panel = document.getElementById( 'panel' )
	document.getElementsByTagName('body')[0].removeChild( panel )
}




new FW.Preloader( function(){
		 
	var scene = new THREE.Scene()
		
	var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true })

	var ambientLight = new THREE.AmbientLight( 0x404040 )
	scene.add( ambientLight )

	var directionalLight = new THREE.DirectionalLight( 0xffeedd, 1 )
	scene.add( directionalLight )

	var camera = new THREE.PerspectiveCamera( 75, config.width/config.height, 0.1, 1000 )
	//var camera = new THREE.OrthographicCamera( -25, 25, 25, -25, 0.1, 1000 )

	var clock = new THREE.Clock()

	var controls = new THREE.TrackballControls( camera )
	//var controls = new THREE.OrbitControls( camera )

	var socket = io.connect( config.port )

	var register = {
		data		: {},
		timer	: 0,
		latency	: [],
		objects	: {}
	}

	
	
	/*
		Positions
	*/
	
	var onMapLoaded = function(){
		
		pos = this.getIdealCameraPosition()

		directionalLight.position.set( pos.x, pos.y, pos.z ).normalize()
	
		camera.position.x = pos.x
		camera.position.y = pos.y
		camera.position.z = pos.z
		
		camera.lookAt( new THREE.Vector3( pos.x, pos.y, 0 ))
		
	
		controls.target.x = pos.x
		controls.target.y = pos.y
		controls.target.z = 0
		
	}
	
		
	/*
		Adding the map
	*/
	
	var map = new FW.Map( onMapLoaded )
	scene.add( map )



	
	/*
		Extra visibility
		
		This is used by Item for anisotropy, but
		it should be removed for a cleanest code...
	*/

	FW.renderer = renderer
	FW.register = register

	


	
	
	
	/*
		Stats
	*/
		
	var stats = new Stats()
	document.getElementById('panel').appendChild( stats.domElement )
	
	
	
	
	/*
		QR Code
	*/
	
	url = document.URL.split('/').slice(0,3).join('/') + '/control'
	
	qr = qrcode( 3, 'M' )
	qr.addData(  url )
	qr.make()
	
	document.getElementById('qrcode').innerHTML = qr.createImgTag(6, 0)	

	
	







	/*
		Game
	*/

	var addObject = function( o ){

		switch( o.name ) {

			case 'gift' :
				mesh = new FW.Gift( o.x * config.brickSize.x + 1, - o.y * config.brickSize.y - 1.05, 3, o )
				break

			case 'rocket' :
				mesh = new FW.Rocket( o.x * config.brickSize.x + 1, - o.y * config.brickSize.y - 1.2, 3, o )
				break

			case 'bomb' :
				mesh = new FW.Bomb( o.x * config.brickSize.x + 1, - o.y * config.brickSize.y - 1, 3, o )
				break

			case 'trap' :
				mesh = new FW.Trap( o.x * config.brickSize.x + 1, - o.y * config.brickSize.y - 1.1, 2.5, o )
				break

			case 'monster' :
				mesh = new FW.Monster( o.x * config.brickSize.x + 0.2, - o.y * config.brickSize.y - 1, 2.1, o )
				break

			case 'monster2' :
				mesh = new FW.Monster2( o.x * config.brickSize.x + 0.2, - o.y * config.brickSize.y - 1, 2.1, o )
				break
				
			case 'flame' :
				mesh = new FW.Flame( o.x * config.brickSize.x + 1, - o.y * config.brickSize.y - 1, 2.1, o )
				mesh.die( o.lifetime )
				break
				
			case 'marker' :
				mesh = new FW.Marker( o.x * config.brickSize.x, - o.y * config.brickSize.y, 2, o )
				break
				
			default :
				if( o.type == 'player' )
					mesh = new FW.Player( o.x * config.brickSize.x + 1, - o.y * config.brickSize.y - 1, 2.8, o )
					else
					return
		}
		
		if( mesh.data.type == "player" )
			console.log( mesh.data._id )
		
		map.add( mesh )
		return mesh
	}




	socket.on( 'update', function( o ) {
		

		//-- associative array conversion
		
		data = {}
		
		for( var i=0 ; i<o.objects.length ; i++ ){
			obj = o.objects[i]
			data[obj._id] = obj
		}


		//-- saving array
	
		latency = (new Date).getTime() - o.time

		register.data = data
		register.timer = o.time

		if( register.latency.length>50 ){
			register.latency.shift()
		}
		register.latency.push( latency )

		updateInnerHTML( document.getElementById('latency'),  parseInt( register.latency.average() ) )


		//-- removing destroyed objects
		
		for( id in register.objects ){
			if( ! (id in register.data) ){
				register.objects[id].die()
			}
		}


		//-- adding new objects

		for( id in register.data ){
			if( ! (id in register.objects) ){
				register.objects[id] = addObject( register.data[id] )
			}
		}

	})





	

	/*
		Debug
	*/

	if( config.dev ) {

		var dev = new FW.Dev()
		scene.add( dev )
		
		x = 5
		y = 21
		addObject({ _id : 'fakeid0', 	name : 'monster',	room : 'default',	x : x,	y : y	})
		addObject({ _id : 'fakeid1', 	name : 'monster2',	room : 'default',	x : x+1,	y : y	})
		addObject({ _id : 'fakeid2',	name : 'bomb',		room : 'default',	x : x+2,	y : y	})
		addObject({ _id : 'fakeid3',	name : 'trap',		room : 'default',	x : x+3,	y : y	})
		addObject({ _id : 'fakeid4',	type : 'player',	room : 'default',	x : x+4,	y : y	})
		addObject({ _id : 'fakeid5',	name : 'rocket',	room : 'default',	x : x+5,	y : y	})
		addObject({ _id : 'fakeid6',	name : 'gift',		room : 'default',	x : x+6,	y : y	})
		addObject({ _id : 'fakeid7',	name : 'flame',	room : 'default',	x : x+7,	y : y	})
		addObject({ _id : 'fakeid8',	name : 'marker',	room : 'default',	x : x+8,	y : y	})
	}


	dbg_logregister = function(){
		for( key in register ){
			if( register[key].type == "player" ) {
				console.log( register[key] )
			}
		}
	}
	
	dbg_activatedebug = function(){
		config.dev = ! config.dev
	}
	
	document.getElementById( 'debug' ).addEventListener( 'click', dbg_activatedebug, false )


		
	/*
		rendering
	*/
	
	var e = renderer.domElement
		e.id = 'gameboard'
		e.width = config.width
		e.height = config.height
	
	document.body.appendChild( e )
	



	/*
		Window resize
	*/
		
	
	function onWindowResize( event ) {
		renderer.setSize( window.innerWidth, window.innerHeight )
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		controls.handleResize()
	}

	window.addEventListener( 'resize', onWindowResize, false )
	onWindowResize()




	/*
		Moving objects
	*/

	cameraMove = function( delta ){
		if( typeof pos != 'undefined' ) {
			x = Math.cos( config.camera.pos ) * config.camera.radius + pos.x
			y = Math.sin( config.camera.pos ) * config.camera.radius - pos.y
			
			camera.position.x = x
			camera.position.y = -y
			
			camera.lookAt( new THREE.Vector3(pos.x,pos.y,0) )

			config.camera.pos += config.camera.speed
		}
	}
	
	
	

	function render(){

		requestAnimationFrame( render )

		var delta = clock.getDelta()

		THREE.AnimationHandler.update( delta )

		// animation
	
		for( var i=0 ; i<map.children.length ; i++ ) {

			o = map.children[i]
			o.update( delta )
		}	

		stats.update()

		if( config.dev )
			controls.update( delta )
			else
			cameraMove( delta )

		renderer.render( scene, camera )
	}

	
	render()


} )






