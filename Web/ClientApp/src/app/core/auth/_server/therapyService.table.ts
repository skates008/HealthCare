export class TherapyServicesTable {
	public static therapyServices: any = [
		{
			id: 1269,

			title: 'Summary title',
			providerName: 'Name of Provider',
			providerAddress: 'Address of Provider',
			providerEmail: 'provider@gmail.com',
			providerNDIS: '43265445G',

			participantName: 'Name of Participant',
			participantAddress: 'Address of Participant',
			participantEmail: 'participant@gmail.com',
			participantNDIS: '43269845G',
			
			issueDate: new Date(2019, 12, 12),
			startDate: new Date(2019, 12, 12),
			endDate: new Date(2020, 12, 12),
			careplanId: 1265,

			planInchargeName: 'Mr Beans',
			planInchargeEmail: 'beans@companyname.com',
			planInchargePhone: '+81 880 858450',

			furtherTherapy: 'Further Therapy',
			familyGoal: 'Family Goal',
			status: 'Draft', 
			shortTermGoals: [
				{
					name: 'family goal 1',
					goals: [
						{
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
						}
					]
				},
				{
					name: 'family goal 2',
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
		}
	];
}
