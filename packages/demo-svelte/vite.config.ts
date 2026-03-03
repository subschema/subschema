import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [svelte(), tailwindcss()],
});
