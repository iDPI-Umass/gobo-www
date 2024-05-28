import { createRequire } from "node:module";
import { sveltekit } from "@sveltejs/kit/vite";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";

const require = createRequire( import.meta.url );

/** @type {import("vite").UserConfig} */
const config = {
	plugins: [
    sveltekit(),
    ckeditor5( {
      theme: require.resolve( "@ckeditor/ckeditor5-theme-lark" )
    }),
  ],

  // Allows for local debugging for iOS.
  server: {
    host: true,
  }
};

export default config;