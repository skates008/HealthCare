export class BudgetTable {
    public static budget: any = [
        {
            id: 1,
            participant_id: 1234,
            totalBudget: '1000',
            remainingBudget: '800',
            sourceOfBudget: 'NDIS',
            startDate: new Date(2019, 6, 1),
            endDate: new Date(2022, 6, 1)
        },
        {
            id: 2,
            participant_id: 1234,
            totalBudget: '2000',
            remainingBudget: '500',
            sourceOfBudget: 'self funded',
            startDate: new Date(2019, 10, 30),
            endDate: new Date(2022, 2, 30)
        }
    ];
}