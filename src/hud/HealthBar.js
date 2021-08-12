import 'phaser';
import { ToJSON } from 'phaser/src/gameobjects/components';

class Healthbar {
	constructor(scene, x, y, scaleFactor = 1, health) {
		this.bar = new Phaser.GameObjects.Graphics(scene);

		this.x = x / scaleFactor;
		this.y = y / scaleFactor;
		this.health = health;
		this.scaleFactor = scaleFactor;

		this.size = {
			width: 40,
			height: 8,
		};

		this.pixelPerHealth = this.size.width / this.health;

		scene.add.existing(this.bar);
		this.draw(this.x, this.y, this.scaleFactor);
	}

	decrease(amount) {
		this.health = amount <= 0 ? 0 : amount;
		this.draw(this.x, this.y, this.scaleFactor);
	}

	draw(x, y, scaleFactor) {
		this.bar.clear();
		const { width, height } = this.size;

		const margin = 2;

		this.bar.fillStyle(0x000000);
		this.bar.fillRect(x, y, width + margin, height + margin);

		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);

		const healthWidth = Math.floor(this.health * this.pixelPerHealth);

		this.bar.fillStyle(healthWidth <= this.size.width / 3 ? 0xff0000 : 0x00ff00);

		if (healthWidth > 0) {
			this.bar.fillRect(x + margin, y + margin, healthWidth - margin, height - margin);
		}

		return this.bar.setScrollFactor(0, 0).setScale(scaleFactor);
	}
}

export default Healthbar;
