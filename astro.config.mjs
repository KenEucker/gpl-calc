import { loadEnv } from "vite";
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

const {
  PUBLIC_SANITY_STUDIO_PROJECT_ID,
  PUBLIC_SANITY_STUDIO_DATASET,
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
} = loadEnv(import.meta.env.MODE, process.cwd(), "");
import { defineConfig } from "astro/config";

// Different environments use different variables
const projectId = PUBLIC_SANITY_STUDIO_PROJECT_ID || PUBLIC_SANITY_PROJECT_ID;
const dataset = PUBLIC_SANITY_STUDIO_DATASET || PUBLIC_SANITY_DATASET;

// https://astro.build/config
export default defineConfig({
    integrations: [
      tailwind({
        config: {
          applyBaseStyles: false,
          purge: []
        }
      }),
      sitemap({
        changefreq: "weekly",
        priority: 0.7
      }), 
      vue({
        appEntrypoint: '/src/pages/_app'
      }), 
      sanity({
        projectId,
        dataset,
        studioBasePath: "/admin",
        useCdn: false,
        // `false` if you want to ensure fresh data
        apiVersion: "2023-03-20" // Set to date of setup to use the latest API version
      }),
      react(),
      sentry(),
      spotlightjs(),
    ]
});