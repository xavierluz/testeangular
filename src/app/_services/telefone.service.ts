import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Telefone } from '@app/_models';

const baseUrl = `${environment.apiUrl}/Phone`;

@Injectable({ providedIn: 'root' })
export class TelefoneService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Telefone>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}?id=${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}