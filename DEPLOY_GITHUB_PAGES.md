# GitHub Pages 배포 절차

이 문서는 Netlify 크레딧을 사용하지 않고 기존 세계사 문제 출제 프로그램을 GitHub Pages로 배포하기 위한 절차입니다.

## 1. 현재 저장소 기준

```text
Repository: ssh0100417/world-history-quiz
Pages URL: https://ssh0100417.github.io/world-history-quiz/
Build output: dist
Workflow: .github/workflows/deploy-pages.yml
Deploy branch: gh-pages
```

## 2. dist를 직접 올리지 않는 이유

이 프로젝트는 Vite React 앱입니다. 원본 소스는 `src`, `public`, `index.html`, `vite.config.ts` 등에 있고, 실제 배포 파일은 다음 명령으로 만들어지는 `dist` 폴더입니다.

```powershell
npm install
npm run build
```

하지만 로컬 PC에 Node/npm이 없거나 환경이 다르면 빌드가 어려울 수 있습니다. 그래서 GitHub Actions가 GitHub 서버에서 다음 순서로 자동 처리하게 설정했습니다.

```text
main 브랜치 push
-> GitHub Actions 실행
-> npm install
-> npm run build
-> dist 생성
-> dist/.nojekyll 생성
-> dist 내용을 gh-pages 브랜치에 강제 발행
-> GitHub Pages가 gh-pages 브랜치의 루트 폴더를 배포
```

따라서 `dist` 폴더를 직접 커밋하지 않습니다.

## 3. GitHub에서 반드시 설정할 것

GitHub 저장소에서 아래 설정을 확인합니다.

```text
Settings
-> Pages
-> Build and deployment
-> Source
-> Deploy from a branch
-> Branch: gh-pages
-> Folder: /(root)
```

`Static HTML` 또는 `GitHub Pages Jekyll`의 `Configure` 버튼은 누르지 않습니다.

## 4. 이전 오류 처리

타임라인 앱에서 다음 오류가 발생한 적이 있습니다.

```text
Get Pages site failed
HttpError: Not Found
Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

기존 문제 출제 앱의 워크플로에서는 이 오류가 발생한 `actions/configure-pages` 단계를 사용하지 않습니다.
또한 `actions/deploy-pages` 단계도 사용하지 않습니다.

현재 워크플로는 아래 방식으로 `dist`를 배포합니다.

```yaml
- name: Publish dist to gh-pages branch
  run: |
    cd dist
    git init
    git checkout -b gh-pages
    git add -A
    git commit -m "Deploy ${GITHUB_SHA}"
    git push --force "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" gh-pages
```

이 방식은 Pages API로 배포를 생성하지 않으므로 `Get Pages site failed` 오류 경로를 피합니다.
대신 GitHub Pages 화면에서 `gh-pages` 브랜치를 배포 대상으로 선택해야 합니다.

1. `Actions`에서 `Build dist for GitHub Pages`가 성공했는지 확인합니다.
2. `Code -> Branches` 또는 브랜치 선택 메뉴에서 `gh-pages` 브랜치가 생겼는지 확인합니다.
3. `Settings -> Pages`에서 `Source`가 `Deploy from a branch`인지 확인합니다.
4. `Branch`를 `gh-pages`, 폴더를 `/(root)`로 설정합니다.
5. Save를 누릅니다.
6. Pages 배포가 끝날 때까지 기다립니다.

이전 API 방식 워크플로가 실패한 경우 다음 순서로 처리합니다.

1. `Settings -> Pages`에서 `Source`를 `Deploy from a branch`로 바꿉니다.
2. 설정 화면을 새로고침해도 값이 유지되는지 확인합니다.
3. `Actions` 탭으로 이동합니다.
4. 최신 `Build dist for GitHub Pages` 실행을 엽니다.
5. `Re-run jobs` 또는 `Re-run all jobs`를 실행합니다.

## 5. 모바일 최신 반영 확인

배포 성공 후 모바일에서 아래 주소로 접속합니다.

```text
https://ssh0100417.github.io/world-history-quiz/
```

이전 화면이 계속 보이면 브라우저 캐시가 남아 있을 수 있으므로 쿼리 문자열을 붙여 접속합니다.

```text
https://ssh0100417.github.io/world-history-quiz/?v=latest
```

또는 최신 커밋 해시를 붙입니다.

```text
https://ssh0100417.github.io/world-history-quiz/?v=6963916
```

## 6. 현재 캐시 대응 상태

이 앱은 기존 모바일 캐시 문제를 줄이기 위해 다음 파일이 이미 캐시 삭제 방향으로 설정되어 있습니다.

```text
src/main.tsx
public/sw.js
netlify.toml
```

`src/main.tsx`는 기존 서비스워커 등록을 해제하고 Cache Storage를 삭제합니다. `public/sw.js`도 활성화 시 캐시를 삭제하고 자기 자신을 등록 해제합니다.
