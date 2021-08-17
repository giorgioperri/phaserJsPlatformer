import Enemy from './Enemy';
import initAnims from './anims/snakeyAnims';

class Snakey extends Enemy {
	constructor(scene, x, y) {
		super(scene, x, y, 'snakey');
		initAnims(scene.anims);
	}

	init() {
		super.init();
		this.speed = 50;
		this.health = 50;

		this.setSize(12, 45);
		this.setOffset(10, 15);
	}

	update(time, delta) {
		super.update(time, delta);

		if (!this.active) {
			return;
		}

		if (this.isPlayingAnimation('snakey-damaged')) {
			return;
		}
		this.play('snakey-walk', true);
	}

	takesHit(source) {
		super.takesHit(source);
		this.play('snakey-damaged', true);
	}
}

export default Snakey;
