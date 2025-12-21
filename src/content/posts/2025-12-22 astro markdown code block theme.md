---
title: "Astro code-block 테마 설정"
slug: "markdown-code-block-theme"
pubDate: "2025-12-22 00:05:00"
summary: "다양한 코드블럭을 사용할 수 있도록 해보자"
tags: ["astro", "code-block", "theme"]
---

## 1. 적용계기

코드블럭을 자주사용했는데, 아무래도 주석을 이용하여 설명하는쪽이 보기가 힘들어서<br/>
(코드블럭이랑, 주석색상이랑 비슷하게 보여서 적응이 힘든) 적용하게 되었음

## 2. 설정방법

[code-block 테마 설정 링크](https://docs.astro.build/en/reference/configuration-reference/#markdown-options)
는 링크를 첨부해 두어서 링크를 참조하면 좋을거같고 <br/>
[shki theme](https://shiki.style/themes) 도 같이 참조하면 좋을거같다

일단 `astro.config.mjs` 파일로 가서 `markdown.shikiConfig` 하위에 옵션을 추가하면 된다

```js
export default defineConfig({
  /* setting */
  markdown: {
    shikiConfig: {
      theme: "dracula",
    },
  },
});
```

본인은 그냥 간단하게 `theme:dracula` 속성만 추가한게 다인데<br/>
Docs에 친절하게 설명이 되어있어서, 해당부분 그대로 잘 따라가면 light/dark 일때, 코드블럭 테마 적용하기가 꽤 쉬웠음<br/>
