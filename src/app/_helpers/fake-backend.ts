import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';



// array in local storage for registered telefones
const phoneKey = 'phone-key';
const usersJSON = localStorage.getItem(phoneKey);
let telefones: any[] = usersJSON ? JSON.parse(usersJSON) : [{
    id!: 1,
    Telefone: '11945678346',
    tipoTelefone:'Residencial'
}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/telefones') && method === 'GET':
                    return getUsers();
                case url.match(/\/telefones\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.endsWith('/telefones') && method === 'POST':
                    return createUser();
                case url.match(/\/telefones\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/telefones\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    
                    return next.handle(request);
            }    
        }

        function getUsers() {
            return ok(telefones.map(x => basicDetails(x)));
        }

        function getUserById() {
            const Telefone = telefones.find(x => x.id === idFromUrl());
            return ok(basicDetails(Telefone));
        }

        function createUser() {
            const Telefone = body;

            if (telefones.find(x => x.email === Telefone.email)) {
                return error(`Email ${Telefone.email} ja existe`);
            }

            
            Telefone.id = newUserId();
            delete Telefone.confirmPassword;
            telefones.push(Telefone);
            localStorage.setItem(phoneKey, JSON.stringify(telefones));

            return ok();
        }

        function updateUser() {
            let params = body;
            let Telefone = telefones.find(x => x.id === idFromUrl());

            if (params.email !== Telefone.email && telefones.find(x => x.email === params.email)) {
                return error(`Email ${Telefone.email} ja existe`);

            }

          
            if (!params.password) {
                delete params.password;
            }

            
            Object.assign(Telefone, params);
            localStorage.setItem(phoneKey, JSON.stringify(telefones));

            return ok();
        }

        function deleteUser() {
            telefones = telefones.filter(x => x.id !== idFromUrl());
            localStorage.setItem(phoneKey, JSON.stringify(telefones));
            return ok();
        }

    

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); 
        }

        function error(message: any) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); 
        }

        function basicDetails(Telefone: any) {
            const { id, title, firstName, lastName, email, role } = Telefone;
            return { id, title, firstName, lastName, email, role };
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newUserId() {
            return telefones.length ? Math.max(...telefones.map(x => x.id)) + 1 : 1;
        }
    }
}

export const fakeBackendProvider = {
    
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};