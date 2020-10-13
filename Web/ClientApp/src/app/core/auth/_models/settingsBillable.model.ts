import { BaseModel } from '../../_base/crud';

export class SettingBillable extends BaseModel {
    id: number;
    userId: number;
    standardAppointmentTime: string;
    hoursegment: number
    clear(): void {

    }
}
