const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass'), //Подключаем Sass пакет,
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
  terser = require('gulp-terser'),
  imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
  imageminPngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
  cache = require('gulp-cache'), // Подключаем библиотеку кеширования
  del = require('del'), // Подключаем библиотеку для удаления файлов и папок
  browserSync = require('browser-sync'), // Подключаем Browser Sync
  notify = require("gulp-notify"),
  babel = require('gulp-babel');
const reload = browserSync.reload;


function html() {
  return src('src/*.html')
    .pipe(dest('dist/'))
}

function css() {
  return src('src/scss/main.scss')
    .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
    // .pipe(cleanCSS())
    .pipe(autoprefixer(['last 15 versions'])) // Создаем префиксы
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

function js() {
  return src('src/js/*.js', {sourcemaps: true})
    // .pipe(concat('maim.min.js'))
    .pipe(terser())
    .pipe(babel())
    .pipe(dest('dist/js', {sourcemaps: true}))
}

async function img() {
  return src('src/img/**/*')
    .pipe(cache(imagemin({  // С кешированием
      // .pipe(imagemin({ // Сжимаем изображения без кеширования
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [imageminPngquant()]
    })))
    .pipe(dest('dist/img')); // Выгружаем на продакшен
  console.log('Images optimized');
}

async  function copyCss(){
return src('src/css/**/*')
  .pipe(dest('dist/css'))
}


async function clean() {
  return del.sync('dist');
}

function browser() {
  browserSync.init({ // Выполняем browserSync
    server: { // Определяем параметры сервера
      baseDir: './dist' // Директория для сервера
    }, notify: false // Отключаем уведомления
  });
}

const build = series(clean, parallel(html, css, js, img, reload));

async function watchFiles() {
  watch('src/scss/**/*.scss', css); // Наблюдение за sass файлами в папке sass
  watch('src/*.html').on('all', series(html, reload));
  watch('src/js/**/*.js').on('all', series(js, reload));
  watch('src/img/**/*').on('all', series(img, reload));
  watch('src/css/**/*').on('all', series(css, reload));
}


exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;
exports.clean = clean;
exports.build = series(clean, parallel(html, css, js, img),copyCss);
exports.default = series(
  series(clean, parallel(html, css, js, img),copyCss),
  parallel(browser, watchFiles)
);