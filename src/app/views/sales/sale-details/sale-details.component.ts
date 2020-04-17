import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sale } from '../../../shared/classes/sale';
import { SaleService } from '../../../shared/services/sale.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { CatalogService } from 'src/app/shared/services/catalog.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss']
})
export class SaleDetailsComponent implements OnInit {
  sale: Sale = new Sale();
  id: String;
  isLoading: Boolean = true;
  creationInformations: any;
  updationInformations: any;
  allClients: any = [];
  allProducts: any = [];
  datePickerConfig: any;
  insertedProduct: any;
  productQuantity: any;
  selectedProducts = [];
  fullPrice: any = 0;
  treatedDate: any;
  currentUser: any;

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private saleService: SaleService, 
    private clientService: ClientService, 
    private catalogService: CatalogService,
    private modalService: NgbModal, 
    private toastr: ToastrHelper) {
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
    this.id = this.activatedRoute.snapshot.params['id'];    

    this.currentUser = localStorage.getItem('userInformations')
    this.currentUser = JSON.parse(this.currentUser);

    await this.getSaleById();

    if (this.sale.status !== 'SOLD') {
      await Promise.all([this.getProducts(), this.getClients()]);
    }

    this.isLoading = false;
  }

  async getSaleById() {
    try {
      let response = await this.saleService.getById(this.id);

      this.sale = response['data'];
      this.creationInformations = this.sale.createdBy;
      this.updationInformations = this.sale.updatedBy;
      this.selectedProducts = this.sale.products;
      this.fullPrice = this.sale.total

    } catch (err) {
      this.toastr.showError('Erro ao recuperar a venda', 'Erro');
      throw err;
    }
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
    if (this.sale.status === 'SOLD') {
      return;
    }

    this.fullPrice = 0;
    this.selectedProducts = this.selectedProducts.splice(0, i);
    this.selectedProducts.forEach(selectedProduct => {
      this.fullPrice += selectedProduct.price * selectedProduct.quantity
    })
  }

  finalizeSale(id) {
    swal({
      title: 'Você tem certeza?',
      input: 'select',
      inputOptions: {
        INVOICE: 'Boleto Bancário',
        CREDIT_CARD: 'Cartão de Crédito',
        MONEY: 'Dinheiro'
      },
      inputPlaceholder: 'Selecione a forma de pagamento',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          this.sale.paymentMethod = value;
          this.sale.status = "SOLD";
          this.sale.soldAt = moment();
          this.sale.updatedBy = this.currentUser.data._id;
          this.saleService.update(this.sale, id);
          resolve();
        })
      }
    }).then((result) => {
      if (result.value) {
        swal(
          'Atualizado!',
          'A venda foi atualizada com sucesso.',
          'success'
        );
        this.selectedProducts.forEach(selectedProduct => {
          this.catalogService.updateStock(-Math.abs(selectedProduct.quantity), selectedProduct._id);
        })
        this.router.navigate(['/sales']);
      }
    });
  }

  async updateSale() {
    try {
      let acumData = Object.assign({}, this.sale);

      acumData.name = this.sale.name;
      acumData.client = this.sale.client;
      acumData.aditionalEmail = this.sale.aditionalEmail;
      acumData.products = this.selectedProducts;
      acumData.total = this.fullPrice; 

      acumData.updatedBy = this.currentUser.data._id;

      await this.saleService.update(acumData, this.id);

      this.toastr.showSuccess('Venda atualizada com sucesso', 'Sucesso');
      this.router.navigate(['/sales'])

    } catch (err) {
      this.toastr.showError('Erro ao atualizar a venda', 'Erro');

      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/sales']);
  }

}
