(function (Ω) {

	"use strict";

	var Player = Ω.Entity.extend({

		w: 20,
		h: 30,

		sounds: {
			"note1": new Ω.Sound("res/audio/note1", 0.5, false),
			"note2": new Ω.Sound("res/audio/note2", 0.5, false),
			"note3": new Ω.Sound("res/audio/note3", 0.5, false),
			"note4": new Ω.Sound("res/audio/note4", 0.5, false)
		},

		init: function (startX, startY, screen) {

			// FIXME: need event system (or something) instead of this.
			this.screen = screen;

			this.x = startX;
			this.y = startY;
			this.yPow = 0;

			this.speed = 3;

			this.rays = [];

		},

		setMap: function (map) {
			this.map = map;
		},

		tick: function (map) {

			var x1 = 0,
				y1 = 0,
				powpow = false;

			if (this.yPow < 11) {
				//y1 += (this.yPow++);
			}
			if (Ω.input.isDown("left")) {
				if(Ω.input.pressed("right")){
					Ω.input.release("left");
				} else {
					x1 -= this.speed;
				}
			}
			if (Ω.input.isDown("right")) {
				if(Ω.input.pressed("left")){
					Ω.input.release("right");
				} else {
					x1 += this.speed;
				}
			}
			if (Ω.input.isDown("up")) {
				if(Ω.input.pressed("down")){
					Ω.input.release("up");
				} else {
					//y1 -= this.speed;
				}
			}
			if (Ω.input.isDown("down")) {
				if(Ω.input.pressed("up")){
					Ω.input.release("down");
				} else {
					y1 += this.speed;
				}

			}
			if (Ω.input.isDown("fire")) {
				//this.yPow = -10;
				//console.log(this.rays[0]);
				powpow = true;
			}
			if (Ω.input.isDown("jump")) {
				if(!this.jumping) {
					this.jump();
					var sound = this.sounds["note" + (Math.random() * 4 + 1| 0)];
					sound.play();
				}
			}

			if (this.jumping) {
				if(this.jumpspeed ++ > this.h) {
					this.jumpspeed = this.h;
				}
				y1 += this.jumpspeed
			}

			this.move(x1, y1, map);

			var feetBlocks = map.getBlocks([
				[this.x, this.y + this.h + 1],
				[this.x + this.w, this.y + this.h + 1]
			]);

			if (!this.falling) {
				if(feetBlocks[0] === 0 && feetBlocks[1] === 0){
					this.falling = true;
				}
			}
			if (this.jumping) {
				if(feetBlocks[0] || feetBlocks[1]) {
					this.jumping = false;
				}
			}

			// Test raycastin'
			this.rays = [];
			// for (var i = 0; i < Math.PI * 2; i+= 0.2) {
			// 	var hit = Ω.rays.cast(i, this.x + this.w / 2, this.y + this.h / 2, this.map);
			// 	if (hit) {
			// 		this.rays.push([
			// 			this.x + this.w / 2,
			// 			this.y + this.h / 2,
			// 			hit.x * this.map.sheet.w,
			// 			hit.y * this.map.sheet.h]);
			// 	}
			// }

			var ox = this.x + this.w / 2,
				oy = this.y + this.h / 2,
				angle = Ω.utils.angleBetween({
					x: (Ω.input.mouse.x + this.screen.camera.x), // * (640 / window.innerWidth),
					y: (Ω.input.mouse.y + this.screen.camera.y) //* (480 / window.innerHeight)
				}, {
					x: ox,
					y: oy
				});

			var hit = Ω.rays.cast(
				angle,
				ox,
				oy,
				this.map
			);

			if (hit) {
				this.rays.push([
					this.x + this.w / 2,
					this.y + this.h / 2,
					hit.x * this.map.sheet.w,
					hit.y * this.map.sheet.h]);
				this.screen.paint(hit.x * this.map.sheet.w, hit.y * this.map.sheet.h, angle, powpow);
			}

			this.powpow  = powpow;

		},

		hitBlocks: function (blocks) {

		},

		hit: function (by) {

		},

		render: function (gfx, map) {

			var self = this;

			//Test raycastin'
			/*if (this.powpow) {
				this.rays.forEach(function (r) {
					Ω.rays.draw(gfx, r[0], r[1], r[2], r[3], r[4], 32, 32);
				});

			//}*/

			gfx.ctx.fillStyle = "hsla(200, 50%, 50%, 0.8)";
			gfx.ctx.fillRect(this.x, this.y, this.w, this.h);

		}

	});

	window.Player = Player;

}(Ω));
