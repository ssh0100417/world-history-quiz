# 모바일 실행용 Netlify 배포 절차

## 현재 권장 방식

권장 방식은 Netlify GitHub 연결 배포입니다.

이유:

- 사용자는 PC에 Node/npm을 설치하지 않아도 됩니다.
- Netlify가 GitHub 저장소를 받아 `npm run build`를 실행합니다.
- 배포 URL이 고정되어 모바일에서 북마크하거나 홈 화면에 추가하기 쉽습니다.
- 이 프로젝트에는 PWA manifest와 service worker가 포함되어 있어 모바일 홈 화면 추가와 기본 캐시 사용이 가능합니다.

## 1. GitHub 저장소 준비

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더의 파일 전체를 저장소 루트에 업로드합니다.
3. 반드시 저장소 루트에 아래 파일들이 있어야 합니다.

```text
package.json
index.html
netlify.toml
src/App.tsx
src/main.tsx
src/index.css
public/manifest.webmanifest
public/sw.js
public/icon.svg
```

## 2. Netlify에서 GitHub 저장소 연결

1. Netlify에 로그인합니다.
2. Dashboard에서 `Add new project`를 선택합니다.
3. `Import an existing project`를 선택합니다.
4. GitHub를 선택하고 위 저장소를 연결합니다.
5. Build settings가 아래와 같은지 확인합니다.

```text
Build command: npm run build
Publish directory: dist
```

이 값은 `netlify.toml`에도 이미 들어 있습니다.

## 3. 배포 후 모바일에서 실행

1. Netlify 배포가 성공하면 `https://...netlify.app` 주소가 생성됩니다.
2. 모바일 브라우저에서 해당 주소로 접속합니다.
3. iPhone Safari에서는 공유 버튼을 누른 뒤 `홈 화면에 추가`를 선택합니다.
4. Android Chrome에서는 메뉴 버튼을 누른 뒤 `홈 화면에 추가` 또는 `앱 설치`를 선택합니다.
5. 처음 한 번 접속한 뒤에는 기본 캐시가 저장되어 네트워크가 불안정해도 앱 shell은 열릴 수 있습니다.

## 4. 업데이트 절차

문항을 수정한 뒤에는 GitHub 저장소에 변경사항을 올리면 Netlify가 자동으로 다시 배포합니다.

## 현재 검증 상태

- 문항 병합 및 수량 검증: 완료
- V0: 75문항
- V3: 105문항
- V4: 105문항
- `npm run build`: 현재 Codex 환경에 npm이 없어 미검증
