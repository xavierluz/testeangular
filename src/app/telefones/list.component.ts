import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { TelefoneService } from '@app/_services';
import { Telefone } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    telefones!: Telefone[];

    constructor(private telefoneService: TelefoneService) {}

    ngOnInit() {
        this.telefoneService.getAll()
            .pipe(first())
            .subscribe(telefone => this.telefones = telefone);
    }

    delete(id: number) {
        const telefone = this.telefones.find(x => x.id === id);
        if (!telefone) return;
        telefone.delete=false;
        this.telefoneService.delete(id)
            .pipe(first())
            .subscribe(telefone => this.telefones = telefone);
    }
}