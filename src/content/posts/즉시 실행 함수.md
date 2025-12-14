---
title: "즉시실행 함수 표현식"
slug: "astro-script-inline-iife-domcontentloaded"
pubDate: "2025-12-14 16:30:00"
summary: "JavaScript에서 즉시 실행되는 함수(IIFE)의 개념과 DOMContentLoaded와의 차이"
tags: ["javascript", "astro", "IIFE"]
---

## 1. 이상한코드와의 만남

`astro` 기반의 프레임워크 코드 작성중 해괴한(?) 코드를 만났다.

```html
<script is:inline>
  (() => {
    // code
  })();
</script>
```

사실 모르진 않았다. `즉시실행` 함수라는거는 알고있었음 다만, 어떻게 동작하는건지는 몰랐음, 풀어쓰면 아래와 같다

```html
<script is:inline>
  // function define
  (function () {
    /* code block */
  })(); // function call
</script>
```

정의와 동시에 호출을 하다보니 `})()` 이런식으로 끝부분이 호출되는거 (함수원형 작성 종료 + 즉시호출)

## 2. IIFE(즉시실행 함수 표현식) 이란?

IIFE 풀어쓰면 **Immediately Invoked Function Expression** 이라고 한다.

Immediately - 즉시<br/>
Invoked - 호출되다<br/>
Function - 함수<br/>
Expression - 표현식<br/>

> 중요한 포인트는 IIFE의 `E(Expression)` <br/>
> JavaScript에서 `function hello(){}` 는 **선언문**이라 즉시 호출할 수 없지만, <br/>
> `(function(){})` 처럼 감싸면 **표현 식**이 되어 곧바로 실행할 수 있다. <br/>

## 3. 조금더 자세히

어떤 언어든, 선언과 함수를 사용하는(`trigger`)역할을 하는곳에서 **함수를 호출**해야, 그 함수가 동작하는법이다.

가령 java에서 main() 함수도 내부적으로 main() 함수를 호출하게 되어있어서 main() 함수안에 코드를 작성하고, 실행만하면 동작하는것 처럼 보일뿐

스크립트도 똑같다 함수를 만들고, 호출하는곳이 있어야 그 함수가 동작하는법

```js
// -- 1. 함수의 선언
function hello() {
  console.log("hello");
}
// -- 2. 함수의 호출
hello();
```

## 4. DOMContentLoaded vs IIFE

결론적으로 말하면 `<script>` 태그가 열리고 닫힌 위치 기준으로 실행순서가 다름 <br/>
근데 html이 끝나는 `<script is:inline>` 에 IIFE를 작성했으니, `DOMContentLoaded` 와 `IIFE`는 실행 시점이 같음

> 그럼, 왜 DOMContentLoaded 대신 IIFE를 썼을까 ?

### 1. scope 보호

```html
<script is:inline>
  // MyComponent.astro
  const message = "hello"; // 해당 변수가 전역일 가능성이 높음
  document.addEventListener("DOMContentLoaded", () => {
    console.log(message);
  });
</script>
```

MyComponent가 여러 번 렌더링되거나, 여러 inline script가 같은 페이지에 포함될 경우<br/>
message는 전역(window) 스코프에 노출될 수 있어 충돌 가능성이 있음

```astro
<MyComponent /> // window.message
<MyComponent /> // window.message
```

반면에, IIFE로 선언한 함수의 경우는 함수가 블록처리가 되어, 전역변수가 아닌, 블록변수 처리가 됨

```html
<script is:inline>
  (() => {
    const message = "hello";
    console.log(message);
  })();
</script>
```

따라서 같은곳에서 반복적으로 참조하거나, <br/>
`Layout`에서 여러곳에서 참조해도 충돌가능성이 없어짐(DOMContentLoaded) 와는 다른점

### 2. 그럼 DOMContentLoaded 안에 선언하면 안되나

1. 그렇게 해도되지만, IIFE와 스코프의 범위가 달라짐 <br/>
   count는 **콜백 함수 블록 스코프** <br/>
   외부에서 접근이 안됨

```html
<script is:inline>
  document.addEventListener("DOMContentLoaded", () => {
    const count = 0;
    console.log(count);
  });
</script>
```

2. 하지만 상태를 선언후, DOMContentLoaded 에서 공유하는 코드스타일

```html
<script is:inline>
  let state = {};

  document.addEventListener("DOMContentLoaded", () => {
    state.ready = true;
  });
</script>
```

> **초래되는 문제점**
>
> 1. `state` -> 전역스코프, 다른 script에서 사용시 오류발생 가능성
> 2. `DOMContentLoaded`는 콜백 내부만 보호해 줄 뿐 블록 바깥에서 선언된 변수는 보호해 주지 못함
> 3. 해당 패턴은 SPA가 아닌 환경, Component 단위로 script가 쪼개지는 환경(`Astro`, `MPA`)에서 문제를 유발하기 쉬움

3. 그렇다면, 어떻게 할까

```html
<script is:inline>
  (() => {
    // 상태, 설정, 유틸

    document.addEventListener("DOMContentLoaded", () => {
      // DOM 의존 코드
    });
  })();
</script>
```

사용을 어떻게 하냐(script 로드위치) 에 따라 비슷할 수도, 다를 수도 있지만 비교를 하다보면 확연히 다른걸 알 수 있음

> 정리
>
> - `DOMContentLoaded`는 **"언제 실행할지"** 의 문제
> - `IIFE`는 **"어디에 격리할지"** 의 문제

### 3. 마무리

IIFE에 대해서 대충알고 있던 내용을 어느정도 정립을 하고, IIFE vs DOMContentLoaded 차이도 확실히 알게되었음. <br/>
