


self.addEventListener( 'message', function( pos ) {

	pos = pos.data

	diffX = pos.toX - pos.fromX
	diffY = pos.toY - pos.fromY
	
	newPosX = pos.realX + ( diffX * pos.delta / 0.2 )
	newPosY = pos.realY + ( diffY * pos.delta / 0.2 )


	// Check that newPos is between fromX and toX
	// and recording moving direction

	var resp = {
		direction : "none",
		x		: 0,
		y		: 0,
		_id		: pos._id
	}

	if( pos.fromX > pos.toX ) {								// Go left
		
		if( pos.fromX > newPosX && newPosX > pos.toX ) {
			resp.x = newPosX
			resp.direction = "left"
		} else {
			resp.x = pos.toX
		} 
		
	} else {												// Go right
		 
		if( pos.fromX < newPosX && newPosX < pos.toX ) {
			resp.x = newPosX
			resp.direction = "right"
		} else {
			resp.x = pos.toX
		} 
	}
	
	
	if( pos.fromY > pos.toY ) {								// Go bottom
		 
		if( pos.fromY > newPosY && newPosY > pos.toY ) {
			resp.y = newPosY
			resp.direction = "bottom"
		} else {
			resp.y = pos.toY
		}
		
	} else {												// Go top
		 
		if( pos.fromY < newPosY && newPosY < pos.toY ) {
			resp.y = newPosY
			resp.direction = "top"
		} else {
			resp.y = pos.toY
		} 
	}

	 self.postMessage( resp )
}, false)


