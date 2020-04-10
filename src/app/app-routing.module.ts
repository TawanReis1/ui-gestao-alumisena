import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from './shared/security/authorize-guard';

import { NavbarComponent } from './shared/navbar/navbar.component'
import { LoginComponent } from './views/login/login.component';

import { ClientListComponent } from './views/clients/client-list/client-list.component';
import { ClientDetailsComponent } from './views/clients/client-details/client-details.component';
import { NewClientComponent } from './views/clients/new-client/new-client.component';

import { CatalogListComponent } from './views/catalogs/catalog-list/catalog-list.component';
import { CatalogDetailsComponent } from './views/catalogs/catalog-details/catalog-details.component';
import { NewCatalogComponent } from './views/catalogs/new-catalog/new-catalog.component';

import { QuoteListComponent } from './views/quotes/quote-list/quote-list.component';
import { QuoteDetailsComponent } from './views/quotes/quote-details/quote-details.component';
import { NewQuoteComponent } from './views/quotes/new-quote/new-quote.component';

import { ReportListComponent } from './views/reports/report-list/report-list.component';
import { ReportDetailsComponent } from './views/reports/report-details/report-details.component';
import { NewReportComponent } from './views/reports/new-report/new-report.component';

const routes: Routes = [
  {
    path: '', component: NavbarComponent, canActivate: [AuthorizeGuard],
    children: [
      { path: 'clients', component: ClientListComponent },
      { path: 'clients/:id', component: ClientDetailsComponent },
      { path: 'clients/new/client', component: NewClientComponent },

      { path: 'catalogs', component: CatalogListComponent },
      { path: 'catalogs/:id', component: CatalogDetailsComponent },
      { path: 'catalogs/new/catalog', component: NewCatalogComponent },

      { path: 'quotes', component: QuoteListComponent },
      { path: 'quotes/:id', component: QuoteDetailsComponent },
      { path: 'quotes/new/quote', component: NewQuoteComponent },

      { path: 'reports', component: ReportListComponent },
      { path: 'reports/:id', component: ReportDetailsComponent },
      { path: 'reports/new/report', component: NewReportComponent },
    ]
  },
  {
    path: '', component: NavbarComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
