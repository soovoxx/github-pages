---
title: "UI5에 대해서 알아보기"
slug: "about-ui5"
pubDate: "2025-12-12"
summary: "ui5에 대해서 알아보도록 하자"
category: "ui5"
series: "SAP-UI5"
tags: ["ui5"]
---

SAPUI5는 SAP에서 만든 프론트엔드 UI 프레임워크 <br/>
"대기업용, 특히 SAP 백엔드랑 찰떡인 MVC 기반 웹 UI 프레임워크"

> SAP를 도입한 회사가 적용하기 좋아보임 (SAP - 서버, SAPUI5 - 화면)

---

## 1. 기본 철학(React/Vue와 다른 점)

| 구분     | SAPUI5                 |
| -------- | ---------------------- |
| 구조     | MVC강제                |
| 상태관리 | Model 중심(JSON/OData) |
| UI       | Control 기반(XML)      |
| 대상     | 엔터프라이즈 업무 화면 |
| 학습곡선 | 높음                   |

> React, Vue 처럼 자유도가 높은 컴포넌트 느낌 ❌ <br/> **규칙 빡센 회사 프레임워크** 느낌 ⭕

## 2. 기본 프로젝트 구조

```
webapp/
 ├─ controller/
 │   └─ Main.controller.js
 ├─ view/
 │   └─ Main.view.xml
 ├─ model/
 │   ├─ models.js
 │   └─ mockData.json
 ├─ Component.js
 ├─ manifest.json
 └─ index.html
```

## 3. 핵심 구성요소

### a. View

- 화면 정의 담당
- HTML 대신 SAPUI5 전용 태그 사용(`xml`)

```xml
<mvc:View
  controllerName="my.app.controller.Main"
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m">

  <Page title="Hello SAPUI5">
    <content>
      <Text text="{/message}" />
      <Button text="클릭" press="onPress" />
    </content>
  </Page>
</mvc:View>
```

### b. Controller

- Event & 로직 담당 (React의 handler 느낌)

```js
sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("my.app.controller.Main", {
    onPress: function () {
      alert("버튼 클릭!");
    },
  });
});
```

- `press="onPress"` -> controller 함수 연결

### c. Model(데이터의 중심)

SAPUI5는 `Model-first` 프레임워크

```js
var oModel = new sap.ui.model.json.JSONModel({
  message: "Hello SAPUI5",
});
this.getView().setModel(oModel);
```

View에서는 이렇게 바인딩을 처리함

```xml
<Text text="{/message}" />
```

### d. Component.js

> React의 `App.tsx` 와 같은 역할

```js
return UIComponent.extend("my.app.Component", {
  metadata: {
    manifest: "json",
  },
  init: function () {
    UIComponent.prototype.init.apply(this, arguments);
  },
});
```

### e. manifest.json

> SAPUI5 의 설정파일 = 거의 모든 것을 여기서함

```json
{
  "sap.ui5": {
    "rootView": {
      "viewName": "my.app.view.Main",
      "type": "XML"
    },
    "models": {
      "": {
        "type": "sap.ui.model.json.JSONModel"
      }
    }
  }
}
```

여기서 **라우팅, 모델, 테마, 라이브러리, OData** 연결을 전부 설정함

React의 `package.json + index.js + react router` 합쳐놓은 느낌

## 4. 개인적인 느낌

sap를 위한 ui프레임워크 이라는 한정적인(?) 환경<br/>
어떤프로그램에 최적화되었다는점, 반대로말하면 자유도가 적으니 호환성이 낮음(**개발환경 자유도가 떨어지지 않을까 하는 생각**)<br/>
코드가 익숙하지 않아서 러닝커브가 있음 ...
