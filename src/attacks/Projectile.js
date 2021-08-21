import 'phaser';
import EffectManager from '../effects/EffectManager';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);

		scene.physics.add.existing(this);
		scene.add.existing(this);

		this.speed = 300;
		this.maxDistance = 300;
		this.traveledDistance = 0;
		this.cooldown = 500; //in milliseconds
		this.damage = 10;
		this.bodySize = 13;

		this.setSize(this.bodySize, this.bodySize);

		this.effectManager = new EffectManager(this.scene);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		this.traveledDistance += this.body.deltaAbsX();

		if (this.isOutOfRange()) {
			this.body.reset(0, 0);
			this.isActive(false);
			this.traveledDistance = 0;
		}
	}

	fire(x, y, anim) {
		this.isActive(true);
		this.body.reset(x, y);
		this.setVelocityX(this.speed);

		anim && this.play(anim, true);
	}

	deliversHit(target) {
		this.isActive(false);
		this.traveledDistance = 0;

		const impactPosition = { x: this.x, y: this.y };

		this.body.reset(0, 0);
		this.effectManager.playEffectOn('hitEffect', target, impactPosition);
	}

	isActive(isActive) {
		this.setVisible(isActive);
		this.setActive(isActive);
	}

	isOutOfRange() {
		return this.traveledDistance && this.traveledDistance >= this.maxDistance;
	}
}
