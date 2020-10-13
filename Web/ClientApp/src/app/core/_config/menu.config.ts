export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Caretaskr',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'CARETASKR',
					logo: './assets/media/logos/logo.png'
				},
			 
			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'Participant Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
					permission: 'participantDashboardData'
				},
				{
					title: 'Therapist Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/therapist-dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
					// permission: 'therapistDashboardData'
				},
				{
					title: 'Participant Records',
					root: true,
					bullet: 'dot',
					icon: 'flaticon-users-1',
					page: '/participant-record/participants',
					// permission: 'ParticipantRecordData'
					// submenu: [
					// 	{
					// 		title: 'View',
					// 		page: '/participant-record/participants'
					// 	},
					// 	{
					// 		title: 'Add',
					// 		page: '/participant-record/add'
					// 	},
					// ]
				},
				{
					title: 'Appointments',
					root: true,
					icon: 'flaticon2-expand',
					page: '/appointments',
					permission: 'canEditAppointmentData'
				},
				{
					title: 'My Appointments',
					root: true,
					icon: 'flaticon2-expand',
					page: '/participant-appointments',
					permission: 'accessToParticipantAppointments'
				},
				{ section: 'Components' },
				{ section: 'Applications' },
				{
					title: 'Case Management',
					bullet: 'dot',
					icon: 'flaticon2-list-2',
					root: true,
					permission: 'accessToCaseManagementModule',
					submenu: [
						{
							title: 'Customers',
							page: '/ecommerce/customers'
						},
						{
							title: 'Products',
							page: '/ecommerce/products'
						},
					]
				},
				{
					title: 'Care Plan',
					bullet: 'dot',
					icon: 'flaticon2-heart-rate-monitor',
					root: true,
					page: '/careplans',
					permission: 'accessToCarePlanModule',
				},
		 
				{
					title: 'User Management',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-user-outline-symbol',
					permission: 'accessToAuthModule',
					submenu: [
						{
							title: 'Users',
							page: '/user-management/users'
						},
						{
							title: 'Roles',
							page: '/user-management/roles'
						}
					]
				},
				{ section: 'Custom' },
				{
					title: 'Scheduling Assistant',
					root: true,
					icon: 'flaticon2-list-2',
					page: '/scheduling',
					permission: 'accessScheduleAssistant'
				},
				 
				{
					title: 'My Profile',
					root: true,
					icon: 'flaticon2-user-outline-symbol',
					page: '/profile',
					permission: 'canReadParticipantProfileData'
				},
				{
					title: 'My Care Plan',
					root: true,
					icon: 'flaticon2-list-2',
					page: '/participant-careplan',
					permission: 'accessToParticipantCarePlanModule'
				},
				// {
				// 	title: 'My BillableItems',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-paper',
				// 	page: '/my-billableItems',
				// 	permission: 'participantBillableItemData'
					// submenu: [
					// 	{
					// 		title: 'Wizard 2',
					// 		page: '/wizard/wizard-2'
					// 	},
					// ]
				// },
				{
					title: 'My Statement',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-paper',
					page: '/statements',
					permission: 'canEditStatementData'
				},
				// {
				// 	title: 'BillableItems',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-paper',
				// 	page: '/billableItems',
				// 	permission: 'canEditBillableItemData'
				// 	// submenu: [
				// 	// 	{
				// 	// 		title: 'Wizard 2',
				// 	// 		page: '/wizard/wizard-2'
				// 	// 	},
				// 	// ]
				// },
				{
					title: 'Therapist Summary Plans',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-paper',
					page: '/therapistPlans',
					permission: 'canEditTherapistPlanData'
					// submenu: [
					// 	{
					// 		title: 'Wizard 2',
					// 		page: '/wizard/wizard-2'
					// 	},
					// ]
				},
				{
					title: 'TimeEntry',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-paper',
					page: '/times',
					permission: 'canEditTimeData'
					// submenu: [
					// 	{
					// 		title: 'Wizard 2',
					// 		page: '/wizard/wizard-2'
					// 	},
					// ]
				},
			 
				{
					title: 'Settings',
					root: true,
					icon: 'flaticon-cogwheel-2',
					page: '/settings/billableItems',
					permission: 'canEditSettingsData',
				},
				// {
				// 	title: 'Settings',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-user-outline-symbol',
				// 	permission: 'canEditSettingsData',
				// 	submenu: [
				// 		{
				// 			title: 'Appointment Duration',
				// 			page: '/settings/duration'
				// 		},
				// 		{
				// 			title: 'Billable',
				// 			page: '/settings/billable'
				// 		}
				// 	]
				// },
				{
					title: 'Settings',
					root: true,
					icon: 'flaticon-cogwheel-2',
					page: '/my-settings',
					permission: 'ParticipantSettingsData',
				}
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
