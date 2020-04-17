import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '../../../shared/classes/report';
import { ReportService } from '../../../shared/services/report.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  report: Report = new Report();
  id: String;
  creationInformations: any;
  formattedDateRange: any;
  isLoading: Boolean = true;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private reportService: ReportService, private toastr : ToastrHelper) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getReportById(this.id);
  }

  async getReportById(id) {
    try {
      let response = await this.reportService.getById(id);

      this.report = response['data'];
      this.creationInformations = this.report.createdBy;

      this.report['dateRangeInitial'] = moment(this.report['dateRangeInitial']);
      this.report['dateRangeFinal'] = moment(this.report['dateRangeFinal']);
      this.formattedDateRange = `${this.report['dateRangeInitial'].format('DD/MM/YYYY')} - ${this.report['dateRangeFinal'].format('DD/MM/YYYY', 'UTC')}`;


      this.isLoading = false;

    } catch (err) {
      this.toastr.showError('Erro ao recuperar o relatório', 'Erro');
      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/reports']);
  }

}
