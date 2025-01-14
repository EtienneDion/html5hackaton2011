(function(window) {

//
function SpaceRock(size) {
	this.initialize(size);
}

SpaceRock.prototype = new Shape();

// static properties:
	SpaceRock.LRG_ROCK = 40;
	SpaceRock.MED_ROCK = 20;
	SpaceRock.SML_ROCK = 10;

// public properties:

	SpaceRock.prototype.bounds = 0;	//visual radial size
	SpaceRock.prototype.hit = 0;		//average radial disparity
	
	SpaceRock.prototype.size = 0;		//size value itself
	SpaceRock.prototype.spin = 0;		//spin ammount
	SpaceRock.prototype.score = 0;	//score value
	
	SpaceRock.prototype.vX = 0;		//velocity X
	SpaceRock.prototype.vY = 0;		//velocity Y
	
	SpaceRock.prototype.active = false;	//is it active
	
// constructor:
	SpaceRock.prototype.Shape_initialize = SpaceRock.prototype.initialize;	//unique to avoid overiding base class
	
	SpaceRock.prototype.initialize = function(size) {
		this.Shape_initialize(); // super call
		
		this.activate(size);
	}
	
// public methods:
	//handle drawing a spaceRock
	SpaceRock.prototype.getShape = function(size) {
		var angle = 0;
		var radius = size;
		
		this.size = size;
		this.hit = size;
		this.bounds = 0;
		
		//setup
		this.graphics.clear();
		this.graphics.beginStroke("#FFFFFF");
		
		this.graphics.moveTo(0, size);
		//draw spaceRock
		while(angle < (Math.PI*2 - .5)) {
			angle += .25+(Math.random()*100)/500;
			radius = size+(size/2*Math.random());
			this.graphics.lineTo(Math.sin(angle)*radius, Math.cos(angle)*radius);
			
			//track visual depiction for interaction
			if(radius > this.bounds) { this.bounds = radius; }	//furthest point
			this.hit = (this.hit + radius) / 2;					//running average
		}
		
		this.graphics.closePath(); // draw the last line segment back to the start point.
		this.hit *= 1.1; //pad a bit
	}
	
	//handle reinit for poolings sake
	SpaceRock.prototype.activate = function(size) {
		this.getShape(size);	
		
		//pick a random direction to move in and base the rotation off of speed
		var angle = Math.random()*(Math.PI*2);
		this.vX = Math.sin(angle)*(5 - size/10);
		this.vY = Math.cos(angle)*(5 - size/10);
		this.spin = (Math.random() + 0.2 )* this.vX;
		
		//associate score with size
		this.score = (5 - size/10) * 100;
		this.active = true;
	}
	
	//handle what a spaceRock does to itself every frame
	SpaceRock.prototype.tick = function() {
		this.rotation += this.spin;
		this.x += this.vX;
		this.y += this.vY;
	}
	
	//position the spaceRock so it floats on screen
	SpaceRock.prototype.floatOnScreen = function(width, height) {
		//base bias on real estate and pick a side or top/bottom
		if(Math.random()*(width+height) > width) {
			//side; ensure velocity pushes it on screen
			if(this.vX > 0) {
				this.x = -2 * this.bounds;
			} else {
				this.x = 2 * this.bounds + width;
			}
			//randomly position along other dimension
			if(this.vY > 0) {
				this.y = Math.random()*height*0.5;
			} else {
				this.y = Math.random()*height*0.5 + 0.5*height;
			}
		} else {
			//top/bottom; ensure velocity pushes it on screen
			if(this.vY > 0) {
				this.y = -2 * this.bounds;
			} else {
				this.y = 2 * this.bounds + height;
			}
			//randomly position along other dimension
			if(this.vX > 0) {
				this.x = Math.random()*width*0.5;
			} else {
				this.x = Math.random()*width*0.5 + 0.5*width;
			}
		}
	}
	
	SpaceRock.prototype.hitPoint = function(tX, tY) {
		return this.hitRadius(tX, tY, 0);
	}
	
	SpaceRock.prototype.hitRadius = function(tX, tY, tHit) {
		//early returns speed it up
		if(tX - tHit > this.x + this.hit) { return; }
		if(tX + tHit < this.x - this.hit) { return; }
		if(tY - tHit > this.y + this.hit) { return; }
		if(tY + tHit < this.y - this.hit) { return; }
		
		//now do the circle distance test
		return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
	}


window.SpaceRock = SpaceRock;
}(window));