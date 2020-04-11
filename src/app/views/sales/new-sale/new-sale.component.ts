import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sale } from '../../../shared/classes/sale';
import { SaleService } from 'src/app/shared/services/sale.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { CatalogService } from 'src/app/shared/services/catalog.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';


@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit {
  sale = new Sale();
  currentUser: any;
  allClients: any = [];
  allProducts: any = [];
  isLoading: Boolean = true;
  datePickerConfig: any;
  insertedProduct: any;
  productQuantity: any;
  fullPrice: any = 0;
  selectedProducts = [];

  constructor(private saleService: SaleService, 
    private clientService: ClientService, 
    private catalogService: CatalogService, 
    private toastr: ToastrHelper, 
    private router: Router,
    private modalService: NgbModal) {
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

  async ngOnInit() {
    this.currentUser = localStorage.getItem('userInformations')
    this.currentUser = JSON.parse(this.currentUser);
    await Promise.all([this.getClients(), this.getProducts()]);
    this.isLoading = false;
  }

  async getClients() {
    try {
      let filterFields = { page: 1, limit: 10 }

      let response;
      do {
        response = await this.clientService.get(filterFields);
        this.allClients.push(...response.data);

        filterFields.page++;

      } while (response.data.length > 0)

    console.log('this.allClients :', this.allClients);


    } catch (err) {
      this.toastr.showError('Erro ao listar os clientes', 'Erro');
      throw err;
    }
  }

  async getProducts() {
    try {
      let filterFields = { page: 1, limit: 10 }

      let response;
      do {
        response = await this.catalogService.get(filterFields);
        this.allProducts.push(...response.data);

        filterFields.page++;

      } while (response.data.length > 0)

    } catch (err) {
      this.toastr.showError('Erro ao listar os clientes', 'Erro');
      throw err;
    }
  }

  openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
    }, (reason) => {
    });
  }

  closeModal(product, selectedProductQuantity) {
    if (selectedProductQuantity > product.quantity) {
      this.toastr.showError(`Quantidade selecionada é maior que a disponível para o produto. Atualmente possui ${product.quantity} ${product.typeQuantity}`, 'Erro');
      throw "Quantity unavailable";
    }
    this.modalService.dismissAll();
    this.toastr.showSuccess('Produto inserido com sucesso!', 'Sucesso');
  }

  insertProductsSale() {
    this.fullPrice = 0;
    this.insertedProduct.quantity = this.productQuantity
    this.selectedProducts.push(this.insertedProduct);
    this.selectedProducts.forEach(selectedProduct => {
      this.fullPrice += selectedProduct.price * selectedProduct.quantity
    })
    this.insertedProduct = null;
    this.productQuantity = null;
  }

  removeProductSale(i) {
    this.fullPrice = 0;
    this.selectedProducts = this.selectedProducts.splice(0, i);
    this.selectedProducts.forEach(selectedProduct => {
      this.fullPrice += selectedProduct.price * selectedProduct.quantity
    })
  }
  
  async createProduct() {
    try {
      this.sale.createdBy = this.currentUser.data._id;
      this.sale.products = this.selectedProducts;
      this.sale.total = this.fullPrice;
      await this.saleService.create(this.sale);

      this.toastr.showSuccess('Venda cadastrada com sucesso!', 'Sucesso');
      this.router.navigate(['/sales']);

      return;

    } catch (err) {
      this.toastr.showError('Erro ao cadastrar a venda', 'Erro')
      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/sales']);
  }

  delay(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

}
