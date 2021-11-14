import 'phaser';

export default class Key extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);

		scene.add.existing(this);

		this.setOrigin(0, 1).setScale(1.3);

		scene.tweens.add({
			targets: this,
			y: this.y - Phaser.Math.Between(3, 6),
			duration: Phaser.Math.Between(1500, 2500),
			repeat: -1,
			ease: 'linear',
			yoyo: true,
		});
	}
}
