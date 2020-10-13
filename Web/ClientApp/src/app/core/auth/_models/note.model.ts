import { BaseModel } from '../../_base/crud';

export class Note extends BaseModel {
    id: any;
    participant_id: string;
    appointmentId: string;
    appointmentDate: Date;
    practitioner: string;
    type: string;
    assessment: string;
    observation: string;
    treatment: string;
    text: string;
    careplanId: string;

    clear(): void {
    }
}
