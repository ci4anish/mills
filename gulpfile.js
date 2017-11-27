const gulp = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');

gulp.task('clean.client', function () {
    return gulp.src('dist.client', {read: false})
        .pipe(clean({force: true}));
});

// gulp.task('clean.server', function () {
//     return gulp.src('dist.server', {read: false})
//         .pipe(clean({force: true}));
// });

gulp.task('sass', function(){
    return gulp.src('client/styles/styles.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('dist.client/styles'))
});

gulp.task('index', function(){
    return gulp.src('client/index.html')
        .pipe(gulp.dest('dist.client'))
});

gulp.task('script.client', function compileScripts() {
    return gulp.src('client/scripts/app.js')
        .pipe(webpackStream(require('./webpack.config.js'), webpack2))
        .pipe(gulp.dest('dist.client/scripts'));
});

// gulp.task('script.server', function compileScripts() {
//     return gulp.src('server/index.js')
//         .pipe(webpackStream(require('./webpack.config.js'), webpack2))
//         .pipe(gulp.dest('dist.server'));
// });

gulp.task('watch', function(){
    gulp.watch('client/styles/styles.scss', ['sass']);
    gulp.watch('client/scripts/**/*.js', ['script.client']);
    // gulp.watch('server/**/*.js', ['script.server']);
    gulp.watch('client/index.html', ['index']);
});

gulp.task('build', function(callback) {
    runSequence('clean.client', 'index', 'sass', 'script.client', callback);
    //'clean.server', 'script.server',
});

gulp.task('default', function(callback) {
    runSequence('build', 'watch', callback);
});
