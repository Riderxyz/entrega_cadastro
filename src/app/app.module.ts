import ptBr from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
// Firebase
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { registerLocaleData } from '@angular/common';
registerLocaleData(ptBr);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        localCache: persistentLocalCache(),
      })
    ),
  ],
  providers: [provideHttpClient(), { provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
