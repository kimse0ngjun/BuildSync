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

## Tech Stack

### Backend

- Java
- Spring Boot
- Spring Security
- JPA
- MySQL

### Frontend

- React
- Axios

### Infra

- Docker
- AWS
- Nginx
- GitHub Actions

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
