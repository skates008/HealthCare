import { BaseModel } from '../../_base/crud';
import { Time } from '@angular/common';

export class Notification extends BaseModel {
    id: number;
    message: string;
    notify: string;
    participant_id: number;
    type: string;
    read: boolean;
    billableItemId: number;
    time: any;
    taskId: number;
    appointmentDate: Date;
    redirectLink: string;
    clear(): void {
    }
}
