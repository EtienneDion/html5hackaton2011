(function(window) {

//
function Ship() {
  this.initialize();
}
Ship.prototype = new Container();

// public properties:
	Ship.TOGGLE = 60;
	Ship.MAX_THRUST = 2;
	Ship.MAX_VELOCITY = 5;

// public properties:
	Ship.prototype.shipFlame = null;
	Ship.prototype.shipBody = null;
	
	Ship.prototype.timeout = 0;
	Ship.prototype.thrust = 0;
	
	Ship.prototype.vX = 0;
	Ship.prototype.vY = 0;
	
	Ship.prototype.bounds = 0;
	Ship.prototype.hit = 0;
	
// constructor:
	Ship.prototype.Container_initialize = Ship.prototype.initialize;	//unique to avoid overiding base class
	
	Ship.prototype.initialize = function() {
		this.Container_initialize();
		
		this.shipFlame = new Shape();
		this.shipBody = new Shape();
		
		this.addChild(this.shipFlame);
		this.addChild(this.shipBody);
		
		this.makeShape();
		this.timeout = 0;
		this.thrust = 0;
		this.vX = 0;
		this.vY = 0;
	}
	
// public methods:
	Ship.prototype.makeShape = function() {
		//draw ship body
		var g = this.shipBody.graphics;
		g.clear();
		g.beginStroke("#FFFFFF");
		
		g.moveTo(0, 10);	//nose
		g.lineTo(5, -6);	//rfin
		g.lineTo(0, -2);	//notch
		g.lineTo(-5, -6);	//lfin
		g.closePath(); // nose
		
		
		//draw ship flame
		var o = this.shipFlame;
		o.scaleX = 0.5;
		o.scaleY = 0.5;
		o.y = -5;
		
		g = o.graphics;
		g.clear();
		g.beginStroke("#FFFFFF");
		
		
		g.moveTo(2, 0);		//ship
		g.lineTo(4, -3);	//rpoint
		g.lineTo(2, -2);	//rnotch
		g.lineTo(0, -5);	//tip
		g.lineTo(-2, -2);	//lnotch
		g.lineTo(-4, -3);	//lpoint
		g.lineTo(-2, -0);	//ship
		
		//furthest visual element
		this.bounds = 10; 
		this.hit = this.bounds;
	}
	
	Ship.prototype.tick = function() {
		//move by velocity
		this.x += this.vX;
		this.y += this.vY;
		
		//with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
		if(this.thrust > 0) {
			this.timeout++;
			this.shipFlame.alpha = 1;
			
			if(this.timeout > Ship.TOGGLE) {
				this.timeout = 0;
				if(this.shipFlame.scaleX == 1) {
					this.shipFlame.scaleX = 0.5;
					this.shipFlame.scaleY = 0.5;
				} else {
					this.shipFlame.scaleX = 1;
					this.shipFlame.scaleY = 1;
				}
			}
			this.thrust -= 0.5;
		} else {
			this.shipFlame.alpha = 0;
			this.thrust = 0;
		}
	}
	
	Ship.prototype.accelerate = function() {
		//increase push amount for acceleration
		this.thrust += this.thrust + 0.6;
		if(this.thrust >= Ship.MAX_THRUST) {
			this.thrust = Ship.MAX_THRUST;
		}
		
		//accelerate
		this.vX += Math.sin(this.rotation*(Math.PI/-180))*this.thrust;
		this.vY += Math.cos(this.rotation*(Math.PI/-180))*this.thrust;
		
		//cap max speeds
		this.vX = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vX));
		this.vY = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vY));
	}

window.Ship = Ship;
}(window));