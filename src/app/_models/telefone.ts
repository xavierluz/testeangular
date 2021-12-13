import { TipoTelefone } from './tipo.telefone';

export class Telefone {
    id!: number;
    Telefone!: string;
    tipoTelefone!:TipoTelefone;
    delete:boolean=false;
}