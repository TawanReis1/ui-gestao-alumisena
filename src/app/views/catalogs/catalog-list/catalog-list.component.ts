import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/classes/product';
import { CatalogService } from '../../../shared/services/catalog.service';
import { Router } from '@angular/router';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {
  product: Product = new Product();
  isLoading: Boolean;
  allProducts: any = {
    data: [],
    meta: {}
  };
  page: Number = 1;
  filterFields: any = {};

  constructor(private router: Router, private catalogService: CatalogService, private toastr: ToastrHelper) { }

  ngOnInit() {
    this.getProducts();
  }

  async getProducts(filterFields = {}) {
    try {
      this.isLoading = true;
      if (Object.keys(filterFields).length === 0) {
        filterFields = { page: this.page, limit: 10, sort_name: 'asc' }
      }

      let response = await this.catalogService.get(filterFields);

      this.allProducts.data = response['data'];
      this.allProducts.meta = response['meta'];

      this.isLoading = false;

    } catch (err) {
      this.toastr.showError('Erro ao listar as compras', 'Erro');
      throw err;
    }
  }

  async changePage(page) {
    try {
      this.page = page;
      this.filterFields['page'] = this.page;

      this.formatFilterFields();
      await this.getProducts(this.filterFields)

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
        this.router.navigate(['/catalogs/new/catalog']);
      } else {
        this.router.navigate(['/catalogs/', id]);
      }

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra tela', 'Erro');
      throw err;
    }
  }

  async deleteProduct(id, i) {
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
        this.catalogService.delete(id)
          .then(res => {
            this.allProducts.data.splice(i, 1);
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
    this.router.navigate(['/catalogs', id]);
  }

}
