# @skyux-sdk/angular-builders

## Local setup

- Build with `npm run build`
- Copy the `dist` folder to an Angular CLI generated SPA's `node_modules/@skyux-sdk/angular-builders`.
- Open `angular.json` and:
  - Replace the "build" architect builder with `@skyux-sdk/angular-builders:browser`.
  - Replace the "serve" architect builder with `@skyux-sdk/angular-builders:dev-server`.
- Open `app.component.ts` and rename the `selector` to `'sky-pages-app'`.
- Run `ng serve`.