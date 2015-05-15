var gulp = require("gulp");
var babel = require("gulp-babel");
var jshint = require("gulp-jshint");

gulp.task("jshint", function() {
	return gulp.src(["components/**/*.js", "shared/**/*.js"])
		.pipe(jshint())
		.pipe(jshint.reporter());
});

gulp.task("build", function() {
	gulp.src([
		// "./App_Resources/**/*",
		// "./images/**/*",
		// "./libs/**/*",
		// "./node_modules/lodash/index.js",
		// "./node_modules/marked/marked.min.js",
		// "./node_modules/nativescript-social-share/*.js",
		// "./shared/**/*",
		// "./tns_modules/**/*",
		// "./views/**/*",
		// "./app.css",
		// "./app.js"
		"**/*"
	], { base: "./" }).pipe(gulp.dest("../app/"));
});

gulp.task( "default", ["build"]);