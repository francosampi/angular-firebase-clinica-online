import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './general/home/home.module';

import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environments';
import { NavbarModule } from './general/navbar/navbar.module';
import { FooterModule } from './general/footer/footer.module';
import { CapitalizacionDirective } from './directives/capitalizacion.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CapitalizacionDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    NavbarModule,
    FooterModule,
    AngularFireAuthModule,
    NgbModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
