import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quote } from '../../../shared/classes/quote';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.component.html',
  styleUrls: ['./new-quote.component.scss']
})
export class NewQuoteComponent implements OnInit {
  quote = new Quote();
  currentUser: any;
  allClients: any;
  isLoading: Boolean = true;

  constructor(private quoteService: QuoteService, private clientService: ClientService, private toastr: ToastrHelper, private router: Router) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem('userInformations')
    this.currentUser = JSON.parse(this.currentUser);
    this.getClients();
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

      this.isLoading = false;
      console.log('this.allClients :', this.allClients);

    } catch (err) {
      this.toastr.showError('Erro ao listar os clientes', 'Erro');
      throw err;
    }
  }

  async createProduct() {
    try {
      this.quote.createdBy = this.currentUser.data._id;
      await this.quoteService.create(this.quote);

      this.toastr.showSuccess('Orçamento cadastrado com sucesso!', 'Sucesso');
      this.router.navigate(['/quotes']);

      return;

    } catch (err) {
      this.toastr.showError('Erro ao cadastrar o orçamento', 'Erro')
      throw err;
    }
  }

  cancel() {
    this.router.navigate(['/quotes']);
  }

}
