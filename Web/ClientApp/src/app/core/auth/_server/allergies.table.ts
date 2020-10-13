export class AllergiesTable {
    public static allergies: any = [
        {
            id: 1,
            participant_id: 1234,
            clinicalStatus: "Active",
            category: "food",
            critical: "high",
            allergen: "peanuts",
            lastOccurenceDate: new Date(2022, 6, 12)
        },
        {
            id: 2,
            participant_id: 1234,
            clinicalStatus: "inactive",
            category: "environment",
            critical: "low",
            allergen: "dust",
            lastOccurenceDate: new Date(2022, 6, 12)
        },

        {
            id: 3,
            participant_id: 1234,
            clinicalStatus: "resolved",
            category: "food",
            critical: "high",
            allergen: "dairy products",
            lastOccurenceDate: new Date(2022, 6, 12)
        },
        {
            id: 4,
            participant_id: 2345,
            clinicalStatus: "Active",
            category: "food",
            critical: "high",
            allergen: "beans",
            lastOccurenceDate: new Date(2022, 6, 12)
        },

    ];
}
