---
title: "camelCase와 snake_case"
slug: "camel-snake"
pubDate: "2025-11-26"
summary: "camelCase와 snake_case 구분지어 사용하기"
category: "spring-jpa"
tags: ["spring-jpa"]
---

**JPA + RDB(ORACLE/MySQL/Postgres)** 조합으로 개발할 때는

**DB 컬럼은 snake_case**,

**코드 속 필드명은 camelCase**

이 조합이 사실상 ‘표준’처럼 쓰인다

## **1. 가장 흔한 패턴**

```kotlin
- Entity

@Column(name = "is_active")
open var isActive: Boolean? = null
```

```sql
- Mysql

is_active tinyint(1)
```

즉,

- **DB**: is_active
- **코드**: isActive

이 매칭되는 구조가 제일 편하고, 많은 회사들이 이렇게 씀.

## **2. 왜 snake_case가 더 권장될까?**

### **이유 a. JPA 기본 네이밍 전략과 가장 잘 맞음**

Hibernate는 기본적으로 isActive → is_active 로 자동 변환하도록 설정되어 있음.

그래서 snake_case로 해두면 엔티티에 @Column 안 적어도 자동 매핑이 자연스럽게 됨

### **이유 b. SQL에서는 snake_case가 더 읽기 쉬움**

~이건 개인적일수도 아닐수도~

```sql
SELECT player_id, is_active
FROM player;
```

보는 순간 바로 단어 구분이 돼.

camelCase는 SQL에서 잘 쓰지 않음.

### **이유 c. 팀 협업 시 DB 표준은 대부분 snake_case**

대부분의 회사 DB 표준:

- 테이블명: snake_case
- 컬럼명: snake_case
- PK/FK: snake_case
- 코드(Java/Kotlin): camelCase

이게 가장 흔한 정석 조합.

### **이유 d. camelCase 컬럼을 쓰면 이런 문제가 생김**

- 코드엔 isActive
- DB엔 isActive
- 내부 전략은 is_active 로 매핑하려 함

그래서

**컬럼 중복 생성**

같은 문제가 자주 생겨.

snake_case면 아예 안 생김.

## **3. 그래서 개발시 추천하는 조합**

정리하면 이렇게:

| **구분**      | **컨벤션**                 |
| ------------- | -------------------------- |
| DB table      | snake_case (ex: player)    |
| DB column     | snake_case (ex: is_active) |
| Entity 클래스 | PascalCase (ex: Player)    |
| Entity 필드   | camelCase (ex: isActive)   |

이 조합이 제일 무난하다.

## 4. 결론

**JPA + DB 함께 쓸 때는 DB 컬럼은 `snake_case`를 권장!**

camelCase 로 DB를 구성하면 naming 전략이랑 충돌해서 문제를 더 자주 만나게 됨.
