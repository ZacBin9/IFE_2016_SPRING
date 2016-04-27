var gulp    = require('gulp'),
    less    = require('gulp-less'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber');
    cssmin  = require('gulp-minify-css');
    rename  = require('gulp-rename');
// less to css 
gulp.task('lessTocss', function(){
  gulp.src('src/less/task_7.less')
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(less())
      .pipe(gulp.dest('src/css'))
      .pipe(cssmin({ compatibility: 'ie9' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('src/css'));
})


// watch less
gulp.task('less-watch', function(){
  gulp.watch('src/less/*.less', ['lessTocss']);
})