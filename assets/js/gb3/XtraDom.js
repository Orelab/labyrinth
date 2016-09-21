

//-- no more used

Math.roundDec = function( val, nDecimal ){
	var exp = Math.pow(10,nDecimal)
	return Math.round( val * exp ) / exp
}




//-- used in camera auto updating

updateInnerHTML = function( node, content ) {

	while( node.hasChildNodes() ) {
		node.removeChild( node.lastChild )
	}
	switch( node.nodeName ) {
		case 'INPUT' :		node.setAttribute( 'value', content ) ;break
		default :			node.appendChild( document.createTextNode(content) )
	}
}


//-- array average

Array.prototype.average = function(){
	var sum = 0
	
	for( var i=0 ; i<this.length ; i++ ){
		sum += parseFloat( this[i] )
	}
	return sum / this.length
}


/*
 *	NO MORE USED
 *
 * Fonction de clonage
 * @author Keith Devens
 * @see http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
 */
function clone(srcInstance)
{
	/*Si l'instance source n'est pas un objet ou qu'elle ne vaut rien c'est une feuille donc on la retourne*/
	if(typeof(srcInstance) != 'object' || srcInstance == null)
	{
		return srcInstance;
	}
	/*On appel le constructeur de l'instance source pour crée une nouvelle instance de la même classe*/
	var newInstance = srcInstance.constructor();
	/*On parcourt les propriétés de l'objet et on les recopies dans la nouvelle instance*/
	for(var i in srcInstance)
	{
		newInstance[i] = clone(srcInstance[i]);
	}
	/*On retourne la nouvelle instance*/
	return newInstance;
}