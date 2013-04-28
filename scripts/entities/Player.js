(function (Ω) {

	"use strict";

	var Player = Ω.Entity.extend({

		w: 20,
		h: 30,

		jumpMaxSpeed: -20,
		jumpPause: 9,

		weaponIdx: 0,
		weapon: null,
		weapons: [null, null],

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
				new Ω.Anim("walk", this.sheet, 30, [[2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2]]),
				new Ω.Anim("walkLeft", this.sheet, 30, [[8, 3], [7, 3], [6, 3], [5, 3], [4, 3], [3, 3], [2, 3], [1, 3]])
			]);

			this.rays = [];

			this.reset();

		},

		setMap: function (map) {

			this.map = map;

		},

		pickhit: function (p) {

			p.picked();
		},

		reset: function () {

			this.jumpspeed = 0;
			this.jumping = false;
			this.wasJumping = false;
			this.jumpdebounce = -1;
			this.falling = true;
			this.wasFalling = true;

			this.weapons = [new VisionBrush(this), new LaserBrush(this)];
			this.weaponIdx = 1;
			this.weapon = this.weapons[this.weaponIdx];

		},

		jump: function (doJump) {
			if (doJump) {
				if(!this.jumping && this.jumpdebounce < 0) {
					this.jumping = true;
					this.jumpspeed = this.jumpMaxSpeed;

					return true;
				}
			} else {
				this.jumping = false;
				this.wasJumping = true;
				this.jumpdebounce = this.jumpPause;
			}
			return false;
		},

		tick: function (map) {

			var x1 = 0,
				y1 = 0;

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
			if (Ω.input.isDown("down")) {
				if (this.jumpspeed < 0) {
					this.jumpspeed = 0;
				}
			}

			if (Ω.input.pressed("fire")) {
				this.particle.play(this.x + (this.w / 2), this.y + 10, this.angle);
				this.weapon && this.weapon.fire(this.angle);
			}

			if (!(Ω.input.isDown("fire")) && Ω.input.wasDown("fire")) {
				this.weapon && this.weapon.released();
			}

			if (x1 < 0) {
				this.anims.setTo("walkLeft");
			} else if (x1 > 0) {
				this.anims.setTo("walk");
			} else {
				this.anims.setTo("idle");
			}

			if (Ω.input.isDown("jump")) {
				if(this.jump(true)) {
					this.playNote();
				}
			}

			if (this.jumping) {
				if(this.jumpspeed ++ > this.h) {
					this.jumpspeed = this.h;
				}
				y1 += this.jumpspeed;
			} else {
				this.jumpdebounce--;
			}

			this.move(x1, y1, map);

			var feetBlocks = map.getBlocks([
				[this.x, this.y + this.h + 1],
				[this.x + this.w - 1, this.y + this.h + 1]
			]);

			if (!this.falling) {
				if(feetBlocks[0] === 0 && feetBlocks[1] === 0){
					this.falling = true;
				}
			}
			if (this.jumping) {
				if(feetBlocks[0] || feetBlocks[1]) {
					this.jump(false);
				}
			} else if (this.wasJumping) {
				this.wasJumping = false;
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

			this.weapon && this.weapon.tick(this.screen);
			this.anims.tick();
			this.particle.tick(angle);

		},

		setWeapon: function (idx) {
			this.weaponIdx = idx;
			this.weapon = this.weapons[idx];
		},

		hitBlocks: function (blocks) {},

		hit: function (by) {},

		playNote: function () {

			var note = this.sounds["note" + (Math.random() * 4 + 1| 0)];
			note.play();

		},

		render: function (gfx, map) {

			var self = this;

			gfx.ctx.fillStyle = "hsla(200, 50%, 50%, 0.8)";

			this.sheet.render(gfx, this.headAt, 0, this.x + 2, this.y - 11);

			this.sheet.render(gfx, 0, 2, this.x + 1, this.y - 3);
			this.sheet.render(gfx, 0, 3, this.x +1, this.y + 11);
			this.anims.render(gfx, this.x + 1, this.y + 17);

			this.sheet.render(gfx, this.headAt, 1, this.x + 2, this.y + (this.headAt > 0 && this.headAt < 4 ? -5 : 5));

			this.weapon && this.weapon.render(gfx);

			this.particle.render(gfx);

		}

	});

	window.Player = Player;

}(Ω));
