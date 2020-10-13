import { BaseModel } from '../../_base/crud';

export class Budget extends BaseModel {
    id: number;
    budgetName: string;
    participant_id: number;
    totalBudget: number;
    remainingBudget: any;
    sourceOfBudget: number;
    startDate: Date;
    endDate: Date;
    clear(): void {
    }
}
