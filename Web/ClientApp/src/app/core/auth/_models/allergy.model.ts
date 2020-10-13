import { BaseModel } from '../../_base/crud';

export class Allergy extends BaseModel {
    id: number;
    participant_id: number;
    clinicalStatus: number;
    category: number;
    critical: number;
    lastOccurenceDate: Date;
    allergen: string;
    clear(): void {
    }
}
