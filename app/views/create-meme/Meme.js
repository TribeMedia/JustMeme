var dialogsModule = require("ui/dialogs");
var observable = require("data/observable");

var imageManipulation = require("../../shared/image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var utilities = require("../../shared/utilities");
var analyticsMonitor = require("../../shared/analytics");

var socialShare = require("../../node_modules/nativescript-social-share/social-share");
var _ = require("../../node_modules/lodash/index");

function Meme() {
	var that = this;
	var debouncedRefresh = _.debounce(function() {
		that.refresh();
	}, 50, { leading: true });

	// Add an event listener to refresh the memeImage every time there is a change to the properties
	this.addEventListener(observable.Observable.propertyChangeEvent, function(changes) {
		// skip if memeImage changes
		if (changes.propertyName === "memeImage" || !that.image) {
			return;
		}

		// Call refresh meme, but make sure it doesn't get called more often than every 200ms
		debouncedRefresh();
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

module.exports = Meme;
