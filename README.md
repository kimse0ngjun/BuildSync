# BuildSync

건설 현장의 자재 발주, 재고 관리, 자재 사용 현황을 효율적으로 관리하기 위한 웹 기반 시스템입니다.

## 프로젝트 소개

BuildSync는 건설 현장의 자재 발주, 재고, 공사 일정 및 비용을 통합 관리하는 시스템입니다.

발주부터 입·출고, 재고 관리, 현장별 자재 사용 현황 및 비용 분석 기능을 제공하여 효율적인 공사 운영을 지원합니다.

## 주요 기능

### 공사 현장 관리

- 공사현장 등록 / 수정 / 삭제
- 현장별 자재 사용 내역 조회
- 현장별 비용 분석

### 발주 관리

- 발주서 작성
- 발주 요청 / 승인 / 취소
- 발주 상태 관리

### 자재 및 재고 관리

- 입고 처리
- 출고 처리
- 재고 부족 알림
- 자재 등록 / 수정 / 삭제

### 일정 관리

- 일정 등록
- 일정 캘린더 조회

### 거래처 관리

- 거래처 등록 / 수정 / 삭제
- 거래처 목록 조회

### 관리자 기능

- 관리자 로그인
- 사용자 권한 관리
- 시스템 관리 기능

---

# System Architecture

```text
Client Browser

      |
      v

Nginx (80)

      |
      +----------------+
      |                |
      v                v

React Frontend     Spring Boot Backend

                      |
                      v

                    MySQL
```

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.5.5
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL 8.032
- JWT Authentication

### Frontend

- React
- TypeScript
- Axios
- Vite

### Infra

- Docker
- Docker Compose
- Nginx
- AWS
- GitHub Actions

## Project Structure

```text
BuildSync
│
├── backend                         # Spring Boot Backend
│   │
│   ├── src
│   │   └── main
│   │       ├── java/com/buildsync
│   │       │   ├── controller      # API Controller
│   │       │   ├── service         # Business Logic
│   │       │   ├── repository      # JPA Repository
│   │       │   ├── entity          # Database Entity
│   │       │   ├── dto             # Request / Response DTO
│   │       │   └── config          # Security, JWT Config
│   │       │
│   │       └── resources
│   │           ├── application.properties
│   │           └── data.sql
│   │
│   ├── build.gradle
│   ├── settings.gradle
│   └── Dockerfile
│
├── frontend                        # React Frontend
│   │
│   ├── src
│   │   ├── api                     # Axios API 설정 및 API 요청 관리
│   │   ├── components              # 공통 UI 컴포넌트
│   │   ├── context                 # 전역 상태 및 사용자 인증 관리
│   │   ├── images                  # 사용한 이미지
│   │   ├── pages                   # 화면 단위 페이지 컴포넌트
│   │   ├── styles                  # 전역 스타일 및 CSS 관리
│   │   ├── types                   # TypeScript 타입 정의
│   │   └── utils                   # 공통 함수 및 유틸리티
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker                          # Infra 설정
│   │
│   └── nginx
│       └── default.conf            # Reverse Proxy 설정
│
├── docker-compose.yml              # Container Orchestration
│
├── .env                            # 환경 변수 관리
│
└── README.md
```

## Docker Architecture

```text
                Client
                  │
                  ▼
              Nginx :80
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
 React Container        Spring Boot Container
 :80                    :8080
                            │
                            ▼
                       MySQL Container
                          :3306
```

## Environment

환경 변수는 `.env` 파일에서 관리합니다.

```env
MYSQL_DATABASE=buildsync
MYSQL_ROOT_PASSWORD=****

DB_USERNAME=root
DB_PASSWORD=****

JWT_SECRET=****
```

## Run Project

프로젝트 루트(BuildSync) 위치에서 실행합니다.

```bash
docker compose up -d --build
```

컨테이너 확인

```bash
docker ps
```

서비스 종료

```bash
docker compose down
```

## Service URL

Frontend

```
http://localhost
```

Backend API

```
http://localhost/api
```

MySQL

```
localhost:3306
```

## Deployment Flow

```text
GitHub
  │
  ▼
GitHub Actions
  │
  ▼
Docker Build
  │
  ▼
Docker Compose
  │
  ├── nginx
  ├── frontend
  ├── backend
  └── mysql
```

## Git Convention

| Type     | Description              |
| -------- | ------------------------ |
| feat     | 새로운 기능 추가         |
| fix      | 버그 수정                |
| refactor | 코드 리팩토링            |
| docs     | 문서 수정                |
| test     | 테스트 코드 작성 및 수정 |
| chore    | 빌드, 설정, 패키지 관리  |

### Commit Message Examples

```bash
feat: 공사 현장 등록 기능 구현

fix: 발주 승인 시 재고 수량 반영 오류 수정

refactor: MaterialService 비즈니스 로직 분리

docs: README 프로젝트 구조 추가

test: OrderService 단위 테스트 작성

chore: Docker 환경 설정 추가
```

### Commit Rule

- 커밋 메시지는 한 가지 작업만 작성
- 커밋 타입(feat, fix, refactor 등)을 반드시 작성
- 커밋 메시지는 명확하고 간결하게 작성

## Branch Strategy

```text
main
├─ frontend
└─ backend
    ├─ backend/site
    ├─ backend/order
    └─ backend/material
```

### Merge Flow

```text
backend/site → backend → main
backend/order → backend → main
backend/material → backend → main
```
