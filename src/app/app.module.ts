import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrHelper } from './shared/helpers/toastr';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { IConfig } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientListComponent } from './views/clients/client-list/client-list.component';
import { ClientDetailsComponent } from './views/clients/client-details/client-details.component';
import { NewClientComponent } from './views/clients/new-client/new-client.component';
import { LoginComponent } from './views/login/login.component';
import { AuthorizeGuard } from './shared/security/authorize-guard';
import { LoaderComponent } from './shared/helpers/loader/loader.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CatalogDetailsComponent } from './views/catalogs/catalog-details/catalog-details.component';
import { CatalogListComponent } from './views/catalogs/catalog-list/catalog-list.component';
import { NewCatalogComponent } from './views/catalogs/new-catalog/new-catalog.component';
import { SaleDetailsComponent } from './views/sales/sale-details/sale-details.component';
import { SaleListComponent } from './views/sales/sale-list/sale-list.component';
import { NewSaleComponent } from './views/sales/new-sale/new-sale.component';
import { ReportDetailsComponent } from './views/reports/report-details/report-details.component';
import { ReportListComponent } from './views/reports/report-list/report-list.component';
import { NewReportComponent } from './views/reports/new-report/new-report.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
registerLocaleData(localePt)
@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientDetailsComponent,
    NewClientComponent,
    LoginComponent,
    NavbarComponent,
    LoaderComponent,
    CatalogDetailsComponent,
    CatalogListComponent,
    NewCatalogComponent,
    SaleDetailsComponent,
    SaleListComponent,
    NewSaleComponent,
    ReportDetailsComponent,
    ReportListComponent,
    NewReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    DpDatePickerModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxMaskModule.forRoot(options),
    NgSelectModule
  ],
  providers: [
    AuthorizeGuard,
    ToastrHelper,
    ToastrService,
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
