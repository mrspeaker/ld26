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

		sheet: new Ω.SpriteSheet("res/heads.png", 16),

		init: function (startX, startY, screen) {

			this.screen = screen;

			this.x = startX;
			this.y = startY;
			this.speed = 3;
			this.headAt = 0;

			this.particle = new Ω.Particle({});

			this.anims = new Ω.Anims([
				new Ω.Anim("idle", this.sheet, 500, [[1, 2]]),
				new Ω.Anim("walk", this.sheet, 70, [[2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2]]),
				new Ω.Anim("awalkLeft", this.sheet, 70, [[8, 3], [7, 3], [6, 3], [5, 3], [4, 3], [3, 3], [2, 3], [1, 3]])
			]);

			this.rays = [];

		},

		setMap: function (map) {

			this.map = map;

		},

		tick: function (map) {

			var x1 = 0,
				y1 = 0,
				powpow = this.powpow;

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

			if (Ω.input.pressed("fire")) {
				this.particle.play(this.x + (this.w / 2), this.y + 10, this.angle);
				//this.screen.addBullet(this.x, this.y - 10, this.angle);
				powpow = true;
			}

			if (!(Ω.input.isDown("fire")) && Ω.input.wasDown("fire")) {
				powpow = false;
			}

			if (x1 < 0) {
				this.anims.setTo("awalkLeft");
			} else if (x1 > 0) {
				this.anims.setTo("walk");
			} else {
				this.anims.setTo("idle");
			}

			if (Ω.input.isDown("jump")) {
				if(!this.jumping) {
					this.jump();
					powpow = false;
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

			this.rays = [];

			var ox = this.x + this.w / 2,
				oy = this.y + this.h * 0.2,
				angle = Ω.utils.angleBetween({
					x: (Ω.input.mouse.x + this.screen.camera.x),
					y: (Ω.input.mouse.y + this.screen.camera.y)
				}, {
					x: ox,
					y: oy
				});

			this.angle = angle;
			this.headAt = ((this.angle + Math.PI) / (Math.PI * 2 / 8)) % 8 | 0;

			var hit = Ω.rays.cast(
				angle,
				ox,
				oy,
				this.map
			);

			if (hit) {
				this.rays.push([
					ox,
					oy,
					hit.x * this.map.sheet.w,
					hit.y * this.map.sheet.h]);
				this.screen.paint(hit.x * this.map.sheet.w, hit.y * this.map.sheet.h, angle, powpow);
			}

			this.anims.tick();
			this.particle.tick(angle);

			this.powpow  = powpow;

		},

		hitBlocks: function (blocks) {},

		hit: function (by) {},

		render: function (gfx, map) {

			var self = this;

			//Test raycastin'
			if (this.powpow) {
				this.rays.forEach(function (r) {
					Ω.rays.draw(gfx, r[0], r[1], r[2], r[3], r[4], 32, 32);
				});
			}

			gfx.ctx.fillStyle = "hsla(200, 50%, 50%, 0.8)";

			this.sheet.render(gfx, this.headAt, 0, this.x + 2, this.y - 11);

			this.sheet.render(gfx, 0, 2, this.x + 1, this.y - 3);
			this.sheet.render(gfx, 0, 3, this.x +1, this.y + 11);
			this.anims.render(gfx, this.x + 1, this.y + 17);

			this.sheet.render(gfx, this.headAt, 1, this.x + 2, this.y + (this.headAt > 0 && this.headAt < 4 ? -5 : 5));


			this.particle.render(gfx);

		}

	});

	window.Player = Player;

}(Ω));
