---
title: "MockMvc Test 정리"
slug: "mockMvc-test"
pubDate: "2025-12-10"
summary: "spring mock test"
category: "spring"
tags: ["spring", "mockMvc"]
---

# **1. mockMvc를 왜 쓰는가?**

스프링에서 REST API를 테스트하려면 실제 서버를 띄우지 않아도

**HTTP 요청을 시뮬레이션해서 Controller → Service → Repository** 흐름을 검증할 수 있다.

즉,

- 서버를 실제로 실행하지 않아도 되고
- HTTP 요청/응답을 그대로 흉내낼 수 있고
- JSON Body, Status, Header 등을 모두 확인할 수 있어서

**API 검증을 빠르고 정확하게 할 수 있다는 장점이 있다.**

# **2. mockMvc 테스트 종류 (중요!)**

mockMvc의 테스트 스코프는 어떤 어노테이션을 쓰느냐에 따라 달라진다.

### **@WebMvcTest**

- Controller 레이어만 테스트
- Service, Repository는 MockBean으로 대체
- 가장 가벼운 테스트 형태

### **@SpringBootTest + @AutoConfigureMockMvc**

- 실제 스프링 빈 올라옴 → 거의 통합 테스트
- Service, Repository 실제 동작
- H2 같은 인메모리 DB까지 붙이면 진짜 API 통합 테스트에 가까움

→ 무엇을 테스트하느냐에 따라 선택하면 된다.

# **3. mockMvc 요청/응답 예시**

```java
@Test
fun `선수 조회 API - 성공`() {
    mockMvc.perform(
        get("/players/{name}", "강백호")
            .contentType(MediaType.APPLICATION_JSON)
    )
        .andExpect(status().isOk)
        .andExpect(jsonPath("$.data.name").value("강백호"))
        .andExpect(jsonPath("$.success").value(true))
}
```

이 테스트는 아래를 검증한다:

- 라우팅 정상 (/players/{name})
- PathVariable 정상 전달
- Response JSON 구조가 기획대로 맞는지
- Status 200 OK

# **4. mockMvc 실행 후 Response 로그 해석**

mockMvc가 찍어주는 response log는 API 동작 확인에 매우 유용하다.

```bash
MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"application/json"]
     Content type = application/json
             Body = {"data":{"name":"강백호"...},"success":true}
```

여기서 체크 포인트는:

- Status = 200 → API 정상 동작
- Content-Type = application/json → REST API 형태 정상
- Body → DTO 변환, Response 래핑 정상
- Forwarded/Redirected URL = null → REST라서 redirect 없음 → 정상

이 로그만 봐도 Controller → Service → Repository 흐름이 정상적으로 처리된 걸 알 수 있다.

# **5. mockMvc로 검증해야 하는 포인트 체크리스트**

### **요청(Request)**

- PathVariable 제대로 전달되는가?
- RequestParam 검증은 정상인가?
- RequestBody validation 동작하는가?

### **응답(Response)**

- Status Code (200, 400, 404…)
- JSON Body
- success / error 구조
- 데이터 필드 값 정상 매핑 여부

### **예외 처리**

- 존재하지 않는 데이터 요청 시 404 나는가?
- validation 실패 시 400 나는가?

→ 이 부분이 TIL에 들어가면 **실무 테스트 템플릿으로 재활용하기 좋음**.

# **6. mockMvc 내부 동작 흐름 (간단 그림)**

```
mockMvc.perform()
     ↓
DispatcherServlet
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
DB(H2 or MockBean)
```

테스트 설정에 따라 Repository/DB가 실제인지 Mock인지만 달라진다.

# **7. 요약**

- mockMvc는 실제 서버 없이 API 호출을 시뮬레이션하는 도구
- 테스트 스코프는 @WebMvcTest / @SpringBootTest 에 따라 달라짐
- JSON, Status, Header 등 실제 API와 거의 동일하게 검증 가능
- mockMvc 로그는 API 동작을 체크하는 핵심 데이터
- 체크리스트와 구조도를 함께 기록해두면 TIL 재사용성이 매우 높아짐
