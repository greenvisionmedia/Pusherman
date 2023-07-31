var gulp = require('gulp'),
    terser = require('gulp-terser'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    cssnano = require('gulp-cssnano'),
    vinylPaths = require('vinyl-paths'),
    fs = require('fs'),
    del = require('del');

function markup() {
    return gulp
        .src('./src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

function styles() {
    return gulp
        .src('./src/*.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

function scripts() {
    return gulp
        .src('./src/*.js')
        .pipe(
            terser({
                format: {
                    quote_style: 1,
                },
            })
        )
        .pipe(
            replace('{{modal.html}}', () => {
                return `${fs.readFileSync('./public/modal.min.html', 'utf8')}`;
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

function static() {
    return gulp.src('./static/**').pipe(gulp.dest('./public'));
}

function clean() {
    return gulp.src('./public/*.html').pipe(vinylPaths(del));
}

function move() {
    return gulp.src('./public/**/*').pipe(gulp.dest('/mnt/c/users/taj/desktop/projects/(GV) Chrome Extension/public/'));
}

gulp.task('default', gulp.series(markup, styles, scripts, static, clean, move));
