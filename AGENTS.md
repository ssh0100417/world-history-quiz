✅ 행동강령 점검 완료 (2026-04-07 기준)

# 세계사 문제 출제 프로그램 작업 지침

## 0. 적용 범위

- 이 지침은 세계사 문제 출제 프로그램 관련 모든 작업에 우선 적용한다.
- 세계사 문제 출제 프로그램 작업은 반드시 아래 경로에서 진행한다.

```text
C:\Users\pc\Documents\Codex\2026-06-01\codex-react\world-history-quiz
```

- 다른 경로, 새 폴더, 새 React 프로젝트, 새 Git repository를 만들지 않는다.
- 작업 전 현재 경로가 위 repo인지 확인한다.
- 작업 전 `git status --short`와 `git remote -v`를 확인한다.
- 현재 기존 GitHub 원격 저장소는 다음 주소다.

```text
https://github.com/ssh0100417/world-history-quiz.git
```

## 1. 응답 원칙

- 모든 응답은 반드시 다음 문구로 시작한다.

```text
✅ 행동강령 점검 완료 (2026-04-07 기준)
```

- 확실한 사실만 말한다.
- 모르는 것은 모른다고 말한다.
- 출처가 있으면 반드시 밝힌다.
- 출처가 없거나 확실하지 않으면 `이 정보는 불확실합니다`라고 표시한다.
- 추론이나 일반화가 들어가면 `추측입니다`라고 표시한다.
- 질문이 모호하면 `추가 정보가 필요합니다`라고 요청한다.
- 파일을 완전히 읽지 못했으면 그 사실을 먼저 말한다.
- 빌드, 테스트, 배포 성공 여부는 실제 실행 결과가 있을 때만 성공했다고 말한다.
- 수식이 필요한 답변에서는 사용자의 수식 출력 행동강령을 따른다.

## 2. 프로젝트 구조 원칙

- 앱의 핵심 코드는 기존 단일 React 파일인 `src/App.tsx`를 기준으로 수정한다.
- 기존 기능을 삭제하지 않는다.
- 사용자가 명시적으로 요청하지 않는 한 새 프로젝트를 만들지 않는다.
- 사용자가 명시적으로 요청하지 않는 한 기존 repository를 바꾸지 않는다.
- 문제 데이터, UI, 출제 필터, 결과 화면, 오답 노트 기능을 변경할 때는 기존 앱 구조를 먼저 확인한다.
- 세계사 문제 출제 프로그램에서 수정할 가능성이 높은 파일은 다음이다.

```text
src/App.tsx
src/main.tsx
public/sw.js
netlify.toml
question-count-report.json
```

## 3. 현재 문제은행 기준

2026-06-02 기준 현재 요구사항 반영 상태는 다음과 같다.

- V0는 유지한다.
- V3는 이전 병합 작업 결과를 유지한 버전이다.
- V4는 새로 업로드된 105문항을 별도 출제 버전으로 유지한다.
- V5는 기말 답지 PDF에서 현재 문제은행 범위와 겹치는 항목을 주차별로 재구성한 24문항을 별도 출제 버전으로 유지한다.
- 최종 출제 버전 선택 UI에는 `V0`, `V3`, `V4`, `V5`가 있어야 한다.
- `V3`를 선택하면 병합된 V3 전체 문항이 출제 후보에 포함되어야 한다.
- `V4`를 선택하면 `V4_QUESTION_BANK` 전체 문항이 출제 후보에 포함되어야 한다.
- `V5`를 선택하면 `V5_QUESTION_BANK` 전체 문항이 출제 후보에 포함되어야 한다.

현재 검증된 문항 수는 다음과 같다.

```text
V0: 90문항
V3: 210문항
V4: 105문항
V5: 24문항
V0 주차별 문항 수: 9~14주차 각각 15문항
V3 주차별 문항 수: 9~15주차 각각 30문항
V4 주차별 문항 수: 9~15주차 각각 15문항
V5 주차별 문항 수: 9주차 1문항, 10주차 1문항, 11주차 2문항, 12주차 18문항, 13주차 2문항
```

## 4. V3/V4 관리 규칙

- 기존 V3 문제와 이전 V3/V4 병합 결과는 유지한다.
- 새로 업로드된 V4 문제는 `version: "V4"` 상태로 `V4_QUESTION_BANK`에 별도 유지한다.
- 사용자가 명시적으로 V3/V4 병합을 다시 요청하지 않는 한 V4를 V3로 변환하지 않는다.
- V4 또는 V5를 추가할 때는 `QUESTION_BANK`, `VERSION_OPTIONS`, `selectedVersions` 기본값에 해당 버전이 반영되어야 한다.
- 중복 검사가 필요한 작업에서는 완전히 중복되는 문제만 제외한다.
- 비슷한 주제이거나 같은 사건을 다룬다는 이유만으로 중복 처리하지 않는다.

완전 중복 판정 기준은 다음을 모두 만족하는 경우다.

- `question` 문자열이 실질적으로 동일하다.
- `options` 배열 내용과 순서가 동일하다.
- `answer` 값이 동일하다.
- 핵심 출제 의도와 정답 근거가 동일하다.

V3 병합을 명시적으로 다시 수행할 때의 ID 규칙은 다음과 같다.

```text
V3-W09-001
V3-W09-002
...
V3-W15-030
```

- 주차 번호는 두 자리로 유지한다.
- 각 주차별 번호는 `001`부터 다시 시작한다.
- V3로 병합한 문제의 `version`은 반드시 `V3`이어야 한다.
- 별도 V4 버전으로 추가한 문제의 `id`와 `version`은 `V4` 형식을 유지한다.
- `week`, `source`, `type`, `difficulty`, `question`, `options`, `answer`, `explanation`, `wrongExplanation`, `keyword`, `tags`, `isActive`는 원칙적으로 유지한다.
- `answer` 값과 `options` 순서를 임의로 바꾸지 않는다.

## 5. 모바일 배포와 Netlify 주의사항

- 이 앱은 모바일에서 Netlify URL로 접속해 문제를 풀기 위한 앱이다.
- Canvas 링크가 생성되지 않는 문제를 해결하기 위해 Netlify 배포 방식을 사용한다.
- Netlify 배포 관련 설정은 `netlify.toml`을 확인한다.
- 모바일에서 이전 화면이 계속 보이면 `App.tsx` 문제가 아니라 서비스워커 캐시 문제일 수 있다.
- 서비스워커 관련 파일은 다음을 반드시 함께 확인한다.

```text
src/main.tsx
public/sw.js
netlify.toml
```

- `public/sw.js`가 `caches.match`, `cache.put`, `cache.addAll` 방식으로 이전 JS를 cache-first 반환하면 새 배포가 반영되지 않을 수 있다.
- 이런 경우 `public/sw.js`는 기존 캐시 삭제 및 unregister 방식이어야 한다.
- `src/main.tsx`는 서비스워커를 새로 등록하지 않고 기존 등록과 캐시를 삭제하는 방향이어야 한다.
- `netlify.toml`에는 `/`, `/index.html`, `/manifest.webmanifest`, `/sw.js`에 대한 캐시 헤더를 확인한다.

## 6. 1초 렌더링 및 화면 깜빡임 방지

- 앱이 1초마다 다시 렌더링되거나 아래에서 위로 살짝 올라오는 듯한 효과가 보이면 다음을 먼저 검색한다.

```text
setInterval
setTimeout
requestAnimationFrame
TimerDisplay
timeElapsed
setTimeElapsed
useEffect
animate-
transition
duration-
ease-
translate-
scale-
keyframes
animation
```

- 실시간 타이머 표시를 위해 `setInterval`을 사용하면 화면이 매초 갱신될 수 있다.
- 문제 풀이 화면에서는 실시간 증가 타이머 대신 고정 문구를 사용한다.
- 결과 화면의 소요 시간은 시험 종료 시점에 한 번만 계산한다.
- `transition-all`, `animate-fade-in`, `duration-500`, `ease-out`, `hover:-translate-y-1`, `hover:scale-*` 등 화면 이동이나 깜빡임을 유발할 수 있는 클래스는 사용하지 않는다.

## 7. Git 작업 원칙

- 사용자가 커밋을 요청하기 전에는 임의로 커밋하지 않는다.
- 커밋 전에는 반드시 다음을 확인한다.

```powershell
git status --short
git diff --check
```

- Netlify 모바일 캐시 수정이 포함된 경우 최소 커밋 후보는 다음이다.

```text
src/App.tsx
src/main.tsx
public/sw.js
netlify.toml
question-count-report.json
```

- 문제은행이나 버전 선택 UI만 수정한 경우 기본 커밋 후보는 다음이다.

```text
src/App.tsx
question-count-report.json
```

- 전체 산출물 폴더나 zip 파일을 기존 repo에 잘못 stage하지 않는다.
- `outputs/world-history-quiz-v4-updated/...` 경로의 파일을 기존 repo에 그대로 올리지 않는다.

## 8. 검증 원칙

수정 후 가능한 범위에서 다음을 검증한다.

- `V0_QUESTION_BANK` 배열 파싱
- `V3_QUESTION_BANK` 배열 파싱
- `V4_QUESTION_BANK` 배열 파싱
- `V5_QUESTION_BANK` 배열 파싱
- V4 문항 수와 주차별 문항 수 확인
- V5 문항 수와 주차별 문항 수 확인
- V3 ID가 주차별로 연속되는지 확인
- 중복 ID가 없는지 확인
- `VERSION_OPTIONS`에 `V4`와 `V5`가 포함되는지 확인
- `selectedVersions` 기본값에 `V4`와 `V5`가 포함되는지 확인
- `QUESTION_BANK`가 `V0 + V3 + V4 + V5`를 포함하는지 확인
- `git diff --check` 통과 여부 확인
- `npm run build`는 실제 `npm`이 사용 가능한 환경에서만 성공 여부를 말한다.

현재 작업 환경에서는 `npm` 명령이 인식되지 않을 수 있다. 이 경우 빌드 미검증 사실을 명확히 말한다.

## 9. 사용자에게 보고할 때

- 무엇을 실제로 수정했는지 파일 경로와 함께 말한다.
- 무엇을 실제로 검증했는지 명령 결과 기준으로 말한다.
- 빌드나 Netlify 배포를 직접 확인하지 못했으면 확인하지 못했다고 말한다.
- 사용자가 커밋 방법을 묻는 경우, 현재 repo 기준으로 필요한 파일만 `git add`하도록 안내한다.
