// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDaOS3eTVAJB5mIfIspOS7xQYBeEv_cIhQ",
    /*apiKey: "TAIzaSyDaOS3eTVAJB5mIfIspOS7xQYBeEv_cIhQ",*/
    authDomain: "restaurante-bd70c.firebaseapp.com",
    databaseURL: "https://restaurante-bd70c-default-rtdb.firebaseio.com", // Muy importante para Realtime Database
    projectId: "restaurante-bd70c",
    storageBucket: "restaurante-bd70c.firebasestorage.app",
    messagingSenderId: "89230909549",
    /*appId: "1:89230909549:web:3492fef72ef3ed10885f64",*/
    appId: "1:89230909549:web:b3abdfb67cb2c571885f64",
    measurementId: "G-1CD4W5Q1HB"
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
