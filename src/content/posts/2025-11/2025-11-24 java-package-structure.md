---
title: "자바 패키지 구성"
slug: "java-package-structure"
pubDate: "2025-11-24"
summary: "역할별(Layer), 도메인별(feature) 패키지 구성"
category: "java"
tags: ["spring", "packages"]
---

# 자바에서 패키지 구성하는 유형

1. **역할별** (레이어별) 패키지
2. **도메인별** (기능/feature별) 패키지

각각 장단점이 있어서 규모·팀 상황에 따라 선택하거나 섞어 씀

## 1. 역할별(레이어별) 패키지 구성

```
com.example.app
 ├─ controller
 │   ├─ UserController.java
 │   └─ OrderController.java
 ├─ service
 │   ├─ UserService.java
 │   └─ OrderService.java
 ├─ repository
 │   ├─ UserRepository.java
 │   └─ OrderRepository.java
 ├─ dto
 │   ├─ UserRequestDto.java
 │   └─ OrderRequestDto.java
 └─ domain
     ├─ User.java
     └─ Order.java
```

### 장점

1. 구조가 직관적이고 익숙함
   - “Controller는 controller 패키지, Service는 service 패키지”라서 초반에 팀원들이 이해하기 쉽습니다.
   - 스프링 기본 예제들도 대부분 이 구조라서 입문자한테 친숙함.
2. 레이어(계층)을 기준으로 AOP, 인터셉터를 적용하기가 직관적임
   - `@RestControllerAdvice`, AOP, 인터셉터 등을 “controller 패키지 전체”에 묶어서 적용하기가 직관적입니다.
   - 서비스 계층에 공통 트랜잭션 정책, 로깅 AOP를 걸 때도 “service 패키지” 전체를 대상으로 걸기 쉬움.
3. 작은/단순한 프로젝트에서 관리가 편함
   - 도메인이 많지 않을 때는 이 구조가 오히려 덜 복잡합니다.
   - 혼자서 빠르게 CRUD 몇 개 만들 때는 그냥 레이어 별로 쭉 늘어놓고 작업해도 큰 문제 없음.

### 단점

1. 기능(도메인)별로 코드가 흩어져 있음
   - “회원 기능”을 파악하려면 `controller` / `service` / `repository` / `dto` 여러 패키지를 왔다 갔다 해야 합니다.
   - 유지보수할 때 컨텍스트 전환이 자주 일어나고, 신규 투입된 사람이 흐름 잡기가 어려울 수 있습니다.
2. 레이어(계층)을 기준으로 AOP, 인터셉터를 적용하기가 직관적임
   - `UserService` 에서 `OrderRepository` 를 쉽게 가져다 쓰는 식으로, 레이어만 맞으면 아무 도메인이나 참조해 버리는 경우가 많습니다.
   - 시간이 지나면 **“service가 규모가 커져서 유지보수가 힘들어질**” 가능성이 큼.
3. 모듈화/분리 배포에 약함
   - 나중에 `user` 기능을 따로 모듈/마이크로서비스로 떼어내고 싶어도 코드가 레이어별로 분산되어 있어서 분리 작업이 번거로울수 있음

## 2. 도메인별(기능별) 패키지 구성

```
com.example.app
 ├─ user
 │   ├─ UserController.java
 │   ├─ UserService.java
 │   ├─ UserRepository.java
 │   ├─ dto
 │   │   ├─ UserRequestDto.java
 │   │   └─ UserResponseDto.java
 │   └─ domain
 │       └─ User.java
 ├─ order
 │   ├─ OrderController.java
 │   ├─ OrderService.java
 │   ├─ OrderRepository.java
 │   ├─ dto
 │   │   ├─ OrderRequestDto.java
 │   │   └─ OrderResponseDto.java
 │   └─ domain
 │       └─ Order.java
 └─ common
     ├─ error
     ├─ config
     └─ util
```

또는 더 압축해서

```
user
 ├─ api (controller)
 ├─ application (service)
 ├─ domain (entity + 도메인 서비스)
 └─ infra (repository 구현)
```

이런 식으로 DDD 스타일로도 많이 갑니다.

### 장점

1. 기능 단위로 코드가 모여 있어 이해가 빠름
   - “회원 관련은 전부 `user` 패키지에서 끝난다”
   - 신규 투입된 사람이 `user` 패키지만 보면 요구사항 → API → 서비스 → DB 흐름을 한 번에 파악할 수 있습니다.
2. 도메인 경계를 설계하고 지키기 쉬움
   - `order` 도메인이 `user` 의 내부 구현에 막 참조하는 것을 경계할 수 있습니다.
   - 특정 도메인끼리의 의존 관계를 의식적으로 설계하게 됩니다. (ex. `order` → `user` 조회용 port만 노출)
3. 모듈/마이크로서비스 전환에 유리
   - 나중에 `user`만 다른 서비스로 분리하고 싶을 때, 패키지/모듈 단위로 떼기 쉬움.
   - 멀티 모듈로 나누기도 좋습니다. `:user`, `:order` 식으로.
4. 모듈/마이크로서비스 전환에 유리
   - “User 스쿼드”, “Order 스쿼드” 이런 식으로 팀을 나눠도 서로 충돌이 덜합니다.
   - 각 팀이 자신의 도메인 패키지 내부만 집중 관리하게 만들 수 있습니다.

### 단점

1. 구조를 설계하는 난이도가 조금 더 높음
   - common / shared / cross-cutting concern 들을 어디까지 공통으로 뽑을지 고민이 필요합니다.
   - 도메인 간 의존을 잘못 설계하면 순환 참조나 의존 헬이 발생할 수 있습니다.
2. 작은 프로젝트에서 오버엔지니어링 느낌이 날 수 있음
   - CRUD 몇 개짜리 사이드 프로젝트에서 도메인별로 계층 다 쪼개면 디렉터리만 복잡해 보일 수 있음
3. 패키지별로 레이어가 섞여서 낯설게 느껴질 수 있음
   - `user` 패키지 안에 controller, service, repository가 같이 있어서 “레이어별 뷰”가 한 눈에 안 들어온다고 답답해할 수 있습니다.
   - 하지만 IDE에서 `type:class name:*Controller` 이런 필터로도 충분히 찾아보긴 합니다.

## 3. 그래서 어떤 패키지를 더 권장하는지 ?

- 간단한 프로젝트인 경우(공부용, 샘플용) → **역할별 패키지 구성**
- 확장가능성이 존재하는 프로젝트인 경우 → **도메인 패키지 구성**

아무래도 확장성이나, 모듈화로 다른프로젝트에 가져다 쓰기에 편한건 **도메인 패키지 구성**

초반에 규모가 작아도, 언젠가 커지고 **유지보수 난이도가 올라가는 걸 대비**해서요

## 4. 패키지구성은 왜 도메인 기반 구조를 선호할까?

### 1. 규모 확장에 훨씬 강함

서비스가 커질수록 기능 단위로 분리하는 게 유지보수에 유리합니다.

예시:

```
user/
order/
product/
payment/
```

이렇게 되어 있으면,
신 기능 추가하거나 릴리즈하는 것도 **독립적 컴포넌트 확장**이 쉬움.
(패키지만 추가하면 되니까)

### 2. 협업에 최적화됨

스쿼드 팀 구조(도메인별 담당 팀)랑 궁합이 좋습니다.

```
User팀 → user 패키지 담당
Order팀 → order 패키지 담당
```

서로 겹치는 부분이 줄어드니 **충돌**, 의존성 꼬임이 덜합니다.

~일단 conflict가 안난다는게 ..~

### 3. 멀티모듈/마이크로서비스 전환이 쉬움

나중에 order를 별도 서비스로 떼고 싶으면?

레이어별 구조는:

```
controller/OrderController.java
service/OrderServiceImpl.java
repository/OrderRepository.java
```

이렇게 섞여 있어서 분리하기 매우 힘듭니다.

반면 도메인 구조는:

```
 order/
 ├─ OrderController.java
 ├─ OrderService.java
 ├─ OrderRepository.java
 ├─ dto
 │   ├─ OrderRequestDto.java
 │   └─ OrderResponseDto.java
 └─ domain
     └─ Order.java
```

**폴더 하나만 잘라내면 독립 모듈**로 이동 가능.

### 4. 유지보수 속도 + 러닝커브 개선

신규 투입자가 특정 기능만 읽고도 전체 흐름을 쉽게 이해할 수 있음

```
board 내부에서
api → application → domain → infra 순서로 읽으면 전체 흐름이 보임
```

## 5. 결론

| 구분               | 레이어별         | 도메인별(요즘 트렌드) |
| ------------------ | ---------------- | --------------------- |
| 초기 난이도        | 쉬움             | 조금 더 고민 필요     |
| 작은 프로젝트      | 유리             | 약간 과한 느낌 가능   |
| 큰 프로젝트 / 협업 | 점점 관리 어려움 | 매우 유리             |
| 구조 확장성        | 약함             | 강함                  |
| 모듈/서비스 분리   | 힘듦             | 쉬움                  |

### 답변 한 줄로 요약

요즘 실무에서는? 장기 확장성과 협업을 고려해 처음부터 도메인 기준 구조로 개발하는 경우가 대부분이다.
