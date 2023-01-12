import FS from "fs/promises";
import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import BrowserSync from "browser-sync";
import gulp from "gulp";
import replace from "gulp-replace";

const browserSync = BrowserSync.create();

const files = {
  htmlPath: "src/**/*.html",
  jsPath: [
    "src/**/*.js",
    "src/**/*.svelte"
  ]
 };

async function clean() {
  await FS.rm( "build", { 
    recursive: true, 
    force: true 
  });
};

async function javascript() {
  await esbuild.build({
    entryPoints: [ "src/main.js" ],
    mainFields: [ "svelte", "browser", "module", "main" ],
    outdir: "build",
    bundle: true,
    platform: "browser",
    format: "esm",
    plugins: [ sveltePlugin() ],
    logLevel: "info"
  }).catch( error => {
    console.error( error );
    process.exit( 1 );
  });
};

async function html () {
  const nonce = new Date().getTime();
  return gulp.src( files.htmlPath )
    .pipe( replace( /cb=\d+/g, `cb=${ nonce }` ))
    .pipe( gulp.dest( "build/" ));
};

// await FS.copyFile( "./src/index.html", "./build/index.html" );


const build = gulp.series(
  clean,
  javascript,
  html
);

async function server() {
  browserSync.init({
    server: {
      baseDir: "./build",
      index: "index.html",
      serveStaticOptions: {
        extensions: [ "html" ]
      }
    },
    port: 8080,
    open: false
  });
};

async function watch() {
  // start dev server
  server();

  gulp.watch( files.htmlPath, html )
    .on( "change", browserSync.reload );
  gulp.watch( files.jsPath, gulp.series( javascript, html ))
    .on( "change", browserSync.reload );

  // gulp.watch( files.htmlPath, html )
  //   .on( "change", () => console.log("html change") );
  // gulp.watch( files.jsPath, gulp.series( javascript, html ))
  //   .on( "change", () => console.log("js change") );
};

export { 
  clean,
  build,
  html,
  watch
};