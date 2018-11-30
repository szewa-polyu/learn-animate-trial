// kynd.info 2014
// http://paperjs.org/examples/candy-crash/
import paper, { Path, Point, Raster } from 'paper';


function Ball(r, p, v, angularSpeed, scaleChangeSpeed, scaleChangeAmplitude, imgUrl) {
	this.radius = r;
	this.point = p;
	this.vector = v;
	this.maxVec = 15;
	this.numSegment = Math.floor(r / 3 + 2);
	this.boundOffset = [];
	this.boundOffsetBuff = [];
	this.sidePoints = [];
	this.path = new Path({
		// fillColor: {
		// 	hue: Math.random() * 360,
		// 	saturation: 1,
        //  brightness: 1,            
		// },
		fillColor: {
			hue: 185,
			saturation: .52,
			brightness: .71
		},
        blendMode: 'lighter'  // Important: overlap colors during collision 
	});

	this.angleRotated = 0;
	this.angularSpeed = angularSpeed;
	
	this.sizeChangeSpeed = scaleChangeSpeed;
	this.scaleChangeAmplitude = scaleChangeAmplitude;

	this.raster = new Raster(imgUrl);
	this.raster.position = p;

	this.counter = 0;

	for (let i = 0; i < this.numSegment; i ++) {
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
		this.path.add(new Point());
		// Important
		// (display size : collision size) ratio
		//const displayToCollisionSizeRatio = 1;
		const displayToCollisionSizeRatio = 1;
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: displayToCollisionSizeRatio
		}));
	}	
}

Ball.prototype = {
	iterate: function() {
		this.checkBorders();
		if (this.vector.length > this.maxVec) {
            //this.vector.length = this.maxVec;
			
            const tempVector = this.vector.normalize();
            this.vector = new Point({
                x: tempVector.x * this.maxVec,
                y: tempVector.y * this.maxVec
            });
		}
		
		// Important
		// vector damping
		// if 0 < vectorDampFactor < 1,
		// then the balls will eventually be stationary
		//const vectorDampFactor = -1 + 2 * Math.random();
		const vectorDampFactor = 1;
		this.vector = new Point({
			x: this.vector.x * vectorDampFactor,
			y: this.vector.y * vectorDampFactor 
		});

        //this.point += this.vector;
        this.point = new Point({
            x: this.point.x + this.vector.x,
            y: this.point.y + this.vector.y
		});

		// Important
		// rotation of raster
		// rotation damping
		const rotationDampFactor = 0.999;
		this.angularSpeed *= rotationDampFactor;
		this.angleRotated += this.angularSpeed;
		
		// set position, rotation and scale of raster
		this.raster.position = this.point;
		this.raster.rotate(this.angleRotated);
		// Important: new scale = current scale * scale factor (having damping effect by default)
		
		// TODO:
		//this.raster.scale(scaleFactor);
		const newScale = 1 + this.scaleChangeAmplitude * Math.sin(this.sizeChangeSpeed * this.counter);
		this.raster.scaling = new Point({
			x: newScale,
			y: newScale
		});

		this.updateShape();		

		this.counter++;

		//console.log(this.counter);
	},

	checkBorders: function() {
		const size = paper.view.size;
		if (this.point.x < -this.radius)
			this.point.x = size.width + this.radius;
		if (this.point.x > size.width + this.radius)
			this.point.x = -this.radius;
		if (this.point.y < -this.radius)
			this.point.y = size.height + this.radius;
		if (this.point.y > size.height + this.radius)
            this.point.y = -this.radius;                
	},

	updateShape: function() {	
		const segments = this.path.segments;		
		for (let i = 0; i < this.numSegment; i ++) {
			segments[i].point = this.getSidePoint(i);			
		}

		this.path.smooth();
		for (let i = 0; i < this.numSegment; i ++) {
			if (this.boundOffset[i] < this.radius / 4) {
                this.boundOffset[i] = this.radius / 4;
            }
            const next = (i + 1) % this.numSegment;
			const prev = (i > 0) ? i - 1 : this.numSegment - 1;
			let offset = this.boundOffset[i];
			offset += (this.radius - offset) / 15;
			offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
		}
	},

	react: function(b) {		
		const dist = this.point.getDistance(b.point);
		if (dist < this.radius + b.radius && dist !== 0) {
            var overlap = this.radius + b.radius - dist;
            var differenceVector = new Point({
                x: this.point.x - b.point.x,
                y: this.point.y - b.point.y
            });
            // Important:			
			// affect speed after collision
			// hence affect deform of ball shape
			// bigger collisionDeformExtent, less deform
			//const collisionDeformExtent = 0.015;
			const collisionDeformExtent = 0.015;
			const direc = differenceVector.normalize(overlap * collisionDeformExtent);
			
			// this.vector += direc;
			// b.vector -= direc;

			this.vector = new Point({
				x: this.vector.x + direc.x,
				y: this.vector.y + direc.y,
			});
			b.vector = new Point({
				x: b.vector.x - direc.x,
				y: b.vector.y - direc.y
			});

			this.calcBounds(b);
			b.calcBounds(this);
			this.updateBounds();
			b.updateBounds();
		}
	},

	getBoundOffset: function(b) {
		const diff = this.point - b;
		const angle = (diff.angle + 180) % 360;
		return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	calcBounds: function(b) {
		for (let i = 0; i < this.numSegment; i ++) {
			const tp = this.getSidePoint(i);
            const bLen = b.getBoundOffset(tp);
			const td = tp.getDistance(b.point);
			if (td < bLen) {
				this.boundOffsetBuff[i] -= (bLen  - td) / 2;
			}
		}
	},

	getSidePoint: function(index) {
		// this.boundOffset[index] is scalar
        //return this.point + this.sidePoints[index] * this.boundOffset[index];
        return new Point({
            x: this.point.x + this.sidePoints[index].x * this.boundOffset[index],
            y: this.point.y + this.sidePoints[index].y * this.boundOffset[index]
        });
	},

	updateBounds: function() {
		for (let i = 0; i < this.numSegment; i++)
			this.boundOffset[i] = this.boundOffsetBuff[i];
	}
};

export default Ball;