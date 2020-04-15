var gulp = require('gulp'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject'),
    fs = require('fs'),
    prompts = require('prompts'),
    del = require('del'),
    newer = require('gulp-newer'),
    runSequence = require('gulp4-run-sequence'),
    browserSync = require('browser-sync').create();

const proj = process.env.PROJECT;
const EXPORT_PATH = '.dist';

gulp.task('create', () => {
    return gulp
        .src('*.*', { read: false })
        .pipe(gulp.src('./.engine/dist/**'))
        .pipe(gulp.dest(`${proj}`));
});

gulp.task('create-subproject', async () => {
    return await fs.exists(proj, (exists) => {
        if (exists) {
            (async () => {
                const response = await prompts({
                    type: 'confirm',
                    name: 'value',
                    message: 'The directory already exists. Do you want to overwrite it?',
                    initial: true,
                });
                if (response.value) {
                    return runSequence('clean-dest', 'create');
                }
            })();
        } else {
            return runSequence('create');
        }
    });
});

gulp.task('clean-dest', () => {
    return del([`./${EXPORT_PATH}/${proj}`]);
});

gulp.task('images', () => {
    return gulp
        .src(`./${proj}/assets/**/*`)
        .pipe(newer(`./${EXPORT_PATH}/${proj}/assets`))
        .pipe(gulp.dest(`./${EXPORT_PATH}/${proj}/assets`));
});

gulp.task('css', () => {
    return gulp
        .src(`./${proj}/scss/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${proj}/css`))
        .pipe(
            browserSync.stream({
                stream: true,
            }),
        );
});

gulp.task('inject-content', () => {
    const injectCss = inject(gulp.src([`./${proj}/css/*.css`]), {
        starttag: '<!-- inject:style:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: (filePath, file) => {
            // return file contents as string
            return file.contents ? `<style>${file.contents.toString('utf8')}</style>` : '';
        },
    });
    const injectContent = inject(gulp.src([`./${proj}/partials/*.html`]), {
        starttag: '<!-- inject:partials:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: (filePath, file) => {
            // return file contents as string
            return file.contents ? file.contents.toString('utf8') : '';
        },
    });
    return gulp
        .src('./.engine/index.html')
        .pipe(injectCss)
        .pipe(injectContent)
        .pipe(gulp.dest(`./${EXPORT_PATH}/${proj}`))
        .pipe(
            browserSync.stream({
                stream: true,
            }),
        );
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: `./${EXPORT_PATH}/${proj}`,
            index: `/index.html`,
        },
        notify: true,
    });
    gulp.watch([`${proj}/**/*.html`, `${proj}/scss/**/*.scss`, `${proj}/assets/**/*`], async (evt, file) => {
        console.log(evt);
        console.log(file);
        await runSequence('css', 'images', 'inject-content');
        browserSync.reload();
    });
});

gulp.task('default', (callback) => {
    runSequence('css', 'images', 'inject-content', 'browser-sync', callback);
});
