import { Component, OnInit } from '@angular/core';
import { Client } from '../../../shared/classes/client';
import { ClientService } from '../../../shared/services/client.service';
import { Router } from '@angular/router';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})

export class ClientListComponent implements OnInit {
  client: Client = new Client();
  isLoading: Boolean;
  allClients: any = {
    data: [],
    meta: {}
  };
  page: Number = 1;
  filterFields: any = {};
  filterCode: string;
  filterPurchaseDate: string;
  filterCashbackPercentage: string;
  filterStatus: string;
  datePickerConfig: any;

  constructor(private router: Router, private clientService: ClientService, private toastr: ToastrHelper) { }

  ngOnInit() {
    this.getClients();
  }

  async getClients(filterFields = {}) {
    try {
      this.isLoading = true;
      if (Object.keys(filterFields).length === 0) {
        filterFields = { page: this.page, limit: 10 }
      }

      let response = await this.clientService.get(filterFields);

      this.allClients.data = response['data'];
      this.allClients.meta = response['meta'];

      this.isLoading = false;

    } catch (err) {
      this.toastr.showError('Erro ao listar os clientes', 'Erro');
      throw err;
    }
  }

  applyFilter() {
    try {
      this.filterFields = {
        filter_code: this.filterCode,
        filter_purchaseDate: this.filterPurchaseDate ? moment(this.filterPurchaseDate).format('YYYY-MM-DD') : "",
        filter_cashbackPercentage: this.filterCashbackPercentage,
        filter_status: this.filterStatus
      }

      this.formatFilterFields();
      this.getClients(this.filterFields);
    } catch (err) {
      this.toastr.showError('Erro ao filtrar as compras', 'Erro');
      throw err;
    }

  }

  clearFilter() {
    try {
      this.filterCode = "";
      this.filterPurchaseDate = "";
      this.filterStatus = "";
      this.getClients();
    } catch (err) {
      this.toastr.showError('Erro ao limpar os campos do filtro', 'Erro');
      throw err;
    }
  }

  async changePage(page) {
    try {
      this.page = page;
      this.filterFields['page'] = this.page;

      this.formatFilterFields();
      await this.getClients(this.filterFields)

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra página', 'Erro');
      throw err;
    }
  }

  changeScreen(screen, id = "") {
    try {
      if (screen === 'new') {
        this.router.navigate(['/clients/new/client']);
      } else {
        this.router.navigate(['/clients/', id]);
      }

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra tela', 'Erro');
      throw err;
    }
  }

  formatFilterFields() {
    for (let key in this.filterFields) {
      if (!this.filterFields[key]) delete this.filterFields[key]
    }
  }

  async deleteClient(id, i) {
    swal({
      title: 'Você tem certeza?',
      text: 'Você não será capaz de reverter isso!',
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#6C757D',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#159588',
      confirmButtonText: 'Sim, apague!',
      reverseButtons: true

    }).then((result) => {
      if (result.value) {
        this.clientService.delete(id)
          .then(res => {
            this.allClients.data.splice(i, 1);
            // this.allClients.meta.totalItems =- 1;
          });
        swal(
          'Apagado!',
          'O cliente foi apagado com sucesso.',
          'success'
        );
      }
    });
  }

  enterDetails(id) {
    this.router.navigate(['/clients', id]);
  }
}
