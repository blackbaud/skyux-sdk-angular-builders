# @skyux-sdk/angular-builders

## Local setup

- Build with `npm run build`
- Create a new Angular SPA with `ng new`.
- Open `angular.json` and:
  - Replace the "build" architect builder with `../skyux-sdk-angular-builders/dist:browser`.
  - Replace the "serve" architect builder with `../skyux-sdk-angular-builders/dist:dev-server`.
- Open `app.component.ts` and rename the `selector` to `'sky-pages-app'`.
- Run `ng serve`.