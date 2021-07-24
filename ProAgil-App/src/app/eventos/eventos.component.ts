import { Evento } from './../_models/Evento';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})

export class EventosComponent implements OnInit {
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento | any;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  //@ts-ignore
  registerForm: FormGroup;

  FiltroLista!: string;
  get filtroLista(): string {
    return this.FiltroLista;
  }

set filtroLista(value: string) {
    this.FiltroLista = value;
    this.eventosFiltrados = this.FiltroLista
    ? this.filtrarEventos(this.filtroLista)
    : this.eventos;
  }
  constructor(
    private eventoService: EventoService
    , private fb: FormBuilder
    , private localService: BsLocaleService
    ) {
      this.localService.use('pt-br');
    }

    ngOnInit() {
      this.getEventos();
      this.validation();
    }

    novoEvento(template: any){
      this.modoSalvar = 'post';
      this.openModal(template);
    }

    editarEvento(evento: Evento, template: any){
      this.modoSalvar = 'put';
      this.openModal(template);
      this.evento = evento;
      this.registerForm.patchValue(evento);
    }

    excluirEvento(evento: Evento, template: any) {
      this.openModal(template);
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
    }

    openModal(template: any){
      this.registerForm.reset();
      template.show();
    }

    filtrarEventos(filtrarPor: string): any {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.eventos.filter(
        evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
        );
      }

      alternarImagem() {
        this.mostrarImagem = !this.mostrarImagem;
      }

      validation(){
        this.registerForm = this.fb.group({
          tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
          local: ['', Validators.required],
          dataEvento: ['', Validators.required],
          qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
          imagemURL: ['', Validators.required],
          telefone: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        });
      }

      salvarAlteracao(template: any){
        if (this.registerForm.valid){
          if (this.modoSalvar === 'post'){
            this.evento = Object.assign({}, this.registerForm.value);
            this.eventoService.postEvento(this.evento).subscribe(
              novoEvento => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
              },
              error => {
                console.log(error);
              }
            );
          }else{
            this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
            this.eventoService.putEvento(this.evento).subscribe(
              novoEvento => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      }

      confirmeDelete(template: any) {
        this.eventoService.deleteEvento(this.evento.id).subscribe(
          () => {
              template.hide();
              this.getEventos();
            }, error => {
              console.log(error);
            }
        );
      }

      getEventos() {
        this.eventoService.getAllEvento().subscribe(
          (Eventos: Evento[]) => {
            this.eventos = Eventos;
            this.eventosFiltrados = this.eventos;
            console.log(Eventos);
          },
          error => {
            console.log(error);
          });
        }

      getEventoById(id: number){
        this.eventoService.getEventoById(id).subscribe(
          (Eventos: Evento ) => {
            this.evento = Eventos;
            console.log(Eventos);
          },
          error => {
            console.log(error);
          }
        );
      }
      }
