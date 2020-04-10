import { Component, OnInit } from '@angular/core';
import { Client } from '../../../shared/classes/client';
import { ClientService } from 'src/app/shared/services/client.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  client = new Client();
  currentUser: any;
  datePickerConfig: any;

  constructor(private clientService: ClientService, private toastr: ToastrHelper, private router: Router) { 
    this.datePickerConfig = {
      firstDayOfWeek: 'su',
      monthFormat: 'MMM, YYYY',
      disableKeypress: false,
      allowMultiSelect: false,
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

  async createClient() {
    try {
      this.client.createdBy = this.currentUser.data._id;
      await this.clientService.create(this.client);

      this.toastr.showSuccess('Cliente cadastrado com sucesso!', 'Sucesso');
      this.router.navigate(['/clients']);

      return;

    } catch (err) {
      this.toastr.showError('Erro ao cadastrar cliente', 'Erro')
      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/clients']);
  }

}
