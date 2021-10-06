import Enemy from './Enemy';
import initAnims from './anims/birdmanAnims';

class Birdman extends Enemy {
	constructor(scene, x, y) {
		super(scene, x, y, 'birdman');
		initAnims(scene.anims);
	}

	init() {
		super.init();
		this.setScale(1.4);
	}

	update(time, delta) {
		super.update(time, delta);

		if (!this.active) {
			return;
		}

		if (this.isPlayingAnimation('birdman-damaged')) {
			return;
		}
		this.play('birdman-walk', true);
	}

	takesHit(source) {
		super.takesHit(source);
	}
}

export default Birdman;
