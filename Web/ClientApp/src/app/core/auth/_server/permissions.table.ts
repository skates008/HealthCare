export class PermissionsTable {
    public static permissions: any = [
        {
            id: 1,
            name: 'accessToCaseManagementModule',
            level: 1,
            title: 'Case Management module'
        },
        {
            id: 2,
            name: 'accessToAuthModule',
            level: 1,
            title: 'Users Management module'
        },
        {
            id: 4,
            name: 'canReadECommerceData',
            level: 2,
            parentId: 1,
            title: 'Read'
        },
        {
            id: 5,
            name: 'canEditECommerceData',
            level: 2,
            parentId: 1,
            title: 'Edit'
        },
        {
            id: 6,
            name: 'canDeleteECommerceData',
            level: 2,
            parentId: 1,
            title: 'Delete'
        },
        {
            id: 7,
            name: 'canReadAuthData',
            level: 2,
            parentId: 2,
            title: 'Read'
        },
        {
            id: 8,
            name: 'canEditAuthData',
            level: 2,
            parentId: 2,
            title: 'Edit'
        },
        {
            id: 9,
            name: 'canDeleteAuthData',
            level: 2,
            title: 'Delete'
        },
        {
            id: 10,
            name: 'canReadMailData',
            level: 2,
            title: 'Read'
        },
        {
            id: 11,
            name: 'canEditMailData',
            level: 2,
            title: 'Edit'
        },
        {
            id: 12,
            name: 'canDeleteMailData',
            level: 2,
            title: 'Delete'
        },

        // access to caretaskr modules
        {
            id: 13,
            name: 'ParticipantDashboard',
            level: 2,
            title: 'Read'
        },
        // Permissions for Participant Profile
        {
            id: 14,
            name: 'canReadParticipantProfileData',
            level: 2,
            title: 'participant-profile'
        },
        // Permissions for Participant Records
        {
            id: 15,
            name: 'ParticipantRecordData',
            level: 2,
            title: 'participant-record'
        },
        {
            id: 16,
            name: 'canDeleteParticipantProfileData',
            level: 2,
            title: 'Delete'
        },

        // Permissions for Appointment
        {
            id: 17,
            name: 'canReadAppointmentData',
            level: 2,
            title: 'Read'
        },
        {
            id: 18,
            name: 'canEditAppointmentData',
            level: 2,
            title: 'appointment'
        },
        {
            id: 19,
            name: 'canDeleteAppointmentData',
            level: 2,
            title: 'Delete'
        },

        // Permissions for Care plan
        {
            id: 20,
            name: 'canReadCarePlanData',
            level: 2,
            title: 'Read'
        },
        {
            id: 21,
            name: 'canEditCarePlanData',
            level: 2,
            title: 'Edit'
        },
        {
            id: 22,
            name: 'canDeleteCarePlanData',
            level: 2,
            title: 'Delete'
        },

        // Permissions for billableItems

        {
            id: 23,
            name: 'canReadBillableItemData',
            level: 2,
            title: 'Read'
        },
        {
            id: 24,
            name: 'canEditBillableItemData',
            level: 2,
            title: 'BillableItemData'
        },
        {
            id: 25,
            name: 'canDeleteBillableItemData',
            level: 2,
            title: 'Delete'
        },

        // Permissions for Settings

        {
            id: 26,
            name: 'canReadSettingsData',
            level: 1,
            title: 'Read'
        },
        {
            id: 27,
            name: 'canEditSettingsData',
            level: 2,
            title: 'Edit'
        },
        {
            id: 28,
            name: 'canDeleteSettingsData',
            level: 2,
            title: 'Delete'
        },

        // Case Management 

        {
            id: 29,
            name: 'caseManagement',
            level: 1,
            title: 'case management'
        },
        {
            id: 30,
            name: 'accessScheduleAssistant',
            level: 1,
            title: 'Schedule Assistant'
        },

        // Participant billableItems

        {
            id: 31,
            name: 'ParticipantBillableItem',
            level: 2,
            title: 'Read'
        },

        // Participant Appointments

        {
            id: 32,
            name: 'accessToParticipantAppointments',
            level: 1,
            title: 'Participant-Appointments'
        },

        // Care Plan 

        {
            id: 33,
            name: 'accessToCarePlanModule',
            level: 2,
            title: 'Care-Plan'
        },
        {
            id: 34,
            name: 'accessToParticipantCarePlanModule',
            level: 2,
            title: 'My-care-Plan'
        },
        {
            id: 35,
            name: 'participantDashboardData',
            level: 2,
            title: 'Participant-Dashboard'
        },
        {
            id: 36,
            name: 'therapistDashboardData',
            level: 2,
            title: 'therapist-dashboard'
        },
        {
            id: 37,
            name: 'participantBillableItemData',
            level: 2,
            title: 'participantBillableItemData'
        },
        {
            id: 38,
            name: 'ParticipantSettingsData',
            level: 2,
            title: 'participantSettingData'
        },
        {
            id: 39,
            name: 'canEditTaskData',
            level: 2,
            title: 'TaskData'
        },
        {
            id: 40,
            name: 'canEditTimeData',
            level: 2,
            title: 'TimeData'
        },
        {
            id: 41,
            name: 'canEditStatementData',
            level: 2,
            title: 'StatementData'
        },
        {
            id: 42,
            name: 'canEditTherapistPlanData',
            level: 2,
            title: 'TherapistPlanData'
        },
        {
            id: 43,
            name: 'canEditProviderProfile',
            level: 2,
            title: 'provider-profile'
        },
        {
            id: 44,
            name: 'canEditInvoiceData',
            level: 2,
            title: 'InvoiceData'
        },
    ];
}
