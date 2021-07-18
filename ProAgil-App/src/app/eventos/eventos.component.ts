import { Evento } from './../_models/Evento';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})

export class EventosComponent implements OnInit {
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  //@ts-ignore
  modalRef: BsModalRef;

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
  , private modalService: BsModalService) { }

  ngOnInit() {
    this.getEventos();
  }

 openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
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
}
