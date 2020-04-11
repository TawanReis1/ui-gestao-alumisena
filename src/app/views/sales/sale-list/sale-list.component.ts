import { Component, OnInit } from '@angular/core';
import { Sale } from '../../../shared/classes/sale';
import { SaleService } from '../../../shared/services/sale.service';
import { Router } from '@angular/router';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  sale: Sale = new Sale();
  isLoading: Boolean;
  allSales: any = {
    data: [],
    meta: {}
  };
  page: Number = 1;
  filterFields: any = {};

  constructor(private router: Router, private saleService: SaleService, private toastr: ToastrHelper) { }

  ngOnInit() {
    this.getSales();
  }

  async getSales(filterFields = {}) {
    try {
      this.isLoading = true;
      if (Object.keys(filterFields).length === 0) {
        filterFields = { page: this.page, limit: 10 }
      }

      let response = await this.saleService.get(filterFields);

      this.allSales.data = response['data'];
      this.allSales.meta = response['meta'];

      this.isLoading = false;

    } catch (err) {
      this.toastr.showError('Erro ao listar os orçamentos', 'Erro');
      throw err;
    }
  }

  async changePage(page) {
    try {
      this.page = page;
      this.filterFields['page'] = this.page;

      this.formatFilterFields();
      await this.getSales(this.filterFields)

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
        this.router.navigate(['/sales/new/sale']);
      } else {
        this.router.navigate(['/sales/', id]);
      }

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra tela', 'Erro');
      throw err;
    }
  }

  async deleteSale(id, i) {
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
        this.saleService.delete(id)
          .then(res => {
            this.allSales.data.splice(i, 1);
          });
        swal(
          'Apagado!',
          'O orçamento foi apagado com sucesso.',
          'success'
        );
      }
    });
  }

  enterDetails(id) {
    this.router.navigate(['/sales', id]);
  }

}
