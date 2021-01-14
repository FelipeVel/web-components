import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// services
import { ConfiguracionService } from './services/configuracion.service';
import { NotioasService } from './services/notioas.service';
import { ImplicitAutenticationService } from './services/implicit_autentication.service';
import { MenuAplicacionesService } from './services/menuAplicaciones.service';
import { MenuService } from './services/menu.service'

//ngrx
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './@core/store/rootReducer';
import { ListService } from './@core/store/services/list.service';

// local Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuAplicacionesComponent } from './menu-aplicaciones/menu-aplicaciones.component';
import { NotioasComponent } from './notioas/notioas.component';
import { LoadComponent } from './load/load.component';
import { MenuComponent } from './menu/menu.component';
import { AppComponent } from './app.component';
import { TercerosFormComponent } from './terceros-form/terceros-form.component';
import { InformacionPersonalComponent } from './terceros-form/informacion-personal/informacion-personal.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { OasComponent } from './oas/oas.component';

// material modules
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { InformacionCaracteristicaComponent } from './terceros-form/informacion-caracteristica/informacion-caracteristica.component';



// end material modules
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuAplicacionesComponent,
    NotioasComponent,
    LoadComponent,
    MenuComponent,
    SidebarComponent,
    LoginComponent,
    OasComponent,
    TercerosFormComponent,
    InformacionPersonalComponent,
    InformacionCaracteristicaComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(rootReducer),
    //material modules
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule
    
    // end material modules
  ],
  entryComponents: [],
  providers: [
    ConfiguracionService,
    NotioasService,
    ImplicitAutenticationService,
    MenuAplicacionesService,
    MenuService,
    MatDatepickerModule,
    ListService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },// useValue: 'co-CO'
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private injector: Injector
  ) {

    const header = createCustomElement(HeaderComponent, { injector });
    customElements.define('ng-uui-header', header);

    const oas = createCustomElement(OasComponent, { injector });
    customElements.define('ng-uui-oas', oas);

    const footer = createCustomElement(FooterComponent, { injector });
    customElements.define('ng-uui-footer', footer);

    /*const terceros = createCustomElement(TercerosFormComponent, { injector });
    customElements.define('ng-uui-terceros-form', terceros);*/
  }
  ngDoBootstrap() { }
}
