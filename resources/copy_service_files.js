const fs = require('fs');
const path = require('path');
const util = require('util');

const copyFile = util.promisify(fs.copyFile);


const ANDROID_SERVICE_FILE = "google-services.json"
const IOS_SERVICE_FILE = "GoogleService-Info.plist"

const ANDROID_DIR = "platforms/android/app"
const IOS_DIR = "platforms/ios"

const verboseCopy = (src, dest) => {
	console.log(`Copying ${src} to ${dest}...`);
	return copyFile(src, dest).then(() => {
		console.log(`Successfully copied to ${dest}`);
	})
}

const copyAndroidServiceFile = projectRoot => verboseCopy(
	path.join(projectRoot, ANDROID_SERVICE_FILE),
	path.join(projectRoot, ANDROID_DIR, ANDROID_SERVICE_FILE),
	fs.constants.COPYFILE_FICLONE
)

const copyIosServiceFile = projectRoot => verboseCopy(
	path.join(projectRoot, IOS_SERVICE_FILE),
	path.join(projectRoot, IOS_DIR, IOS_SERVICE_FILE),
	fs.constants.COPYFILE_FICLONE
)

module.exports = context => {
	const projectRoot = context.opts.projectRoot;
	const platforms = context.opts.cordova.platforms;
	const tasks = []

	platforms.forEach(platform => {
		if(platform === "android")
			tasks.push(copyAndroidServiceFile(projectRoot));
		else if(platform === "ios")
			tasks.push(copyIosServiceFile(projectRoot));
	});

	return Promise.all(tasks).then(() => null)
}
