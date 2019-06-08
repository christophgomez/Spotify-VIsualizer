const NUM_BANDS = 256;
const SCALE = {
	MIN: 15.0,
	MAX: 50.0
};
const SPEED = {
	MIN: 0.2,
	MAX: 1.0
};
const ALPHA = {
	MIN: 0.8,
	MAX: 0.9
};
const SPIN = {
	MIN: 0.001,
	MAX: 0.005
};
const SIZE = {
	MIN: 1.0,
	MAX: 1.25
};

function random (min, max = undefined) {

	if (isArray(min))

		return min[~~(Math.random() * min.length)];

	if (!isNumber(max))

		max = min || 1, min = 0;

	return min + Math.random() * (max - min);
}

function isArray(object) {

	return Object.prototype.toString.call(object) == '[object Array]';
}

function isNumber(object) {

	return typeof object == 'number';
}


var Capsule = class Capsule {

	constructor(x1 = 0, y1 = 0, COLORS = []) {
		this.x = x1;
		this.y = y1;
		this.COLORS = [];
		this.COLORS = COLORS;
		for (var i = 0; i < this.COLORS.length; i++) {
			let symb = '#';
			let color = `${symb}${this.COLORS[i]}`;
			this.COLORS[i] = color;
		}
		this.reset();
	}

	resetColor() {
		this.color = random(this.COLORS);
	}

	reset() {
		this.level = 1 + Math.floor(random(4));
		this.scale = random(SCALE.MIN, SCALE.MAX);
		this.alpha = random(ALPHA.MIN, ALPHA.MAX);
		this.speed = random(SPEED.MIN, SPEED.MAX);
		this.color = random(this.COLORS);
		this.size = random(SIZE.MIN, SIZE.MAX);
		this.spin = random(SPIN.MAX, SPIN.MAX);
		this.band = Math.floor(random(NUM_BANDS));
		if (random() < 0.5) {
			this.spin = -this.spin;
		}
		this.smoothedScale = 0.0;
		this.smoothedAlpha = 0.0;
		this.decayScale = 0.0;
		this.decayAlpha = 0.0;
		this.rotation = random(Math.PI * 2);
		return this.energy = 0.0;
	}

	move() {
		this.rotation += this.spin;
		return this.y -= (this.speed/1.5) * this.level;
	}

	draw(ctx) {
		var alpha, power, scale;
		power = Math.exp(this.energy);
		scale = this.scale * power;
		alpha = this.alpha * this.energy * 1.5;
		this.decayScale = Math.max(this.decayScale, scale);
		this.decayAlpha = Math.max(this.decayAlpha, alpha);
		this.smoothedScale += (this.decayScale - this.smoothedScale) * 0.3;
		this.smoothedAlpha += (this.decayAlpha - this.smoothedAlpha) * 0.3;
		this.decayScale *= 0.985;
		this.decayAlpha *= 0.975;
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x + Math.cos(this.rotation * this.speed) * 250, this.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.smoothedScale * (this.level/2.5), this.smoothedScale * (this.level/2.5));
		ctx.moveTo(this.size * 0.5, 0);
		ctx.lineTo(this.size * -0.5, 0);
		ctx.lineWidth = 1;
		ctx.lineCap = 'round';
		ctx.globalAlpha = this.smoothedAlpha / this.level;
		ctx.strokeStyle = this.color;
		ctx.stroke();
		return ctx.restore();
	}
}

export default Capsule;