import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
  // Allows for local debugging for iOS.
  server: {
    host: true,
  }
};

export default config;
