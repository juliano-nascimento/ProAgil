import { Evento } from './../_models/Evento';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})

export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento | any;
  file: File | any;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  fileNameToUpdate = '';
  dataAtual = '';
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
    private eventoService: EventoService ,
    private fb: FormBuilder ,
    private localService: BsLocaleService,
    private toastr: ToastrService
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
      this.evento = Object.assign({}, evento);
      this.fileNameToUpdate = evento.imagemURL.toString();
      this.evento.imagemURL = '';
      this.registerForm.patchValue(this.evento);
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

      onFileChange(event){
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          this.file = event.target.files;
        }
      }

      uploadImagem() {

        if (this.modoSalvar === 'post'){
          const nomeArquivo = this.evento.imagemURL.split('\\', 3);
          this.evento.imagemURL = nomeArquivo[2];
          this.eventoService.postUpload(this.file, nomeArquivo[2])
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.getEventos();
            }
          );
        }
        else {
          this.evento.imagemURL = this.fileNameToUpdate;
          this.eventoService.postUpload(this.file, this.fileNameToUpdate)
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.getEventos();
            }
          );
        }
      }

      salvarAlteracao(template: any){
        if (this.registerForm.valid){
          if (this.modoSalvar === 'post'){
            this.evento = Object.assign({}, this.registerForm.value);

            this.uploadImagem();

            this.eventoService.postEvento(this.evento).subscribe(
              novoEvento => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
                this.toastr.success('Inserido com sucesso!');
              },
              error => {
                console.log(error);
                this.toastr.error(`Erro ao inserir: ${error}`);
              }
            );
          }else{
            this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

            this.uploadImagem();
            this.eventoService.putEvento(this.evento).subscribe(
              novoEvento => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
                this.toastr.success('Editado com sucesso!');
              },
              error => {
                this.toastr.error(`Erro ao editar: ${error}`);
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
              this.toastr.success('Deletado com sucesso');
            }, error => {
              this.toastr.error(`Erro deletar: ${error}`);
            }
        );
      }

      getEventos() {
        this.eventoService.getAllEvento().subscribe(
          (Eventos: Evento[]) => {
            this.eventos = Eventos;
            this.eventosFiltrados = this.eventos;
          },
          error => {
            this.toastr.error(`Erro ao tentar carregar eventos: ${error}`);
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
