export class MedicationsTable {
    public static medications: any = [
        {
            id: 1,
            participant_id: 1234,
            manufacturer: "ABC Company",
            medicine: "ABC",
            form: "solid",
            amount: 3,
            expirationDate: new Date(2022, 6, 12),
            frequency: "weekly"
        },
        {
            id: 2,
            participant_id: 1234,
            manufacturer: "XYZ Company",
            medicine: "Vit B Comp",
            form: "capsule",
            amount: 3,
            expirationDate: new Date(2022, 6, 12),
            frequency: "monthly"
        },

        {
            id: 3,
            participant_id: 1234,
            manufacturer: "ABC Company",
            medicine: "XYZ",
            form: "liquid",
            amount: 1,
            expirationDate: new Date(2022, 6, 12),
            frequency: "daily"

        },
        {
            id: 4,
            participant_id: 2345,
            manufacturer: "ABC Company",
            form: "solid",
            medicine: "AE",
            amount: 3,
            expirationDate: new Date(2022, 6, 12),
            frequency: "weekly"
        },

    ];
}
