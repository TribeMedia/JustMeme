var dialogsModule = require("ui/dialogs");
var observable = require("data/observable");

var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var socialShare = require("../../node_modules/nativescript-social-share/social-share");
var utilities = require("../../shared/utilities");
var analyticsMonitor = require("../../shared/analytics");

function Meme() {
	var that = this;

	// Add an event listener to refresh the memeImage every time there is a change to the properties
	this.addEventListener(observable.Observable.propertyChangeEvent, function(changes) {
		// skip if memeImage changes
		if (changes.propertyName === "memeImage" || !that.image) {
			return;
		}

		// Call refresh meme, but make sure it doesn't get called more often than every 200ms
		callOncePerGivenTime(function() {
			that.refresh();
		}, 200);
	});
}
Meme.prototype = new observable.Observable();

Meme.prototype.destroy = function() {
	this.removeEventListener(observable.Observable.propertyChangeEvent);
}
Meme.prototype.reset = function() {
	this.set("topText", "");
	this.set("bottomText", "");
	this.set("fontSize", 50);
	this.set("isBlackText", false);
}

Meme.prototype.setImage = function(image) {
	this.set("memeImage", image);
	this.reset();
	this.image = image;
	this.uniqueImageName = utilities.generateUUID() + ".png";
}

Meme.prototype.refresh = function () {
	var image = imageManipulation.addText({
		image: this.image,
		topText: this.topText,
		bottomText: this.bottomText,
		fontSize: this.fontSize,
		isBlackText: this.isBlackText
	});

	this.set("memeImage", image);
};

Meme.prototype.save = function () {
	analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
	this.refresh();
	var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);

	if (!saved) {
		console.log("New meme not saved....");
	} else {
		var options = {
			title: "Meme Saved",
			message: "Congratulations, Meme Saved!",
			okButtonText: "OK"
		};

		dialogsModule.alert(options);
	}
};

Meme.prototype.share = function() {
	analyticsMonitor.trackFeature("CreateMeme.Share");
	socialShare.shareImage(this.memeImage);
};

var shouldDelayNextCall = false;
var additonalUpdateRequested = false;
function callOncePerGivenTime(delegate, delay) {
	//skip if an update has already been requested
	if (shouldDelayNextCall) {
		additonalUpdateRequested = true;
		return;
	}

	shouldDelayNextCall = true;

	// call the function here
	delegate();

	//delay the next call by a bit it, to make the app a bit more cost effective
	setTimeout(function() {
		shouldDelayNextCall = false;

		//call the function again in case there was a request during the blocking period
		if (additonalUpdateRequested) {
			additonalUpdateRequested = false;
			delegate();
		}
	}, delay);
}

module.exports = Meme;
