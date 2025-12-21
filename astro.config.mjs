// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://soovoxx.github.io",
  base: "/github-pages", // 레포 이름
  integrations: [mdx()],
});
