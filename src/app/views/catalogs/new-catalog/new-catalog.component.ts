import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import { Product } from '../../../shared/classes/product';
import { CatalogService } from 'src/app/shared/services/catalog.service';


@Component({
  selector: 'app-new-catalog',
  templateUrl: './new-catalog.component.html',
  styleUrls: ['./new-catalog.component.scss']
})
export class NewCatalogComponent implements OnInit {
  product = new Product();
  currentUser: any;

  constructor(private catalogService: CatalogService, private toastr: ToastrHelper, private router: Router) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem('userInformations')
    this.currentUser = JSON.parse(this.currentUser);
  }

  async createProduct() {
    try {
      this.product.createdBy = this.currentUser.data._id;
      await this.catalogService.create(this.product);

      this.toastr.showSuccess('Produto cadastrado com sucesso!', 'Sucesso');
      this.router.navigate(['/catalogs']);

      return;

    } catch (err) {
      this.toastr.showError('Erro ao cadastrar produto', 'Erro')
      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/catalogs']);
  }

}
