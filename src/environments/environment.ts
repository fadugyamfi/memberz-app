// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'ENTER_YOUR_API_KEY',
    authDomain: 'ENTER_YOUR_AUTH_DOMAIN',
    databaseURL: 'ENTER_YOUR_DATABASE_URL',
    projectId: 'ENTER_YOUR_PROJECT_ID',
    storageBucket: 'ENTER_YOUR_STORAGE_BUCKET',
    messagingSenderId: 'ENTER_YOUR_ID',
    appId: 'ENTER_YOUR_API_ID'
  },
  cakeapp: {
    url: 'http://localhost/memberz/api'
  },
  api: {
    url: 'http://api.memberz.test/api',
    // url: 'http://192.168.100.6/memberz-api/public/api'
    // url: 'http://localhost:8000/api'
  },
  slydepay: {
    mode: 'mock',
    emailOrMobileNumber: 'info@matrixdesignsgh.com',
    merchantKey: '1429300048036'
  },
  tawkto: {
    id: '5649aa64f3f36c356bb98bd4'
  },
  tinymce: {
    apiKey: "f421hc0i4wju0e1hq26rppbvgw6b1oqfqqc7nfnvb9hmugib"
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
