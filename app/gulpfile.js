var gulp = require("gulp");
var jshint = require("gulp-jshint");

gulp.task("jshint", function() {
	return gulp.src(["components/**/*.js", "shared/**/*.js"])
		.pipe(jshint())
		.pipe(jshint.reporter());
});

gulp.task( "default", ["jshint"]);