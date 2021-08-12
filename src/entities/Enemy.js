import Phaser from 'phaser';

import collidable from '../mixins/collidable';

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);

		this.config = scene.config;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Mixins
		Object.assign(this, collidable);

		this.init();
		this.initEvents();
	}

	init() {
		this.gravity = 500;
		this.speed = 50;
		this.timeFromLastTurn = 0;
		this.maxPatrolDistance = 1000;
		this.currentPatrolDistance = 0;
		this.platformCollidersLayer = null;
		this.rayGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xaa00aa } });

		this.damage = 20;

		this.body.setGravityY(this.gravity);
		this.setSize(20, 45);
		this.setOffset(7, 20);
		this.setCollideWorldBounds(true);
		this.setImmovable(true);
		this.setOrigin(0.5, 1);
		this.setVelocityX(30);
	}

	initEvents() {
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
	}

	update(time) {
		this.patrol(time);
	}

	patrol(time) {
		if (!this.body || !this.body.onFloor()) {
			return;
		}

		this.currentPatrolDistance += Math.abs(this.body.deltaX());

		const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer, {
			raylength: 40,
			precision: 1,
			steepness: 0.2,
		});

		if (
			(!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
			this.timeFromLastTurn + 100 < time
		) {
			this.setFlipX(!this.flipX);
			this.setVelocityX((this.speed = -this.speed));
			this.currentPatrolDistance = 0;
			this.timeFromLastTurn = time;
		}

		if (this.config.debug && ray) {
			this.rayGraphics.clear();
			this.rayGraphics.strokeLineShape(ray);
		}
	}

	setPlatformColliders(platformCollidersLayer) {
		this.platformCollidersLayer = platformCollidersLayer;
	}
}

export default Enemy;
