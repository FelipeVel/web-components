import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material modules

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

// services

import { ConfiguracionService } from './services/configuracion.service';
import { NotioasService } from './services/notioas.service';
import { ImplicitAutenticationService } from './services/implicit_autentication.service';
import { MenuAplicacionesService } from './services/menuAplicaciones.service';

// local Components

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuAplicacionesComponent } from './menu-aplicaciones/menu-aplicaciones.component';
import { NotioasComponent } from './notioas/notioas.component';

// end material modules
@NgModule({
  declarations: [
    DynamicFormComponent,
    HeaderComponent,
    FooterComponent,
    MenuAplicacionesComponent,
    NotioasComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    // material modules
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    // end material modules
  ],
  entryComponents: [DynamicFormComponent],
  providers: [
    ConfiguracionService,
    NotioasService,
    ImplicitAutenticationService,
    MenuAplicacionesService,
  ],
  exports: [],
  bootstrap: []
})
export class AppModule {
  constructor(
    private injector: Injector
  ) {
    const dynamicForm = createCustomElement(DynamicFormComponent, { injector });
    customElements.define('ng-uui-dynamic-form', dynamicForm);

    const header = createCustomElement(HeaderComponent, { injector });
    customElements.define('ng-uui-header', header);

    const footer = createCustomElement(FooterComponent, { injector });
    customElements.define('ng-uui-footer', footer);
  }
  // tslint:disable-next-line: typedef
  ngDoBootstrap() { }
}
