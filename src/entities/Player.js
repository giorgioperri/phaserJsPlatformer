import Phaser from 'phaser';
import initAnimations from './anims/playerAnims';
import HealthBar from '../hud/HealthBar';
import Projectiles from '../attacks/Projectiles';
import MeleeWeapon from '../attacks/MeleeWeapon';
import anims from '../mixins/anims';
import collidable from '../mixins/collidable';

class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Mixins
		Object.assign(this, collidable);
		Object.assign(this, anims);

		this.init();
		this.initEvents();
	}

	init() {
		this.gravity = 500;
		this.playerSpeed = 150;
		this.jumpCount = 0;
		this.consecutiveJumps = 1;

		this.hasBeenHit = false;
		this.bounceVelocity = 200;

		this.cursors = this.scene.input.keyboard.createCursorKeys();

		this.projectiles = new Projectiles(this.scene);
		this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, 'swordDefault');

		this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

		this.health = 100;

		this.hp = new HealthBar(
			this.scene,
			this.scene.config.leftTopCorner.x + 5,
			this.scene.config.leftTopCorner.y + 5,
			1.5,
			this.health
		);

		this.body.setSize(20, 36);
		this.body.setGravityY(this.gravity);
		this.setCollideWorldBounds(true);
		this.setOrigin(0.5, 1);

		initAnimations(this.scene.anims);

		this.scene.input.keyboard.on('keydown-Q', () => {
			this.projectiles.fireProjectile(this);
			this.play('throw', true);
		});

		this.scene.input.keyboard.on('keydown-E', () => {
			this.meleeWeapon.swing(this);
			this.play('throw', true);
		});
	}

	initEvents() {
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
	}

	update() {
		if (this.hasBeenHit) return;
		const { left, right, space } = this.cursors;

		const aKey = this.scene.input.keyboard.addKey('A');
		const dKey = this.scene.input.keyboard.addKey('D');
		const wKey = this.scene.input.keyboard.addKey('W');

		const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
		const isWJustDown = Phaser.Input.Keyboard.JustDown(wKey);
		const onFloor = this.body.onFloor();

		if (left.isDown || aKey.isDown) {
			this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
			this.setVelocityX(-this.playerSpeed);
			this.setFlipX(true);
		} else if (right.isDown || dKey.isDown) {
			this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
			this.setVelocityX(this.playerSpeed);
			this.setFlipX(false);
		} else {
			this.setVelocityX(0);
		}

		if ((isSpaceJustDown || isWJustDown) && (onFloor || this.jumpCount < this.consecutiveJumps)) {
			this.setVelocityY(-this.playerSpeed * 2);
			this.jumpCount++;
		}

		if (onFloor) {
			this.jumpCount = 0;
		}

		if (this.isPlayingAnimation('throw')) {
			return;
		}

		this.play(onFloor ? (this.body.velocity.x !== 0 ? 'run' : 'idle') : 'jump', true);
	}

	playDamageTween() {
		return this.scene.tweens.add({
			targets: this,
			duration: 100,
			repeat: -1,
			tint: 0xffffff,
		});
	}

	bounceOff() {
		this.body.touching.right
			? this.setVelocityX(-this.bounceVelocity)
			: this.setVelocityX(this.bounceVelocity);

		setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
	}

	takesHit(initiator) {
		if (this.hasBeenHit) return;

		this.health -= initiator.damage;
		this.hp.decrease(this.health);

		this.hasBeenHit = true;
		this.bounceOff();
		const hitAnim = this.playDamageTween();

		this.scene.time.delayedCall(800, () => {
			this.hasBeenHit = false;
			hitAnim.stop();
			this.clearTint();
		});
	}
}

export default Player;
