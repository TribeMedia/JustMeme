var applicationModule = require("application");
var Meme = require("./Meme");

var _page;
var meme;

exports.loaded = function(args) {
	_page = args.object;
	meme = new Meme();
	_page.bindingContext = meme;

	if (applicationModule.ios) {
		_page.ios.title = "Create New";
	}
};

exports.unloaded = function() {
	meme.destroy();
	meme = null;
}

exports.navigatedTo = function() {
	//grab the image from the navigation context.
	var selectedImage = _page.navigationContext;
	meme.setImage(selectedImage);
};
