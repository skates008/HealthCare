import { BaseModel } from '../../_base/crud';

export class Setting extends BaseModel {
    id: number;
    userId: number;
    standardAppointmentTime: string;
    hoursegment: number
    clear(): void {

    }
}
