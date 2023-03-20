# Introduction
 - 사장님프로그램 모바일 버전

## API URL 환경(mode)별 설정방법
 - 기본적으로 각 환경의 환경변수는 프로젝트 루트의 .env.[mode] 파일에 설정되어 있음
 - 로컬 환경은 Cross Origin 이슈로 프록시 설정을 해야하는데 .env.[mode].local 파일을 만들어서 Proxy URL 을 등록해야 함
 - 관련 설정은 vite.config.js 및 nginx/[mode].conf 파일 참고
 - `.env.development.local` 예시
   ```
   GRAPHQL_PROXY_HOST=https://dev-api-presenter.gorelas.com
   S9_PROXY_HOST=http://barogo.s9juso.co.kr
   ```

## Project Setup
  - 패키지 dependency 문제로 일반 npm install로 설치할 경우 제대로 설치가 되지 않음
```sh
yarn install
```

## Compile and Hot-Reload for Development
- qc 모드로 serve 실행후 http://localhost:5100 동작 확인 가능
- 참고로 http://127.0.0.1:5100 접속시 화면은 보이지만 API 호출이 불가능하여 기능 확인 불가
```sh
## development(or local) API
yarn serve

## qc API
yarn serve:qc
```

## Compile and Minify for Production

```sh
## production 빌드시 (npm run build --mode production)
yarn build --mode qc
```

## Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
