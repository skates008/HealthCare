export class NotificationTable {
    public static notification: any = [
        {
            id: 1,
            message: "Dave NewMann has requested an appointment",
            notify: "therapist",
            type: "appointment",
            redirectLink: "appointments/request",
            read: false,


        },
        {
            id: 2,
            message: "Therapist has requested an billableItem",
            notify: "participant",
            type: "billableItem",
            billableItemId: 1269,
            participantId: 1234,
            read: false
        },
        {
            id: 3,
            message: "Therapist has created a careplan",
            notify: "participant",
            type: "careplan",
            carePlanId: 1265,
            participantId: 1234,
            read: false
        },
        {
            id: 4,
            message: "Andy Ray has booked an appointment",
            notify: "participant",
            read: false,
            redirectLink: "participant-appointments/view",
            appointmentDate: new Date(2020, 2, 2),
        },
        {
            id: 5,
            message: "A task has been assigned",
            notify: "therapist",
            type: "task",
            read: false,
            taskId: 1111,
        }
    ];
}