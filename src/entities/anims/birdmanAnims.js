export default (anims) => {
	anims.create({
		key: 'birdman-walk',
		frames: anims.generateFrameNumbers('birdman', { start: 0, end: 12 }),
		frameRate: 4,
		repeat: -1,
	});

	anims.create({
		key: 'birdman-damaged',
		frames: anims.generateFrameNumbers('birdman', { start: 25, end: 26 }),
		frameRate: 10,
		repeat: 0,
	});
};
