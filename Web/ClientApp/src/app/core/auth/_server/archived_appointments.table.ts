export class ArchivedAppointmentsTable {
    public static archived_appointments: any = [
        {
            id: 1,
            practitioner: "Andy Ray",
            type: "General Appointment",
            participant: {
                id: 1234,
                firstName: 'Dave',
                lastName: 'Newman',
            },
            date: "Wed Dec 17 2019 00:00:00 GMT+0545 (Nepal Time)",
            starttime: "13:30",
            endtime: "14:30",
            note: "hello hello",
            status: "cancelled",
            cancelDetails: {
                cancel_reason: "",
                cancel_notes: ""
            }
        },
        {
            id: 3,
            practitioner: "Jackson BlackField",
            type: "General Appointment",
            participant: {
                id: 1234,
                firstName: 'Dave',
                lastName: 'Newman',
            },
            date: "Fri Dec 20 2019 00:00:00 GMT+0545 (Nepal Time)",
            starttime: "13:30",
            endtime: "14:30",
            note: "hello hello",
            status: "expired",
            cancelDetails: {
                cancel_reason: "",
                cancel_notes: ""
            }
        }
    ];
}
