import Enemy from './Enemy';
import initAnims from './anims/gunnerAnims';
import Projectiles from '../attacks/Projectiles';
import MeleeWeapon from '../attacks/MeleeWeapon';

class Gunner extends Enemy {
	constructor(scene, x, y) {
		super(scene, x, y, 'gunner');
		initAnims(scene.anims);
	}

	init() {
		super.init();
		this.speed = 50;
		this.health = 50;
		this.name = 'Gunner';
		this.projectiles = new Projectiles(this.scene, 'fireball-1');
		this.timeFromLastAttack = 0;
		this.attackDelay = this.getAttackDelay();
		this.lastDirection = null;

		this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, 'blaster');

		this.setScale(1.4);
	}

	update(time, delta) {
		super.update(time, delta);

		if (!this.active) {
			return;
		}

		if (this.body.velocity.x > 0) {
			this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
		} else if (this.body.velocity.x < 0) {
			this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
		}

		if (this.timeFromLastAttack + this.attackDelay <= time) {
			this.timeFromLastAttack = time;
			this.attackDelay = this.getAttackDelay();
			this.meleeWeapon.swing(this);
		}

		if (!this.active) {
			return;
		}

		if (this.isPlayingAnimation('gunner-shoot')) {
			this.setOffset(50, 0);
			return;
		} else {
			this.setOffset(0, 0);
		}

		this.play('gunner-walk', true);
	}

	getAttackDelay() {
		return Phaser.Math.Between(1000, 4000);
	}

	takesHit(source) {
		super.takesHit(source);
	}
}

export default Gunner;
