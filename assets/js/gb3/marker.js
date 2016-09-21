


FW.Marker = function(){

	FW.Item.apply( this, arguments )

	this.type = "marker"

	this.geometry = FW.Objects.marker.geometry
	this.material = new THREE.MeshFaceMaterial( FW.Objects.marker.material )

	this.update = function(delta){}

}



FW.Marker.prototype = Object.create( FW.Item.prototype )
FW.Marker.prototype.constructor = FW.Marker








