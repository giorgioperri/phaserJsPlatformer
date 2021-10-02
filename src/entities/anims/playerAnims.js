export default (anims) => {
	anims.create({
		key: 'idle',
		frames: anims.generateFrameNumbers('nhuIdle', { start: 0, end: 4 }),
		frameRate: 8,
		repeat: -1,
	});

	anims.create({
		key: 'run',
		frames: anims.generateFrameNumbers('nhuWalk', { start: 0, end: 6 }),
		frameRate: 8,
		repeat: -1,
	});

	anims.create({
		key: 'jump',
		frames: anims.generateFrameNumbers('nhuJump', { start: 0, end: 3 }),
		frameRate: 8,
		repeat: 1,
	});

	anims.create({
		key: 'throw',
		frames: anims.generateFrameNumbers('nhuThrow', { start: 0, end: 2 }),
		frameRate: 8,
		repeat: 0,
	});

	anims.create({
		key: 'slide',
		frames: anims.generateFrameNumbers('playerSlide', { start: 0, end: 2 }),
		frameRate: 20,
		repeat: 0,
	});
};
