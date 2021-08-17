import 'phaser';

export default class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, weaponName) {
		super(scene, x, y, weaponName);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.damage = 20;
		this.attackSpeed = 1000;
		this.weaponName = weaponName;
		this.weaponAnim = weaponName + 'Swing';
		this.wielder = null;

		this.setOrigin(0.5, 1);
		this.setDepth(10);

		this.activateWeapon(false);

		this.on('animationcomplete', (animation) => {
			if (animation.key === this.weaponAnim) {
				this.activateWeapon(false);
				this.body.reset(0, 0);
			}
		});
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		if (!this.active) {
			return;
		}

		this.setFlipX(this.wielder.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT ? false : true);
		this.body.reset(
			this.wielder.x +
				(this.wielder.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT ? 25 : -25),
			this.wielder.y
		);
	}

	swing(wielder) {
		this.wielder = wielder;
		this.activateWeapon(true);
		this.anims.play(this.weaponAnim, true);
	}

	activateWeapon(isActive) {
		this.setActive(isActive);
		this.setVisible(isActive);
	}
}
