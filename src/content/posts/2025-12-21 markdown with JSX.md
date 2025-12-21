---
title: "Astro에 mdx 확장 설치"
slug: "astro-mdx-setup"
pubDate: "2025-12-21 19:45:00"
summary: "Astro에서, 이미지 & 레이아웃 문제를 해결하기 위해 MDX 확장을 도입한 과정 정리"
tags: ["astro", "mdx"]
---

## 1. astro/mdx 확장 설치 및 설정

```bash
# @astrojs/mdx 설치
npm i @astrojs/mdx
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx"; // ✅ 확장 추가

export default defineConfig({
  site: "...",
  base: "...",
  integrations: [mdx()], // ✅ integrations에 mdx() 추가
});
```

## 2. markdown 파일 가져오는부분 수정

```js
// 마크다운 로드방식을 아래처럼 변경
import.meta.glob("@/content/posts/*.md"), // ⬅️ before
import.meta.glob("@/content/posts/*.{md, mdx}"), // ➡️ after
```
