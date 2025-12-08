// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://soovoxx.github.io",
  base: "/github-pages", // 레포 이름
  outDir: "./docs", // 빌드 결과를 docs 폴더에
});
