# 세계사 마스터 V4 업데이트

이 패키지는 첨부된 기존 React 코드에 새 V4 문항을 병합한 Vite React 프로젝트입니다.

## 병합 결과

- V0 문항: 75개
- V3 문항: 105개
- V4 문항: 105개
- V0 12주차 추가 문항: 15개
- V0 9주차 추가 후 최종: 15개
- V0 10주차 추가 후 최종: 15개
- V0 11주차 추가 후 최종: 15개
- V0 13주차 추가 후 최종: 15개
- V4 10주차 누락 복구: `V4-W10-004`

세부 수량은 `question-count-report.json`을 확인하세요.
V0 9, 10, 11, 13주차 병합 내역은 `v0-weeks-9-10-11-13-merge-report.json`을 확인하세요.
V0 13주차 단독 병합 내역은 `v0-week13-merge-report.json`을 확인하세요.
V3 ID 일치 문항 교체 내역은 `v3-id-matched-replacement-report.json`을 확인하세요.

## 로컬 실행

```powershell
npm install
npm run dev
```

## GitHub Pages 배포 방식

Netlify 크레딧을 사용하지 않기 위해 GitHub Pages 배포 워크플로를 추가했습니다.
이 저장소는 Vite 앱이므로 GitHub Pages 주소의 하위 경로에 맞춰 `vite.config.ts`의 `base`를 `/world-history-quiz/`로 설정합니다.

GitHub 저장소의 `Settings -> Pages`에서 `Source`를 `GitHub Actions`로 설정한 뒤, `main` 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 자동으로 실행됩니다.

배포 과정은 다음과 같습니다.

```text
main push
-> npm install
-> npm run build
-> dist 폴더 생성
-> dist를 GitHub Pages artifact로 업로드
-> https://ssh0100417.github.io/world-history-quiz/ 에 배포
```

이전 타임라인 앱에서 발생했던 `actions/configure-pages`의 `Get Pages site failed` 오류를 피하기 위해, 이 워크플로는 `actions/configure-pages` 단계를 사용하지 않고 `actions/upload-pages-artifact`와 `actions/deploy-pages`만 사용합니다.

모바일에서 이전 화면이 보이면 아래처럼 커밋 해시나 임시 쿼리를 붙여 새로 접속하세요.

```text
https://ssh0100417.github.io/world-history-quiz/?v=latest
```

## 기존 Netlify 배포 방식

지하철에서 모바일로 간편하게 풀기 위한 추천 방식은 Netlify GitHub 연결 배포입니다.
이 방식은 Netlify가 클라우드에서 `npm run build`를 실행하고 `dist`를 배포하므로, 로컬 PC에 Node/npm을 직접 설치하지 않아도 됩니다.

수동 Drag and Drop 배포를 할 경우에는 먼저 로컬에서 다음 명령으로 `dist`를 만든 뒤 `dist` 폴더를 업로드해야 합니다.

```powershell
npm install
npm run build
```

이 패키지에는 모바일 홈 화면 추가와 기본 오프라인 캐시를 위한 PWA 파일이 포함되어 있습니다.
