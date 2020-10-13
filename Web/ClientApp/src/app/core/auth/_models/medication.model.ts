import { BaseModel } from '../../_base/crud';

export class Medication extends BaseModel {
    id: number;
    participant_id: number;
    manufacturer: string;
    medicine: string;
    form: any;
    amount: number;
    expirationDate: Date;
    frequency: number;
    formOfMedicine:number;
    clear(): void {

    }
}
