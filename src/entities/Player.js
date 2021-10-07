import Phaser from 'phaser';
import initAnimations from './anims/playerAnims';
import HealthBar from '../hud/HealthBar';
import Projectiles from '../attacks/Projectiles';
import MeleeWeapon from '../attacks/MeleeWeapon';
import anims from '../mixins/anims';
import collidable from '../mixins/collidable';
import { getTimestamp } from '../utils/functions';
import EventEmitter from '../events/Emitter';

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
		this.name = 'Player';

		this.isSliding = false;

		this.hasBeenHit = false;
		this.bounceVelocity = 200;

		this.cursors = this.scene.input.keyboard.createCursorKeys();

		//sounds
		this.jumpSound = this.scene.sound.add('jump', { volume: 0.2 });
		this.projectileSound = this.scene.sound.add('projectile-launch', { volume: 0.2 });
		this.stepSound = this.scene.sound.add('step', { volume: 0.2 });
		this.swipeSound = this.scene.sound.add('swipe', { volume: 0.2 });

		this.projectiles = new Projectiles(this.scene, 'iceball');
		this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, 'swordDefault');
		this.timeFromLastAttack = null;

		this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

		this.health = 100;

		this.hp = new HealthBar(
			this.scene,
			this.scene.config.leftTopCorner.x + 5,
			this.scene.config.leftTopCorner.y + 5,
			1.5,
			this.health
		);

		this.body.setGravityY(this.gravity);
		this.setScale(1.4);
		this.setOrigin(0, 1);
		this.setSize(this.width - 15, this.height - 10);
		this.setOffset(5, 8);
		this.setCollideWorldBounds(true);

		initAnimations(this.scene.anims);

		this.handleAttacks();

		this.scene.time.addEvent({
			delay: 450,
			repeat: -1,
			callbackScope: this,
			callback: () => {
				if (this.isPlayingAnimation('run')) {
					this.stepSound.play();
				}
			},
		});
	}

	initEvents() {
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
	}

	update() {
		if (this.hasBeenHit || this.isSliding || !this.body) return;

		if (this.getBounds().top > this.scene.config.height) {
			EventEmitter.emit('PLAYER_LOST');
			return;
		}

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
			this.jumpSound.play();
			this.setVelocityY(-this.playerSpeed * 2);
			this.jumpCount++;
		}

		if (onFloor) {
			this.jumpCount = 0;
		}

		if (this.isPlayingAnimation('throw') || this.isPlayingAnimation('slide')) {
			return;
		}

		this.play(onFloor ? (this.body.velocity.x !== 0 ? 'run' : 'idle') : 'jump', true);
	}

	handleAttacks() {
		this.scene.input.keyboard.on('keydown-Q', () => {
			this.projectiles.fireProjectile(this, 'greenProjectile');
			this.play('throw', true);
			this.projectileSound.play();
		});

		this.scene.input.keyboard.on('keydown-E', () => {
			if (
				this.timeFromLastAttack &&
				this.timeFromLastAttack + this.meleeWeapon.attackSpeed > getTimestamp()
			) {
				return;
			}

			this.swipeSound.play();
			this.play('throw', true);
			this.meleeWeapon.swing(this);
			this.timeFromLastAttack = getTimestamp();
		});
	}

	playDamageTween() {
		return this.scene.tweens.add({
			targets: this,
			duration: 100,
			repeat: -1,
			tint: 0xffffff,
		});
	}

	bounceOff(damageSource) {
		if (damageSource.body) {
			this.body.touching.right
				? this.setVelocityX(-this.bounceVelocity)
				: this.setVelocityX(this.bounceVelocity);
		} else {
			this.body.blocked.right
				? this.setVelocityX(-this.bounceVelocity)
				: this.setVelocityX(this.bounceVelocity);
		}

		setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
	}

	takesHit(source) {
		if (this.hasBeenHit) return;

		this.health -= source.damage || source.properties.damage || 0;

		if (this.health <= 0) {
			EventEmitter.emit('PLAYER_LOST');
			this.hasBeenHit = false;
			return;
		}

		this.hp.decrease(this.health);

		source.deliversHit && source.deliversHit(this);

		this.hasBeenHit = true;
		this.bounceOff(source);
		const hitAnim = this.playDamageTween();

		this.scene.time.delayedCall(800, () => {
			this.hasBeenHit = false;
			hitAnim.stop();
			this.clearTint();
		});
	}
}

export default Player;
