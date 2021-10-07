export default (anims) => {
	anims.create({
		key: 'gunner-walk',
		frames: anims.generateFrameNumbers('gunner', { start: 0, end: 3 }),
		frameRate: 8,
		repeat: -1,
	});
};
