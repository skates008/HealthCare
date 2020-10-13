export class CareplansTable {
	public static careplans: any = [
		{
			id: 1265,
			created: new Date(2019, 10, 12),
			status: 'active',
			intent: 'plan',
			category: '123',
			title: 'Speech Therapy',
			description: 'Speech therapy will be provided to the participant',
			participant: 1234,
			peroid: new Date(2019, 10, 12),
			practitioner: 'Michal',
			address: '1234 Austerlia',
			goal: 'Speech inhanced',
			frequency: 'monthly',
			budget: 154,
			tssId: 1269,
			note: 'This is a note for speech therapy',
			NDISNumber: '43HRKHIN4',
			NDISContact: '1800 24589',
			start: '2019-06-30T18:15:00.000Z',
			due: '2019-06-30T18:15:00.000Z',
			practice: 'Therapy',
			activity: [{
				// Outcome of the activity
				outcomeCodableConcept: 'Do something to inhance speech',
				// comments about the activity status/progress
				progress: 'its going good it now',
				goalActivity: 'inital speech practice',
				description: 'We train participant to make inital speech',
				budgetActivity: 'This budget covers most of the inital speech'
			},
			{
				// Outcome of the activity
				outcomeCodableConcept: 'Do something to inhance speech',
				// comments about the activity status/progress
				progress: 'its going good it now',
				goalActivity: 'inital speech practice',
				description: 'We train participant to make inital speech',
				budgetActivity: 'This budget covers most of the inital speech'
			}],
			// mygoal: [{
			// 	goalTitle: 'Inhance Speech',
			// 	goalSupported: 'Do something to inhance speech1',
			// 	goalHow: 'its going good it now1',
			// }],
			mygoal: [{
					goalTitle: 'Inhance Speech',
					goalSupported: 'Do something to inhance speech1',
					goalHow: 'its going good it now1',
					shortTermGoals: [{
							goalDescription: 'Someone should be able to crawl by 15/05/2020',
							goalOutCome: 'Achieved',  // Achieved | Partially Achieved | Not Achieved | Other: Specify
							goalOutComeDetail: 'This is the explanation of the category',
							goalStrategy: 'we helped Someone to use his arms as a main mechanism to move his body'
						  },
						  {
							goalDescription: 'Someone should be able to stand by 15/12/2020',
							goalOutCome: 'Achieved',  // Achieved | Partially Achieved | Not Achieved | Other: Specify
							goalOutComeDetail: 'This is the explanation of the category',
							goalStrategy: 'we helped Someone to use his legs as a main mechanism to move his body'
						}]
				},
				{ 
					goalTitle: 'Inhance Speech',
					goalSupported: 'Do something to inhance speech1',
					goalHow: 'its going good it now1',
					shortTermGoals: [
						{
							goalDescription: 'Someone should be able to crawl by 15/05/2020',
							goalOutCome: 'Achieved',  // Achieved | Partially Achieved | Not Achieved | Other: Specify
							goalOutComeDetail: 'This is the explanation of the category',
							goalStrategy: 'we helped Someone to use his arms as a main mechanism to move his body'
						  }
					]
				}
				
			],
			mybudget: [{
				goalSupported: 'Do something to inhance speech5',
				goalHow: 'its going good it now5',
				fundAllocated: 540,
				goal: 'goal for budget',
				budget: '1',
				fundCategory: '1',
				serviceItem: '1',
			}],
			deductBudgetArr: [
				{
					remainingBudget: "800",
					id: 1,
					deductedValue: "111",
					participant_id: 1234,
					totalBudget: "1000",
					sourceOfBudget: "NDIS",
					startDate: "2019-06-30T18:15:00.000Z",
					endDate: "2022-06-30T18:15:00.000Z"
				},
				{
					remainingBudget: "500",
					id: 1,
					deductedValue: "111",
					participant_id: 1234,
					totalBudget: "1000",
					sourceOfBudget: "NDIS",
					startDate: "2019-06-30T18:15:00.000Z",
					endDate: "2022-06-30T18:15:00.000Z"
				}]

		},
		{
			id: 1266,
			created: new Date(2019, 10, 12),
			status: 'active',
			intent: 'plan',
			category: '123',
			title: 'Speech Therapy',
			description: 'Speech therapy will be provided to the participant',
			participant: 1234,
			peroid: new Date(2019, 10, 12),
			practitioner: 'Michal',
			address: '1234 Austerlia',
			goal: 'Speech inhanced',
			frequency: 'monthly',
			budget: 154,
			tssId: 1269,
			note: 'This is a note for speech therapy',
			NDISNumber: '43H50HIN4',
			NDISContact: '1800 24589',
			start: '2019-06-30T18:15:00.000Z',
			due: '2019-06-30T18:15:00.000Z',
			practice: 'Therapy',
			activity: [{
				// Outcome of the activity
				outcomeCodableConcept: 'Do something to inhance speech',
				// comments about the activity status/progress
				progress: 'its going good it now',
				goalActivity: 'inital speech practice',
				description: 'We train participant to make inital speech',
				budgetActivity: 'This budget covers most of the inital speech'
			},
			{
				// Outcome of the activity
				outcomeCodableConcept: 'Do something to inhance speech',
				// comments about the activity status/progress
				progress: 'its going good it now',
				goalActivity: 'inital speech practice',
				description: 'We train participant to make inital speech',
				budgetActivity: 'This budget covers most of the inital speech'
			}],
			// mygoal: [{
			// 	goalTitle: 'Inhance Speech',
			// 	goalSupported: 'Do something to inhance speech1',
			// 	goalHow: 'its going good it now1',
			// }],
			mygoal: [{
				goalTitle: 'Inhance Speech',
				goalSupported: 'Do something to inhance speech1',
				goalHow: 'its going good it now1',
				shortTermGoals: [{
						goalDescription: 'Someone should be able to crawl by 15/05/2020',
						goalOutCome: 'Achieved',  // Achieved | Partially Achieved | Not Achieved | Other: Specify
						goalOutComeDetail: 'This is the explanation of the category',
						goalStrategy: 'we helped Someone to use his arms as a main mechanism to move his body'
					  },
					  {
						goalDescription: 'Someone should be able to stand by 15/12/2020',
						goalOutCome: 'Achieved',  // Achieved | Partially Achieved | Not Achieved | Other: Specify
						goalOutComeDetail: 'This is the explanation of the category',
						goalStrategy: 'we helped Someone to use his legs as a main mechanism to move his body'
					}]
			},
			{ 
				goalTitle: 'Inhance Speech',
				goalSupported: 'Do something to inhance speech1',
				goalHow: 'its going good it now1',
				goals: [
					{
						goalDescription: 'Someone should be able to crawl by 15/05/2020',
						goalOutCome: 'Achieved',  // Achieved | Partially Achieved | Not Achieved | Other: Specify
						goalOutComeDetail: 'This is the explanation of the category',
						goalStrategy: 'we helped Someone to use his arms as a main mechanism to move his body'
					  }
				]
			}
			
		],
			mybudget: [{
				goalSupported: 'Do something to inhance speech5',
				goalHow: 'its going good it now5',
				fundAllocated: 540,
				goal: 'goal for budget',
				budget: '2',
				fundCategory: '1',
				serviceItem: '1',
			}],
			deductBudgetArr: [
				{
					remainingBudget: "800",
					id: 1,
					deductedValue: "111",
					participant_id: 1234,
					totalBudget: "1000",
					sourceOfBudget: "NDIS",
					startDate: "2019-06-30T18:15:00.000Z",
					endDate: "2022-06-30T18:15:00.000Z"
				},
				{
					remainingBudget: "500",
					id: 1,
					deductedValue: "111",
					participant_id: 1234,
					totalBudget: "1000",
					sourceOfBudget: "NDIS",
					startDate: "2019-06-30T18:15:00.000Z",
					endDate: "2022-06-30T18:15:00.000Z"
				}

			]
		},
	];

}
