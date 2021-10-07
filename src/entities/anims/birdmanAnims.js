export default (anims) => {
	anims.create({
		key: 'birdman-walk',
		frames: anims.generateFrameNumbers('birdman', { start: 0, end: 3 }),
		frameRate: 4,
		repeat: -1,
	});
};
