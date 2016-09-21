
/**
 *
 *	20x19 grid
 *
 */

module.exports = {

	
	
	grid: [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
		[0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
		[1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
		[1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,1,1,0,0,0,1,1,1,1,1,1,0,1,0,0,0,0,1],
		[1,0,1,0,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1],
		[1,0,1,0,1,1,0,1,1,1,1,1,1,0,0,0,1,1,1,0],
		[1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
		[1,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
		[1,1,1,1,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,1],
		[0,1,0,0,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1],
		[0,1,0,1,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1],
		[0,1,0,1,0,0,1,0,1,0,1,0,1,1,1,1,1,1,0,1],
		[0,1,0,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,1],
		[0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,1,1],
		[0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0]
	],
	
	
	
	
	// A list of strategic coords where new items can appear
	
	landing: [
		{ y: 0,  x: 0  },
		{ y: 0,  x: 9  },
		{ y: 0,  x: 19 },
		{ y: 2,  x: 6  },
		{ y: 2,  x: 13 },
		{ y: 4,  x: 1  },
		{ y: 4,  x: 11 },
		{ y: 5,  x: 0  },
		{ y: 5,  x: 17 },
		{ y: 6,  x: 3  },
		{ y: 6,  x: 7  },
		{ y: 6,  x: 14 },
		{ y: 7,  x: 2  },
		{ y: 8,  x: 5  },
		{ y: 8,  x: 19 },
		{ y: 9,  x: 8  },
		{ y: 9,  x: 11 },
		{ y: 9,  x: 17 },
		{ y: 11, x: 17 },
		{ y: 11, x: 12 },
		{ y: 12, x: 0  },
		{ y: 12, x: 9  },
		{ y: 13, x: 4  },
		{ y: 13, x: 11 },
		{ y: 13, x: 17 },
		{ y: 14, x: 4  },
		{ y: 14, x: 19 },
		{ y: 15, x: 10 },
		{ y: 16, x: 5  },
		{ y: 16, x: 10 },
		{ y: 16, x: 12 },
		{ y: 17, x: 10 },
		{ y: 17, x: 15 },
		{ y: 18, x: 12 }
	],
	
	
	
	
	getSize: function(){
		y = game.arena.grid.length
		if(y){
			x = game.arena.grid[y-1].length
			if(x)
				return {x:x,y:y}	
				else
				return false
		}
		else return false	
	},
	
	
	getPosition: function( x, y ){
		if( game.arena.grid[y] )
			if( game.arena.grid[y][x])
				return game.arena.grid[y][x]
				else
				return false
			else
			return false
	},
	
	
	//
	//	objectType is a list of type (ex : ['player','item'])
	//
	getItemsAtPosition: function( objectType, x, y, callback ){
		req = {type:{$in:objectType},x:x,y:y}

		//game.db.items.find(callback)
		game.db.items.find(req).forEach(callback)
	},
	
	
	
	getRandomLandingPlace: function(){
		return this.landing[Math.floor(Math.random() * this.landing.length)]
	},
	
	getRandomGroundPlace: function(){},



	/**
	 *	Returns the destination in {x, y} format, 
	 *	or false if destination is out of range.
	 */
	convDir2Coord: function( obj, direction ){
		a = game.arena.getSize()

		switch( direction ){
				case "top": 	if( obj.y > 0 )   return { x:obj.x,   y:obj.y-1 }; else return false 
				case "right":  if( obj.x < a.x ) return { x:obj.x+1, y:obj.y   }; else return false 
				case "bottom": if( obj.y < a.y ) return { x:obj.x,   y:obj.y+1 }; else return false 
				case "left":   if( obj.x > 0 )   return { x:obj.x-1, y:obj.y   }; else return false 
		}
	}
}





