import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/classes/product';
import { CatalogService } from '../../../shared/services/catalog.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-catalog-details',
  templateUrl: './catalog-details.component.html',
  styleUrls: ['./catalog-details.component.scss']
})
export class CatalogDetailsComponent implements OnInit {
  product: Product = new Product();
  id: String;
  isLoading: Boolean = true;
  creationInformations: any;
  updationInformations: any;
  currentUser: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private catalogService: CatalogService, private toastr: ToastrHelper) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getProductById();

    this.currentUser = localStorage.getItem('userInformations')
    this.currentUser = JSON.parse(this.currentUser);
  }

  async getProductById() {
    try {
      let response = await this.catalogService.getById(this.id);

      this.product = response['data'];
      this.creationInformations = this.product.createdBy;
      console.log('this.creationInformations :', this.creationInformations);
      this.updationInformations = this.product.updatedBy;
      this.isLoading = false;

    } catch (err) {
      this.toastr.showError('Erro ao recuperar o produto', 'Erro');
      throw err;
    }
  }

  async deleteProduct(id) {
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
            this.router.navigate(['/catalogs']);
          });
        swal(
          'Apagado!',
          'O produto foi apagado com sucesso.',
          'success'
        );
      }
    });
  }

  async updateProduct() {
    try {
      let acumData = Object.assign({}, this.product);

      acumData.code = this.product.code;
      acumData.name = this.product.name;
      acumData.price = this.product.price;
      acumData.quantity = this.product.quantity;
      acumData.typeQuantity = this.product.typeQuantity;
      acumData.color = this.product.color;
      acumData.available = this.product.available;

      acumData.updatedBy = this.currentUser.data._id;

      await this.catalogService.update(acumData, this.id);

      this.toastr.showSuccess('Produto atualizado com sucesso', 'Sucesso');
      this.router.navigate(['/catalogs'])

    } catch (err) {
      this.toastr.showError('Erro ao atualizar o Produto', 'Erro');

      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/catalogs']);
  }

}
