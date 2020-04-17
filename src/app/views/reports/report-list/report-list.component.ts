import { Component, OnInit } from '@angular/core';
import { Report } from '../../../shared/classes/report';
import { ReportService } from '../../../shared/services/report.service';
import { Router } from '@angular/router';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  product: Report = new Report();
  isLoading: Boolean;
  allReports: any = {
    data: [],
    meta: {}
  };
  page: Number = 1;
  filterFields: any = {};

  constructor(private router: Router, private reportService: ReportService, private toastr: ToastrHelper) { }

  ngOnInit() {
    this.getReports();
  }

  async getReports(filterFields = {}) {
    try {
      this.isLoading = true;
      if (Object.keys(filterFields).length === 0) {
        filterFields = { page: this.page, limit: 10 }
      }

      let response = await this.reportService.get(filterFields);

      this.allReports.data = response['data'];
      this.allReports.meta = response['meta'];

      this.isLoading = false;

    } catch (err) {
      this.toastr.showError('Erro ao listar os relatórios', 'Erro');
      throw err;
    }
  }

  async changePage(page) {
    try {
      this.page = page;
      this.filterFields['page'] = this.page;

      this.formatFilterFields();
      await this.getReports(this.filterFields)

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra página', 'Erro');
      throw err;
    }
  }

  formatFilterFields() {
    for (let key in this.filterFields) {
      if (!this.filterFields[key]) delete this.filterFields[key]
    }
  }

  changeScreen(screen, id = "") {
    try {
      if (screen === 'new') {
        this.router.navigate(['/reports/new/report']);
      } else {
        this.router.navigate(['/reports/', id]);
      }

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra tela', 'Erro');
      throw err;
    }
  }

  enterDetails(id) {
    this.router.navigate(['/reports', id]);
  }

}
