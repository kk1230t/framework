/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2019 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.10.7-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */


const gulp                      = require('gulp'),
      del                       = require('del'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-sass'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      babel2                    = require('@rollup/plugin-babel'),
      alias                     = require('@rollup/plugin-alias'),
      resolve                   = require('@rollup/plugin-node-resolve'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      imagemin                  = require('gulp-imagemin'),
      browserSync               = require('browser-sync').create(),
      gulpConnect               = require('gulp-connect'),
      gulpConnectSsi            = require('gulp-connect-ssi'),
      spritesmith               = require('gulp.spritesmith'),
      // rollup                    = require('gulp-rollup'),
      rollup                    = require('rollup'),
      ejs                       = require("gulp-ejs"),
      rename                    = require("gulp-rename"),
      argv                      = require('yargs').argv,
      handlebars                = require('gulp-handlebars'),
      wrap                      = require('gulp-wrap'),
      declare                   = require('gulp-declare'),
      handlebarsCompile         = require('gulp-compile-handlebars'),
      nunjucks                  = require('gulp-nunjucks-html'),
      data                      = require('gulp-data'),
      beautify                  = require('gulp-beautify'),
      // sassPartialsImported = require('gulp-sass-partials-imported'),


      
      
      src_folder                    = './asset/',
      dist_folder                   = './dist/',
      src_image_folder              = src_folder + '/images',
      src_scss_folder               = src_folder + 'scss/',
      src_js_folder                 = src_folder + 'js/',
      dist_image_folder             = dist_folder + '/images',
      dist_scss_folder              = dist_folder + 'css/',
      dist_js_folder                = dist_folder + 'js/',
      src_js2_folder               = src_folder + 'js2/',
      dist_js2_folder               = dist_folder + 'js2/',
      src_framework_folder               = src_folder + 'js_fw/',
      dist_framework_folder               = dist_folder + 'js_fw/',
      node_modules_folder       = './node_modules/',
      targetBrowsers = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 10', 'IE 11'],

      node_dependencies         = Object.keys(require('./package.json').dependencies || {});
let scssFiles = [
  {
    name : "sass",
    src : src_scss_folder,
    dest : dist_scss_folder,
    sourceMap: dist_scss_folder
  }
]
argv.src = null
argv.njk_src = null
String.prototype.replaceAll = function(org, dest) {
  return this.split(org).join(dest);
}


gulp.task('clear', () => del([ dist_folder+"css/", dist_folder+"js/" ]));



gulp.task("sass", () => {
  return gulp.src([
    src_scss_folder + '**/!(_)*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({overrideBrowserslist : targetBrowsers}))
    // .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_scss_folder))
    .pipe(gulpConnect.reload());
});


gulp.task('images', () => {
  return gulp.src([ src_image_folder + '/**/*.+(png|jpg|jpeg|gif|svg|ico)' ], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_image_folder))
    .pipe(browserSync.stream());
});



gulp.task('js', () => {
  return gulp.src([ src_js_folder + '**/*.js' ]/*, { since: gulp.lastRun('js') }*/)
    .pipe(plumber())
    .pipe(webpack({
      mode: 'development',  //development, production, none
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      "presets": [
        [ "@babel/preset-env", {
          "targets": {
            "browsers": [ "last 1 version", "ie >= 11" ]
          }
        }]
      ]
    }))
    .pipe(concat('uiframework.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_js_folder))
    .pipe(gulpConnect.reload());
});

// gulp.task('js_rollup', () => {
//   return gulp.src([ src_js2_folder + '**/*.js' ]/*, { since: gulp.lastRun('js') }*/)
//     .pipe(rollup({
//       input: src_js2_folder+'index.js',
//       format:"umd", 
//       name:'bundle',
//       output: [
//         { sourcemap: true}
//       ]
//     }))
//     .pipe(babel({
//       "presets": [
//         [ "@babel/preset-env", {
//           "targets": {
//             "browsers": [ "last 1 version", "ie >= 11" ]
//           }
//         }]
//       ]
//     }))
//     .pipe(gulp.dest(dist_js2_folder))
// });

gulp.task('js_rollup', () => {
  return rollup
    .rollup({
      input: src_js2_folder+'index.js',
      format: 'umd',
      plugins: [resolve.nodeResolve(), babel2.babel({
          exclude: ['node_modules/**'],
          babelHelpers: 'bundled',
          presets: ['@babel/preset-env']
        }),
        alias({
          entries: [
            { find: 'Framework-util', replacement: `${src_js2_folder}/util/index.js` },
          ]
        })
      ]
    })
    .then(bundle => {
      setTimeout(() => {
        gulp.src(src_js2_folder+'index.js').pipe(gulpConnect.reload());
      }, 0);
      return bundle.write({
        file: dist_js2_folder+'index.js',
        format: 'umd',
        name: 'Framework',
        sourcemap: true,
      });
    });
});

gulp.task('js_ghilchaekim', () => {
  return rollup
    .rollup({
      input: src_framework_folder+'index.js',
      format: 'umd',
      plugins: [resolve.nodeResolve(), babel2.babel({
          exclude: ['node_modules/**'],
          babelHelpers: 'bundled',
          presets: ['@babel/preset-env']
        }),
        alias({
          entries: [
            { find: 'GC-util', replacement: `${src_framework_folder}/util/index.js` },
            { find: 'GC-data', replacement: `${src_framework_folder}/data.js` },
          ]
        })
      ]
    })
    .then(bundle => {
      setTimeout(() => {
        gulp.src(src_framework_folder+'index.js').pipe(gulpConnect.reload());
      }, 0);
      return bundle.write({
        file: dist_framework_folder+'GCui.js',
        format: 'umd',
        name: 'GCui',
        sourcemap: true,
      });
    });
});




gulp.task('ejs', () => {
  var src = (argv.src !== null) ? argv.src.replaceAll('\\', '/') : src_folder + 'ejs/**/*.ejs';
  return gulp.src([ src ])
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(dist_folder + 'ejs/'))
    .pipe(gulpConnect.reload());
});

gulp.task('hbs', function(){
  return gulp.src(src_folder + 'hbs/**/*.hbs')
    .pipe(handlebarsCompile())
    .pipe(rename({ extname: '.html' }))
    // .pipe(declare({
    //   namespace: 'MyApp.templates',
    //   noRedeclare: true
    // }))
    // .pipe(concat('templates.js'))
    .pipe(gulp.dest(dist_folder + 'hbs/'))
    .pipe(gulpConnect.reload());
});


gulp.task('njk_html', function(){
  var src;
  
  if(argv.njk_src !== null && argv.njk_src.indexOf('pages') !== -1){
    src = argv.njk_src;
    console.log('page')
  }else{
    src = src_folder + 'njk/**/*.+(html|njk)'
    console.log('all')
  }
  return gulp.src(src)
    .pipe(data(function() {
      return require(src_folder+'/data/data.json')
    }))
    .pipe(nunjucks({
      searchPaths: [src_folder + 'njk/']
    }))
    .on('error', function(err) {
      console.log(err)
    })
    .pipe(rename({ extname: '.html' }))
    .pipe(beautify.html({ indent_size: 4 }))
    .pipe(gulp.dest(dist_folder + 'njk/'))
    .pipe(gulpConnect.reload());
});


gulp.task('njk_guide_html', function(){
  var src;
  
  if(argv.njk_guide_src.indexOf('template') !== -1){
    src = './guide/asset/*.njk'
    console.log('all')
  }else{
    src = argv.njk_guide_src;
    console.log('pages')
  }
  return gulp.src(src)
    .pipe(data(function() {
      return require(src_folder+'/data/data.json')
    }))
    .pipe(nunjucks({
      searchPaths: ['./guide/asset/']
    }))
    .on('error', function(err) {
      console.log(err)
    })
    .pipe(rename({ extname: '.html' }))
    .pipe(beautify.html({ indent_size: 4 }))
    .pipe(gulp.dest('./guide/html/'))
    .pipe(gulpConnect.reload());
});






gulp.task('sprite', function () {
  const spriteData = gulp.src('/images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('/path/'));
});



gulp.task('build', gulp.series('clear', 'sass', 'sprite', 'js', 'js_rollup', 'ejs', 'njk_html', 'js_ghilchaekim'));

gulp.task('dev', 
  gulp.parallel(
    scssFiles.map(function(lib) { 
      return lib.name; 
    })
  )
);

gulp.task('connect', function () {
  gulpConnect.server({
      // root: _.app,
      port: 88,
      livereload: true,
      middleware: function(){
          return [gulpConnectSsi({
              baseDir: './',
              ext: '.html',
              // domain: 'http://example.com/',
              method: 'readOnLineIfNotExist'
          })];
      }
  });
});

function test(src){
  var src = src.replaceAll('\\', '/')
  return gulp.src([ src ])
    .pipe(ejs())  
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(dist_folder + 'ejs/'))
    .pipe(gulpConnect.reload());
}


gulp.task('watch', () => {
  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_scss_folder + '**/*.scss'
  ];
  
  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);


  gulp.watch(src_js_folder + '**/*.js').on('change', function(done){
    browserSync.reload();
    gulp.series('js')(done);
  });

  gulp.watch(src_js2_folder + '**/*.js').on('change', function(done){
    browserSync.reload();
    gulp.series('js_rollup')(done);
  });

  gulp.watch(src_framework_folder + '**/*.js').on('change', function(done){
    browserSync.reload();
    gulp.series('js_ghilchaekim')(done);
  });

  

  gulp.watch(src_folder + 'ejs/**/*.ejs')
  .on('change', function(done){
    // test(done)
    gulp.series('ejs')(done);
    argv.src = done
  })

  gulp.watch(src_folder + 'njk/**/*.+(html|njk)')
  .on('change', function(done){
    var src = done.replaceAll('\\', '/');
    argv.njk_src = src;
    gulp.series('njk_html')(done);
  })




  gulp.watch('./guide/asset/**/*.njk')
  .on('change', function(done){
    var src = done.replaceAll('\\', '/');
    argv.njk_guide_src = src;
    gulp.series('njk_guide_html')(done);
  })
  
  
  // arguments to a Gulp task


});

gulp.task('default', gulp.series('build', gulp.parallel('connect', 'watch')));
