---
title: "Spring Controller와 Swagger 구성"
slug: "controller-swagger-issue"
pubDate: "2025-12-25 01:00:00"
summary: "Swagger 어노테이션이 Controller 가독성을 해치는 문제와 해결방안"
tags: ["java", "spring", "swagger"]
---

## 1. Controller에 Swagger 적용 예제

✔️ 이 글에서는 편의상 Swagger라고 부르지만, 실제로는 OpenAPI 스펙을 생성하는 springdoc 기반 구성을 의미한다.

---

보통 Swagger(OpenAPI)를 사용하는 프로젝트들을 보면, `Controller` 코드가 유독 지저분해지는 공통적인 패턴을 자주 발견하게 된다.

예를 들어, 게시글 상세 조회 API 하나만 보더라도 이런 코드가 나온다.

```java
@Operation(summary = "게시글 상세 조회", description = "게시글 ID로 상세 정보를 조회한다.")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "조회 성공",
        content = @Content(schema = @Schema(implementation = PostDetailResponse.class))),
    @ApiResponse(responseCode = "404", description = "게시글 없음",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
})
@GetMapping("/posts/{postId}")
public ApiResponse<PostDetailResponse> getPost(
    @Parameter(description = "게시글 ID", example = "1")
    @PathVariable Long postId
) {
    return ApiResponse.ok(postService.getPost(postId));
}
```

코드를 실제로 읽는 사람의 관점에서 보면, 관심 있는 부분은 대략 이 정도다.

- endpoint는 어떻게 되는지 - `/posts/{postId}`
- 어떤 API인지 - `getPost()`
- 무엇을 받는지 - `postId`
- 내부에서 무슨 일을 하는지 - `postService.getPost(postId)`

**결국, 핵심 로직은 아래의 코드 한 줄이다.**

```java
return ApiResponse.ok(postService.getPost(postId));
```

하지만 `Swagger`를 적용하는 순간, 컨트롤러 하나에 붙는 부가 코드의 양은 급격히 늘어난다.

- @Operation
- @ApiResponses
- @ApiResponse
- @Parameter
- 각종 description, example, schema 지정 …

결과적으로 비즈니스 관점에서 중요한 코드보다, 문서용 코드가 더 많은 상황이 된다.

## 2. Controller + Swagger의 코드가독성 이슈

원래 Controller의 책임은 비교적 명확하다.

- HTTP 요청 매핑
- 파라미터 바인딩
- 서비스 호출
- 응답 반환

반면 Swagger가 추가되면, Controller는 아래 역할까지 함께 떠안게 된다.

- API 문서 설명
- 요청 / 응답 예제 정의
- 응답 스펙 문서화

> 즉, 하나의 **Controller**가 잘못된 책임을 수행하고 있는 것이 아니라, <br/>
> **너무 많은 정보를 한 공간에 담고 있어 가독성이 떨어지는 문제에 가깝다.**

## 3. 해결방안 (Swagger 전용 interface 분리)

- Swagger 문서 어노테이션 → interface
- Controller → interface 구현 + 매핑/바인딩/호출만 담당

#### 3-1. Swagger + 매핑까지 인터페이스로 분리

```java
@RequestMapping("/posts")
public interface PostApi {

  @Operation(summary = "게시글 상세 조회")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "성공"),
      @ApiResponse(responseCode = "404", description = "없음")
  })
  @GetMapping("/{postId}")
  ApiResponse<PostDetailResponse> getPost(@PathVariable Long postId);
}
```

```java
@RestController
public class PostController implements PostApi {

  private final PostService postService;

  @Override
  public ApiResponse<PostDetailResponse> getPost(Long postId) {
    return ApiResponse.ok(postService.getPost(postId));
  }
}
```

장점 : Swagger / Controller가 분리되어서, 컨트롤러쪽 코드 보기가 매우 좋아짐<br/>
단점 : 매핑 정보(`@GetMapping`)가 interface에 있어 **엔드포인트 찾기가 불편할 수 있음**

#### 3-2. Swagger 어노테이션만 interface로 분리

```java
public interface PostApiDocs {

  @Operation(summary = "게시글 상세 조회")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "성공"),
      @ApiResponse(responseCode = "404", description = "없음")
  })
  ApiResponse<PostDetailResponse> getPost(Long postId);
}
```

```java
@RestController
@RequestMapping("/posts")
public class PostController implements PostApiDocs {

  private final PostService postService;

  @GetMapping("/{postId}")
  @Override
  public ApiResponse<PostDetailResponse> getPost(@PathVariable Long postId) {
    return ApiResponse.ok(postService.getPost(postId));
  }
}
```

장점 : `URL/HTTP method` 컨트롤러에서 한눈에 보임 + `Swagger` 는 분리 <br/>
단점 : 인터페이스/컨트롤러에 메서드 시그니처가 중복돼 수정 포인트가 2곳이 됨

---

## 4. 결론

`Swagger` 관련한 코드를 `interface`로 분리하여, 코드를 가독성 좋게 하는건 좋음

**그렇지만** 문서 인터페이스를 전역 docs/ 패키지로 몰아넣는 방식은 팀 규모/구조에 따라 문제가 있을 수 있음.

- 단일 모듈: 패키지 위치 때문에 import/implements가 깨지진 않는 편
- 멀티모듈/의존성 규칙 강제: docs가 feature DTO를 참조하는 순간 의존성 방향이 꼬여 순환 의존성 리스크가 생길 수 있음
