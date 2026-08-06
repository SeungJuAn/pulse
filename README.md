# Pulse

> 주식에 조건을 걸어두면, 서버가 여러 소스에서 주기적으로 시세를 수집하다가 조건 충족 시 알림을 보내는 서비스.

**NestJS를 _관용적으로(idiomatic)_ 작성하는 연습**을 목적으로 만든 백엔드 사이드 프로젝트입니다. 프레임워크가 제공하는 정석 방식(DI, DTO 검증, 예외 클래스 등)을 손으로 우회하지 않고 끝까지 쓰는 데 초점을 뒀습니다.

## 정조준한 학습 포인트

> "내가 손으로 짜기 전에, Nest/TypeScript가 제공하는 방법이 있나?"

| 영역 | 손으로 짜던 방식 | 이 프로젝트에서 |
|---|---|---|
| **검증** | `if`문 + 수동 정규식 | DTO + `class-validator` + 전역 `ValidationPipe` |
| **응답/에러** | `res.status(...).json(...)` | 예외 클래스 `throw` + 전역 Exception Filter |
| **객체 생성** | `new`로 직접 | 생성자 주입(DI) · 프로바이더 토큰 |
| **타입** | `any` / `as` | 좁히기(narrowing) · `ParseIntPipe` 등 |

## 기술 스택

- **NestJS 10** · **TypeScript**
- **MikroORM** (better-sqlite3)
- **JWT** 인증 (`@nestjs/jwt`) + 커스텀 Guard · **bcrypt** 해싱
- **class-validator** / **class-transformer**
- **Swagger** (OpenAPI) — 프론트 없이 이게 인터페이스
- **Jest** (통합 · e2e · 단위) · **ESLint** (flat config)
- **pnpm** · Node 20

## 실행

```bash
pnpm install
pnpm dev
```

서버가 뜨면 **Swagger UI**에서 모든 API를 문서로 보고 직접 실행할 수 있습니다:

```
http://localhost:3000/docs
```

## 테스트

```bash
pnpm test
```

> better-sqlite3(네이티브 모듈)가 Node 20에 고정돼 있어, 반드시 `pnpm`을 통해 실행해야 합니다. (`.npmrc`의 `use-node-version`)

## 구현된 API (M1)

| 메서드 | 경로 | 설명 | 보호 |
|---|---|---|---|
| `POST` | `/user` | 회원가입 (bcrypt 해싱) | — |
| `GET` | `/user/:id` | 유저 조회 | — |
| `POST` | `/auth/login` | 로그인 → JWT 발급 | — |
| `GET` | `/auth/me` | 내 정보 | 🔒 JWT |
| `GET` | `/health` | 헬스체크 | — |

## 로드맵

- [x] **M1 — 기반 + 인증**: 회원가입/로그인(JWT), 커스텀 Guard, 전역 ValidationPipe·Exception Filter, Swagger, 테스트 12개
- [ ] **M2 — 멀티소스 시세 수집** _(진행 중)_: 소스 전략을 토큰 배열로 DI, `@Cron` 주기 수집(실패격리·dedup·retry), 실시간 WebSocket push
- [ ] **M3 — 감시 조건(Watch) + 조건 판정**
- [ ] **M4 — 알림** (Notifier 전략, 멱등 발송)
- [ ] **M5 — 공개 API + API Key** (scopes 권한 체크)
- [ ] **M6 — 완성도** (Interceptor, 인덱스, 통합 마감)

## 프로젝트 구조

```
src/
├─ auth/          # 로그인 · JWT 발급 (AuthModule)
├─ user/          # 회원가입 · 조회 (UserModule)
├─ common/        # JwtGuard · 전역 Exception Filter
├─ database/      # MikroORM 설정 · 엔티티
└─ main.ts        # ValidationPipe · Swagger 부트스트랩
```
