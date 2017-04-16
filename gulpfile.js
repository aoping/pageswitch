var gulp = require('gulp');
var rev = require('gulp-rev'); // 添加版本号
var revReplace = require('gulp-rev-replace'); // 更新index里的引用
var useref = require('gulp-useref'); // 合并css js,在html里设置
var filter = require('gulp-filter'); // 筛选和恢复
var uglify = require('gulp-uglify'); // 压缩js
var csso = require('gulp-csso'); // 压缩css
var imagemin = require('gulp-imagemin'); // 压缩图片
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('img',function(){ //复制压缩图片
	return gulp.src('img/**')
			.pipe(imagemin())
			.pipe(gulp.dest('dist/img/'));
})

//发布
gulp.task('build',['img'],function(){
	var jsFilter=filter('**/*.js',{restore:true});
	var cssFilter=filter('**/*.css',{restore:true});
	var indexHtmlFilter=filter(['**/*','!**/index.html'],{restore:true});
	return gulp.src('index.html')
		.pipe(useref())
		.pipe(jsFilter)
		.pipe(uglify())
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(csso())
		.pipe(cssFilter.restore)
		.pipe(indexHtmlFilter)
		.pipe(rev())
		.pipe(indexHtmlFilter.restore)
		.pipe(revReplace())
		.pipe(gulp.dest('dist'));
});


//生产
gulp.task('dev',function(){
	browserSync.init({
      notify: false,
      port: 2001,
      server: {
        baseDir: ['./']
      }
    });
    gulp.watch([
      '*.html',
      'img/**/*',
      'css/**/*.css',
      'js/**/*.js',
    ]).on('change', reload);
});