import { Component, OnInit } from '@angular/core';
import { Quote } from '../../../shared/classes/quote';
import { QuoteService } from '../../../shared/services/quote.service';
import { Router } from '@angular/router';
import { ToastrHelper } from 'src/app/shared/helpers/toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  quote: Quote = new Quote();
  isLoading: Boolean;
  allQuotes: any = {
    data: [],
    meta: {}
  };
  page: Number = 1;
  filterFields: any = {};

  constructor(private router: Router, private quoteService: QuoteService, private toastr: ToastrHelper) { }

  ngOnInit() {
    this.getQuotes();
  }

  async getQuotes(filterFields = {}) {
    try {
      this.isLoading = true;
      if (Object.keys(filterFields).length === 0) {
        filterFields = { page: this.page, limit: 10 }
      }

      let response = await this.quoteService.get(filterFields);

      this.allQuotes.data = response['data'];
      this.allQuotes.meta = response['meta'];

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
      await this.getQuotes(this.filterFields)

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
        this.router.navigate(['/quotes/new/quote']);
      } else {
        this.router.navigate(['/quotes/', id]);
      }

    } catch (err) {
      this.toastr.showError('Erro ao acessar outra tela', 'Erro');
      throw err;
    }
  }

  async deleteQuote(id, i) {
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
        this.quoteService.delete(id)
          .then(res => {
            this.allQuotes.data.splice(i, 1);
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
    this.router.navigate(['/quotes', id]);
  }

}
