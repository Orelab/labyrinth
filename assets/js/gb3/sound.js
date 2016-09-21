
var FW = ( FW !== undefined ) ? FW : {}

FW.playSound = function( sample ){
	if( FW.cfg.audio ){
		var snd  = new Audio()
		var src  = document.createElement("source")
		src.type = 'audio/mpeg'
		src.src  = '/assets/audio/' + sample + '.mp3'
		snd.appendChild(src)
		snd.play()
	}
}