# Agent Guide

- 개발 문서는 Git에서 제외되는 `docs/`에 보관한다. 작업 전에 `docs/README.md`, `docs/agent-guide.md`, `docs/development.md`를 읽고, 관련 검증은 `docs/design-qa.md`를 참고한다. 새 클론에 로컬 문서가 없으면 아래 기본 규칙과 `src/mobile/COMPONENTS.md`를 따른다.
- 기획·디자인 결정과 상세 구현 기록은 `docs/development.md`, 검증 결과는 `docs/design-qa.md`에 추가한다. 공개 README는 실행·빌드·배포 방법을 개조식으로 간단히 유지한다.
- `docs/`와 `qa/`는 로컬 전용이다. 강제로 Git에 추가하거나 GitHub에 업로드하지 않는다.
- 앱 화면은 `src/Prototype.tsx`, `src/prototype.css`에서 수정한다. 모바일 런타임, 기기 자산 및 빌드 보호 파일은 `mobile-runtime.lock.json`의 계약을 유지한다. 명시적인 런타임 수정 요청 없이 보호 파일이나 해시를 변경하지 않는다.
- 모바일 입력·스크롤·시트는 `src/mobile/COMPONENTS.md`의 컴포넌트를 사용한다. 페이지 전환 전에 키보드를 닫고, 기기 프레임과 안전 영역을 유지한다.
- 작업 완료 전에 `npm run check:runtime`을 실행한다. 코드 변경에 맞는 빌드·동작 검증을 수행한다.
- 저장소: `kohs2k21/2026-2-1team-industry-academia-capstone-design`. `main` 푸시 시 `.github/workflows/pages.yml`이 GitHub Pages로 자동 배포한다.
