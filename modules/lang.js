
fr = {
	life		: "vie",
	lifes	: "vies",
	ammos	: "munitions",
	bomb		: "bombe",
	rocket	: "crockette",
	trap		: "piège",
	strong	: "invincible",
	speed	: "rapide",
	
	start : [
		"Go go go ! ! !",
		"Assomme-les tous !",
		"Allez, montre-leur qui est le boss...",
		"Il faut faire respecter ta loi maintenant...",
		"Eradique tes ennemis sans pitié !",
		"Il ne dois en rester aucun !"
	],
	
	dead : [
		"Tu as été éradiqué",
		"Tu as mordu la poussière",
		"Tu as quitté l'arène comme une fillette",
		"Tu as été désintégré",
		"Tu t'es fait reconduire à la sortie",
		"Tu a été ridiculisé",
		"Tu n'a pas tenu le choc",
		"Tu a servi de chair à canon",
		"C'en est fini de toi !"
	],
	
	
	shot : [
		" a mis une raclée à ",
		" a expliqué la vie à ",
		" a montré ses poils à ",
		" a fait mordre la opussière à ",
		" a retiré sa fierté à ",
		" a humilié ",
		" a fait plier le genoux à ",
		" a ridiculisé ",
		" a donné une bonne fessé à ",
		" a fait baisser son pantalon à ",
		" a soumi "
	]
}



//----------------------------------------------------------------------------

//
//	Calling this function allow to get the french traduction of the app.
//	For some keywords, the traduction is the result of a random key phare.
//
//
lng = function( key ){
	if( ["start","dead","shot"][key] )
		return fr[key][Math.floor( Math.random()*fr[key].length)]
		else
		return lng[key]
}


module.exports = {
	lng : lng
}




