// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: 'AIzaSyCHAgAFcoOZqNjQMjh1UXzeY9gar5cBKQo',
    authDomain: 'fir-angular-5b571.firebaseapp.com',
    projectId: 'fir-angular-5b571',
    storageBucket: 'fir-angular-5b571.appspot.com',
    messagingSenderId: '498755747298',
    appId: '1:498755747298:web:c89473950575929405cdbb'
  },
  api: {

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
