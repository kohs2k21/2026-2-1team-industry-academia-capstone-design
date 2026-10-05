# 국내잔고 목업 시각·동작 검증

final result: passed

판정 범위: 앱 소유 화면의 재현 및 목업 동작. 원본 서체의 동일성 인증 또는 신규 AI 기능 완성이 아니다.

## 비교 환경과 근거

- 원본: `/Users/seongjun/Downloads/IMG_0581.PNG`, 1170×2532 pixels.
- 구현: `http://localhost:4173`, Codex in-app browser.
- 브라우저: 1400×1200 CSS pixels. iPhone screen: 393×852 CSS pixels, scale 1 확인.
- 구현 캡처: `qa/final-iphone.png`, 393×852 pixels (출력 밀도 1).
- 원본을 393×852로 리샘플링. 종횡비 차이 약 0.2%를 정규화.
- 상태: 국내잔고 / 키움 잔고 / 계좌 1234-5678 김철수 / 잔고 0 / 상세 펼침 / 융자별 / 2줄 / 나스닥 / 닫힌 시트.
- 전체 비교: `qa/comparison-final.png` (왼쪽 원본, 오른쪽 구현).
- 확대 비교: `qa/comparison-detail.png` (계좌 선택, 손익, 잔고 상세, 도구, 보유종목 헤더).
- 추가 상태: `qa/empty-sell-sheet.png`, `qa/pixel.png`, `qa/small-viewport.png`.

## 비교 이력

1. `qa/comparison-initial.png`: P2 상단 탭 가로 정렬, 카드 높이 약 2px, 지수 숫자 간격, 랭킹 문자열 폭 차이 확인. 투자도구 기본 라이브러리 아이콘의 형태 차이 확인.
2. 서체를 Apple SD Gothic Neo에서 Noto Sans KR로 변경, 탭 좌우 기준 보정, 카드 높이 2px 축소, 지수를 그리드로 정렬, 원본 투자도구 아이콘 추출. `qa/iteration-2.png`에서 중간 상태 확인.
3. `qa/comparison-final.png`와 `qa/comparison-detail.png`를 동일 입력에서 원본과 대조. 주요 영역의 높이·구조·간격 유지. 아래 P3와 기기 런타임 차이를 제외한 P0/P1/P2 없음.

## 필수 시각 항목

- 글꼴: Noto Sans KR 로컬 포함. 본문 약 14px, 계좌 약 16px, 총 손익 값 약 19px. 랭킹·계좌 문자열 줄바꿈 없음. 원본 서체는 확정할 수 없어 P3 제한으로 기록.
- 레이아웃: 상단 109px, 잔고 탭 약 44px, 카드 약 160px, 표 헤더 약 52px, 하단 지수 약 31px. 빈 잔고 여백과 고정 하단 메뉴 유지.
- 색상: #111111 본문, #1e1e1e 상단, #262626 표 헤더, 회색 텍스트와 경계선, 분홍 새로고침, 파란 일괄매도.
- 이미지: 투자도구 아이콘은 원본 크롭. 일반 아이콘은 Phosphor 라이브러리. 전체 화면을 배경 이미지로 사용하는 방식이 아닌 실제 버튼·텍스트·레이아웃이다.
- 문구: 원본 앱 문구 보존. 사용자 지시에 따라 계좌 식별정보만 변경. 보유종목 없음 상태 유지.

## 동작 확인

- 계좌 시트를 열어 두 번째 가상 계좌 선택 → 메인 계좌 문구 반영.
- 손익 요약을 눌러 상세 접기 → 다시 펼치기.
- 2줄 → 1줄 → 2줄 전환 및 표 헤더 변경.
- 예수금 탭 → 예수금/D+1/D+2/출금가능금액 표시 → 국내잔고 복귀.
- 설정 시트에서 융자합 선택 → 적용 → 메인 버튼 aria-pressed 확인.
- 새로고침 → 회전 표시 → 완료 알림.
- 일괄매도 → 매도 가능한 보유종목 없음 안내 → 확인으로 닫기.
- iPhone / Pixel 10 전환. Pixel 427×952에서 하단 탐색 영역과 앱 메뉴 겹침 없음.
- 작은 브라우저 390×844에서 런타임이 기기를 약 0.67배 축소하고 앱 컨트롤을 유지.
- 초기 개발 중 패키지 최적화 시점의 React HMR 오류가 기록되었으나 전체 새로고침 후 재검증에서는 새로운 warning/error 0건.
- TypeScript 및 프로덕션 빌드 통과. 보호된 런타임 28개 파일 무결성 검사 통과.

## 남은 P3 및 의도된 차이

- 원본 폰트 파일 없음: 동일 폰트임을 보장하지 않음. 일부 자폭·굵기·안티앨리어싱에 미세한 차이.
- 작은 음성·정렬·새로고침 아이콘은 라이브러리의 유사 아이콘으로 일부 선 형태가 다름.
- 프리뷰 기기 프레임/노치/홈 인디케이터/현재 시각/통신 아이콘은 보호된 모바일 런타임 제공. 앱 내용과 분리하여 평가.
- 하단 미구현 목적지와 투자도구 일부는 안내 메시지만 표시. 신규 AI 기능 및 영상은 후속 범위.

## 구현 체크리스트

- [x] 원본과 전체/확대 비교
- [x] P2 정렬·간격 수정 후 재캡처
- [x] 주요 시연 조작 및 콘솔 검사
- [x] iPhone / Pixel / 작은 뷰포트 확인
- [x] 빌드 및 런타임 보호 검사
- [x] 로컬 미리보기 유지, 배포 없음

## 후속 변경: AI 진입 버튼과 빈 랜딩 (2026-10-02)

- 사용자 브라우저 주석을 기준으로 지수 바 오른쪽 위에 54×54px 원형 AI 버튼 추가.
- 브라우저 측정: 지수 바 위 12.01px, 오른쪽 16px. 기존 레이아웃 이동 없음.
- 버튼은 .kiwoom의 형제 레이어이며 z-index 100. 메뉴 시트가 열린 상태에서도 elementFromPoint로 버튼이 최상위임을 확인하고 실제 클릭으로 랜딩 이동까지 검증.
- 랜딩: 어두운 빈 화면과 뒤로가기 버튼 하나만 제공. 챗봇 미구현.
- 1줄 설정 → 랜딩 → 뒤로가기 후 1줄 설정 유지 확인. 진입 시 뒤로가기, 복귀 시 AI 버튼으로 키보드 포커스 이동.
- 근거: qa/ai-entry-comparison.png (변경 전/후 393×852 동일 뷰포트), qa/ai-landing.png, qa/ai-entry-preview.png. 회색 원은 프리뷰 터치 포인터이며 앱 콘텐츠가 아님.
- 폰트·기존 간격·색상·자산·문구를 전후 비교하여 의도치 않은 변경 없음 확인. 신규 버튼 외 화면 유지. 랜딩은 사용자 요청대로 디자인 보류.
- 프로덕션 빌드 및 런타임 검사 통과. 이번 검증 중 신규 콘솔 warning/error 없음.
- final result: passed

## 후속 변경: AI 버튼 입체감 (2026-10-02)

- 사용자 요청에 따라 같은 54px 원형에 상단 내부 하이라이트, 하단 음영, 아래쪽 5px 두께, 부드러운 외부 그림자를 적용. hover 1px 상승, 누름 3px 하강.
- 런타임의 focus shadow 초기화가 버튼 입체감을 지우지 않도록 앱 버튼에만 그림자 우선순위를 부여. 복귀 후 포커스 상태에서도 computed box-shadow 확인.
- qa/ai-depth-comparison.png에서 변경 전/후를 같은 표시 크기로 비교. 화면 구조, 폰트, 버튼 위치·크기, 문구, 기존 자산 유지. 새로운 이미지 자산 없음.
- 근거: qa/ai-depth-browser.png (브라우저 786×766), qa/ai-entry-depth.png, qa/ai-button-depth-detail.png. 원본 393×852 캡처와 현재 축소 프리뷰를 292×633으로 정규화해 버튼 스타일만 비교.
- AI 버튼 → 빈 랜딩 → 뒤로가기 통과. 포커스 후에도 입체 효과 유지. 프로덕션 빌드와 런타임 검사 통과.
- final result: passed

## 후속 변경: 플랫 버튼 (2026-10-02, 최신)

- 최신 사용자 요청으로 입체 효과를 제거. 단색 #c43b83, 흰색 AI 17px, 테두리·그림자·광택·텍스트 그림자 없음. 누름 피드백은 색상과 .96배 축소만 사용.
- 브라우저 464×766, 앱 화면 약 291.5×632 축소 표시에서 확인. computed box-shadow/text-shadow 모두 none, z-index 100 유지.
- qa/ai-flat-browser.png 전체 화면 및 qa/ai-flat-comparison.png 전후 버튼 비교. 기존 레이아웃·자산·문구 유지. 표시 크기 292×120으로 정규화하여 비교.
- 빈 랜딩 이동·뒤로가기 확인. 프로덕션 빌드 및 런타임 검사 통과.
- final result: passed

## 후속 변경: 마스코트 버튼 (2026-10-02)

- 4주차 회의록의 분홍 헤드셋 마스코트 예시를 원본 그대로 public/assets/kiwoom/confession-mascot.png에 포함. CSS 원형 프레임으로 얼굴 중심 표시.
- 54px 터치 영역과 위치 유지. 옅은 분홍 단색 배경, 그림자 없음, z-index 100 확인. AI 고해성사 열기 접근성 이름 유지.
- 실제 브라우저에서 이미지 로드, 빈 랜딩 이동, 뒤로가기 검증. qa/ai-mascot-browser.png에 현재 화면 저장. 작은 프리뷰에서도 얼굴과 헤드셋 식별 가능.
- 프로덕션 빌드 및 보호된 런타임 28개 파일 무결성 검사 통과.
- final result: passed

## 후속 변경: AI 아이콘 → 마스코트 hover 페이드 (2026-10-02)

- 기본 흰 Sparkle AI 아이콘, hover 시 마스코트로 260ms opacity 크로스페이드. 두 레이어 상시 마운트하여 이미지 재로딩이나 레이아웃 이동 방지.
- hover 가능 기기에서만 hover 적용. 터치 누름/키보드 focus-visible에도 표시, prefers-reduced-motion에서는 전환 즉시 처리.
- 브라우저 실제 포인터 진입: hover true, icon opacity 0, mascot opacity 1 및 0.26s 확인. 포인터 이탈: icon 1, mascot 0 복원 확인.
- 클릭으로 빈 랜딩 이동과 뒤로가기 통과. 빌드와 런타임 무결성 검사 통과.
- qa/ai-fade-comparison.png: 왼쪽 기본, 오른쪽 hover. 위치, 크기, 플랫 스타일 유지.

## 후속 변경: AI 라벨과 배경 통일 (2026-10-02)

- 기본 상태를 16px 반짝임 아이콘 + AI 글자로 변경. hover/focus/active 시 옅은 배경으로 바뀌던 규칙을 제거하여 #c43b83 분홍색 유지.
- 실제 브라우저에서 AI 글자 식별과 hover 마스코트 표시 확인. hover 중 배경 rgb(196,59,131), mascot opacity 1 확인. 260ms 페이드 유지.
- qa/ai-label-comparison.png에 기본/hover 캡처. 빌드와 런타임 검사 통과.

## 후속 변경: 사용자 참고 이미지 기반 AI 아이콘 (2026-10-02)

- 별도 아이콘+텍스트 배치를 단일 벡터 아이콘으로 변경: 열린 라운드 사각 테두리, 내부 AI 글자, 우측 상단 큰/작은 반짝임. 분홍 원형 위 흰색으로 표시.
- 브라우저 축소 프리뷰에서 테두리와 AI 글자 식별 확인. qa/ai-reference-icon.png 및 ai-reference-icon-detail.png 저장.
- 기존 hover 크로스페이드와 마스코트, 위치, 클릭 동작 변경 없음. 빌드 및 런타임 무결성 검사 통과.

## 후속 변경: 아이콘 중심 보정과 회전 링 (2026-10-02)

- SVG viewBox 여백을 보정하고 34px로 조정. 브라우저에서 SVG 박스와 버튼의 가로/세로 중심 차이 모두 0px 확인.
- 1.5px 마스킹된 conic-gradient 링이 4초 주기로 회전. 두 차례 읽은 transform 행렬 변화로 실제 회전 확인. 본체/아이콘 고정, 그림자 없음.
- hover 마스코트 opacity 1 및 링 지속 확인. elementFromPoint로 버튼 클릭 영역 유지 확인. reduced-motion에서 링 정지 규칙 추가.
- 빌드와 런타임 무결성 검사 통과. qa/ai-orbit-comparison.png 기본/hover 캡처.

## 후속 변경: 사용자 제공 message-ai SVG (2026-10-02)

- 사용자 제공 SVG 경로, viewBox, stroke 설정을 그대로 적용. 기존 중앙 정렬과 34px 표시 크기, 마스코트 페이드 및 회전 테두리 유지.
- localhost:4174 실제 화면에서 새 아이콘 표시 확인. qa/ai-message-icon.png, ai-message-icon-detail.png 저장.
- 빌드와 런타임 무결성 검사 통과.

## 후속 변경: 리퀴드 글라스 표현 (2026-10-02)

- 최신 요청에 따라 기존 플랫 단색 버튼을 반투명 분홍/보라 틴트, 16px backdrop blur, 고정 반사광 및 부드러운 그림자로 변경.
- 실제 브라우저에서 유리 질감 표시, computed backdrop-filter blur(16px) saturate(1.6), 회전 링 애니메이션 확인. 기존 아이콘/마스코트 전환 규칙과 클릭 핸들러 유지.
- qa/ai-glass-default.png 및 ai-glass-detail.png 저장. 빌드와 런타임 검사 통과.

## 후속 변경: 마스코트 제거, hover 틴트 강화 (2026-10-02)

- 마스코트 DOM 및 전환 CSS 제거. AI 아이콘 상시 표시. hover/focus 시 #702044 틴트를 220ms 전환으로 적용하며, active는 더 어두운 #541633 사용.
- 실제 브라우저에서 hover true, background rgb(112,32,68), icon opacity 1 확인. 기본 상태는 투명 배경색, 마스코트 이미지 없음 확인.
- qa/ai-tint-comparison.png 기본/hover 비교. 리퀴드 글라스 반사광 및 회전 테두리 유지. 빌드와 런타임 검사 통과.


## Selected angel-monk landing — final QA (2026-10-02)

### Evidence and normalization
- Source visual truth: `qa/landing-selected-reference.png` (853×1844), approved angel-monk revision.
- Source asset: `public/assets/kiwoom/confession-sanctuary.png` (853×1844), generated from the selected reference with UI labels/controls removed and illustration retained.
- Implementation: `http://localhost:4174/`, `qa/landing-browser-final.png`, `qa/landing-screen-final.png`.
- Browser viewport 1400×1200; DOM screen verified 393×852 CSS pixels at scale 1. Full screenshot 1400×1200; app crop 393×852. Source proportionally normalized to 393×850. Pixel 10 also visually checked at 427×952.
- Full comparison: `qa/landing-comparison-final.png`; focused controls: `qa/landing-controls-comparison.png`.
- State: landing open, no selected topic, no sheet. Source omits OS chrome; implementation intentionally preserves runtime status/header safe area and home indicator. Artwork remains proportional and shifts down to accommodate native chrome. Capture antialiasing differs from raster source.

### Findings and iteration history
- [P2, resolved] Initial bottom navigation link was too close to the iPhone home indicator. Evidence `qa/landing-comparison-pass1.png`. Moved action group and motto up 3cqw (~12px), kept all actions accessible. Post-fix evidence in final and focused comparisons; no overlap.
- [P3] Noto Serif KR is a close available serif, not the exact image-generated brush lettering. Source illustration and parchment text are retained; live headline is editable. No clipping or unintended wraps.
- No remaining actionable P0/P1/P2 findings.

### Required fidelity surfaces
- Typography: local Noto Serif KR 700 for two-line title; Noto Sans KR for body and controls. Correct Korean copy, hierarchy, wrapping and readable touch targets. Fixed awkward dialogue quotation during implementation.
- Layout: full-width scene, large centered mascot, two topic buttons, caption, primary CTA and secondary records action preserved. Native status/header shifts are intentional. Screen does not horizontally overflow; lower controls clear system navigation. Header/back stays fixed while content uses MobileScroll.
- Colors: dark plum room, ivory/gold title, magenta primary action and subtle pink topic surfaces match the chosen direction. Existing account palette unchanged.
- Assets: actual generated monk/room image used at natural aspect ratio; no code-drawn substitute. Halo, wings, prayer beads, parchment message, candles and room details preserved. Icon library handles simple UI icons.
- Content: approved headline, subtitle, two confession options, motto, main CTA and records link implemented. Mock sample trades are clearly identified; no live data or AI inference claims.

### Functional checks
- Account launcher → landing → back to account; account state retained.
- Topic selection toggles and passes selected context to demo dialogue.
- Continue is disabled until a reason is chosen; chosen reason produces appropriate principle; save displays completion and a link back to that principle within the landing session.
- Example records list opens; selecting 새봄에너지 produces additional-purchase questions with selected trade name.
- Sheet close and return actions work. Accessible names, selected state, keyboard-visible outline and reduced-motion rules retained.
- Pixel 10 layout checked (`qa/landing-pixel-browser.png`). Console warning/error list empty during verification.
- `npm run build` and 28-file runtime integrity check passed. Vite emits only a nonblocking chunk-size warning. No protected runtime files modified.

### Limits / follow-up
- Demo dialogue uses choice buttons and predefined replies, not a live chatbot. Principles live only in component memory, reset on leaving landing or refresh. Later detailed user instructions can replace these demo interactions.
- Exact brush lettering and minor artwork/antialiasing differences are optional P3 polish, not blockers.

final result: passed

## Christian chapel and component entrance — 2026-10-02

- User direction: one religion (Christian angel/confession chapel), separate visual components including text, upward fade entrances.
- Created independent text-free chapel and transparent angel assets. Removed prayer beads and cross-legged monk pose; retained wings/halo and added a simple cross pendant.
- Split eight landing sections into React components; shared reveal animates each complete section 22px upward with opacity 0→1, duration 560ms, delays 0–780ms. All visible copy is HTML, including the speech balloon. Original background remains archived, unused.
- Browser verified entry in progress: heading opacity .887/translateY 2.48px, description .535/10.24px, later sections 0/22px; settled sections all opacity 1. Re-entry replays, topic selection leaves sections visible. Header remains static. CSS reduced-motion rule disables reveals.
- Verified AI launcher → landing → demo sheet → close → back → re-entry, and topic selection. No browser console errors/warnings. No overlap/clipping in iPhone preview. Screenshot: `qa/landing-christian-components.png`.
- `npm run build` passed TypeScript, runtime integrity (28 protected files), and Vite. Existing bundle-size advisory remains.

## Christian voice revision — 2026-10-02

- Updated landing title, description, greeting, topic labels, CTA, and every demo-sheet branch to modern respectful Korean centered on peace, confession, comfort, and renewed commitment.
- Removed archaic endings (~하겠소/~하시오/~사옵니다) and 그대 from app copy; behavior and component animation unchanged.
- Build and protected-runtime check passed; localhost:4174 responds HTTP 200. Live visual inspection was unavailable because the existing in-app browser's CDP focus command timed out twice. Preview-open request queued; no new screenshot claimed for this text revision.

## Purpose-led landing copy — 2026-10-02

- Preserved service name 투자 고해성사 and main heading. Description now states AI chat → reflection → personal investing criteria; mascot invites users to share reasons and find their own criteria.
- CTA: 나의 투자 돌아보기. Topics: 매수 타이밍이 고민돼요 / 추가 매수 기준이 궁금해요. Topic text reduced from 15.33px to 12.97px on iPhone, with smaller icons to keep two deliberate lines.
- Verified current iPhone preview in tab 2: both buttons clientWidth/scrollWidth 171/171 (no horizontal overflow), all new text visible, additional-buy topic opens matching dialogue and reason choices. Build/runtime integrity passed. Screenshot: qa/landing-purpose-copy.png.

## Topic focus animation regression fix — 2026-10-02

- Reproduced: click first topic, then second; previous topic's computed opacity became 0 and translateY 22px. `:focus-within { animation: none }` removed the entrance animation on focus, then restored/restarted it on blur.
- Removed only that focus-dependent animation override. Entrance keyframes, stagger, and reduced-motion behavior remain unchanged.
- Verified both click directions immediately after the click: both topics stayed opacity 1 / translateY 0. Tab focus away also kept both fully visible. Selection state updates correctly. Screenshot: `qa/landing-focus-fix.png`.
- Build and protected-runtime integrity check passed; existing Vite bundle-size advisory only.

## Full-screen chat, free input, simulated thinking — 2026-10-02

- Removed speech-bubble heart. Replaced chat BottomSheet with a full-screen upward-entering ConfessionChat; example-trade picker stays a sheet. Three suggestions populate an editable KeyboardTextarea. User/AI bubbles persist during the chat and accept follow-up messages.
- Added 500-character limit, whitespace rejection, IME-aware Enter submit / Shift+Enter newline, busy guard, and 2400ms cancellable demo response timer. Thinking status uses an orbit and staggered dots, with reduced-motion CSS. No AI API calls.
- Verified free Korean input → button submit → thinking status/disabled send → reply/principle; saved principle; Enter follow-up; suggested-answer path; blank input disabled; exit during loading and fresh chat after elapsed timer. Browser console warnings/errors: none.
- Inspected iPhone and Pixel keyboards: composer follows keyboard boundary; Pixel composer bottom 495.4 / keyboard top 496.1 viewport px. Fixed a focus-scroll issue where the phone canvas scrolled 339px by using app-scoped overflow:clip while chat is present. Phone canvas now stays scrollTop 0 and its header stays in place. Runtime files unchanged.
- Final iPhone screenshot: qa/chat-fullscreen.png. Main/header/composer clientWidth and scrollWidth are 393/393; no horizontal overflow. Build and integrity check (28 protected files) passed; existing chunk-size advisory only.


## Keyboard animation and focus repair — 2026-10-03

- Reproduced keyboard tap hiding the dock and blurring the textarea. Pointerdown also switched to zero-duration drag mode before any movement, interrupting opening animation.
- Authorized runtime change limited to Keyboard.tsx: prevent default focus transfer for dock gestures, apply 6px drag slop, reset cancelled gestures, replace independent Motion animation with matching 260ms CSS transform transition and reduced-motion support. Send pointerdown preserves focus until click; Escape dismisses.
- Browser verified iPhone tap keeps visible=true and textarea active; downward swipe closes; rapid open/Escape/open followed by one click sends exactly one message and closes. Pixel tap also stays open, composer bottom 495.4px vs keyboard top 496.1px, screen scrollTop 0; send closes and enters thinking state. Existing draft text survived keyboard dismissal.
- TypeScript passed. After browser validation, updated only Keyboard.tsx lock hash; all other 27 protected files unchanged.
- Final build/runtime integrity passed (existing bundle-size advisory only). Screenshot: qa/keyboard-animation-fixed.png.

## Back navigation interaction repair — 2026-10-03

- Reproduced through example trade → chat → focus input → back: phone canvas scrollTop became 89.5px and landing entrance elements reset to opacity 0. Original stalled browser tab could not be inspected; reproduction used a fresh preview.
- Keep the landing mounted with visibility:hidden plus inert/aria-hidden while chatting. Restore header/launcher focus using preventScroll. Apply app-scoped canvas overflow:clip throughout navigation rather than only while chat is mounted. No protected runtime changes in this repair.
- Verified trade → chat with keyboard → back: canvas scrollTop 0, all nine reveal elements opacity 1 immediately, body pointer-events auto, zero sheet overlays. Clicking the opposite topic changed selection immediately. Also verified direct chat input/send → back → account → account menu click → AI re-entry.
- Screenshot: qa/back-navigation-fixed.png. Build and protected-runtime check passed; existing bundle-size advisory only.
