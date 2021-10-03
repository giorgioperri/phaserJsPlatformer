import 'phaser';
import Projectile from './Projectile';
import { getTimestamp } from '../utils/functions';
import { setScale } from 'phaser/src/gameobjects/components/Transform';

export default class Projectiles extends Phaser.Physics.Arcade.Group {
	constructor(scene, key) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: 5,
			active: false,
			visible: false,
			key,
			classType: Projectile,
		});

		this.timeFromLastProjectile = null;
	}

	fireProjectile(initiator, anim) {
		const projectile = this.getFirstDead(false);

		if (!projectile) {
			return;
		}

		if (
			this.timeFromLastProjectile &&
			this.timeFromLastProjectile + projectile.cooldown > getTimestamp()
		) {
			return;
		}
		const center = initiator.getCenter();
		let centerXOffset;

		if (initiator.name === 'Player') {
			projectile.setOffset(0);
			projectile.setScale(1.7);
		}

		if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
			projectile.speed = Math.abs(projectile.speed);
			projectile.setFlipX(false);
			centerXOffset = 20;
		} else {
			projectile.speed = -Math.abs(projectile.speed);
			projectile.setFlipX(true);
			centerXOffset = -20;
		}

		projectile.fire(center.x + centerXOffset, center.y, anim);
		this.timeFromLastProjectile = getTimestamp();
	}
}
