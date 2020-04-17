import { Component, OnInit } from '@angular/core';
import { Report } from '../../../shared/classes/report';
import { ReportService } from 'src/app/shared/services/report.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit {
  report = new Report();
  selectedDateRange: any;
  currentUser: any;
  datePickerConfig: any;


  constructor(private reportService: ReportService, private toastr: ToastrHelper, private router: Router) { 
    this.datePickerConfig = {
      firstDayOfWeek: 'su',
      monthFormat: 'MMM, YYYY',
      disableKeypress: false,
      allowMultiSelect: true,
      onOpenDelay: 0,
      weekDayFormat: 'ddd',
      appendTo: document.body,
      drops: 'down',
      opens: 'right',
      showNearMonthDays: true,
      showWeekNumbers: false,
      enableMonthSelector: true,
      format: "DD/MM/YYYY",
      yearFormat: 'YYYY',
      showGoToCurrent: true,
      dayBtnFormat: 'DD',
      monthBtnFormat: 'MMM',
      hours12Format: 'hh',
      hours24Format: 'HH',
      meridiemFormat: 'A',
      minutesFormat: 'mm',
      minutesInterval: 1,
      secondsFormat: 'ss',
      secondsInterval: 1,
      showSeconds: false,
      showTwentyFourHours: true,
      timeSeparator: ':',
      multipleYearsNavigateBy: 10,
      showMultipleYearsNavigation: false,
      locale: 'pt-BR',
    }
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('userInformations')
    this.currentUser = JSON.parse(this.currentUser);
  }

  async createReport() {
    try {
      if (this.selectedDateRange.length >= 3) {
        this.toastr.showError('Quantidade inválida de datas selecionadas.', 'Erro');
        throw "Quantidade inválida de datas selecionadas."
      }  

      this.report.dateRange = await this.formatSelectedDate();
      this.report.createdBy = this.currentUser.data._id;
      
      await this.reportService.create(this.report);

      this.toastr.showSuccess('Relatório criado com sucesso', 'Sucesso');
      this.router.navigate(['/reports']);

      return;

    } catch (err) {
      throw err;
    }
  }

  formatSelectedDate() {
    let currentDate = moment();
    let difference;
    let index;

    this.selectedDateRange.forEach((selectedDate, i) => {
      let aux = 0;
      difference = currentDate.diff(selectedDate, 'days');
      if (difference <= aux) index = i
      console.log('selectedDate :', selectedDate);
      console.log('difference :', difference);
    });

    console.log('index :', index);

    let formattedDateRange = {
      initial: null,
      final: null
    };

    formattedDateRange.final = this.selectedDateRange[index].format('YYYY-MM-DD');
    
    this.selectedDateRange.splice(index, 1);

    formattedDateRange.initial = this.selectedDateRange.pop().format('YYYY-MM-DD');

    return formattedDateRange;
  }
  
  cancel() {
    this.router.navigate(['/reports']);
  }

}
