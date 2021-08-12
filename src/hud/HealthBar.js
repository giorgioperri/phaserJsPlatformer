import 'phaser';
import { ToJSON } from 'phaser/src/gameobjects/components';

class Healthbar {
	constructor(scene, x, y, health) {
		this.bar = new Phaser.GameObjects.Graphics(scene);

		this.bar.setScrollFactor(0, 0);

		this.x = x;
		this.y = y;
		this.health = health;

		this.size = {
			width: 40,
			height: 8,
		};

		this.pixelPerHealth = this.size.width / this.health;

		scene.add.existing(this.bar);
		this.draw(x, y);
	}

	draw(x, y) {
		this.bar.clear();
		const { width, height } = this.size;
		this.bar.fillStyle(0x9b00ff);
		this.bar.fillRect(x, y, width, height);
	}
}

export default Healthbar;
