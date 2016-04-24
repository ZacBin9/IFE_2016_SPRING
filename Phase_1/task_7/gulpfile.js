var gulp = require('gulp'),
    less = require('gulp-less'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

// less to css 
gulp.task('lessTocss', function(){
	gulp.src('src/less/task_7.less')
	    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
	    .pipe(less())
	    .pipe(gulp.dest('src/css'));
})


// watch less
gulp.task('less-watch', function(){
	gulp.watch('src/less/*.less', ['lessTocss']);
})