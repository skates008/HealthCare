export class TimesTable {
	public static times: any = [
		{
			id: 1265,
			issueDate: new Date(2019, 12, 12),
			from: 'Michal',
			business: '1',
			status: 2,
			careplan: '2',
			reason: 'Unknown',
			fullday: 0,
			subject: 'Subject',
			attendees: 3,
			participant: 1235,
			appointments: 
				{value: 'appointment1'},
			practitioner: 'Mr. Ben Dover',
			totalDiscount: 25,
			travelTime: 3,
			timeSubTotal: 98,
			note: 20,
			outStanding: 100,
			billableItem: [{
				name : 'Billable Item Name1',
				NDISnumber: '432KNSJA44',
				unitPrice: 254,
				type: 'type1',
				serialNo: 'AK265F',
				description: 'Description time entry',
				costPrice: 152,
				unitType: 3,
				code: 1,
				taxRate: 30,
				itemTotal: 7429.5
			  }]
		},
		{
			id: 1269,
			issueDate: new Date(2019, 12, 12),
			from: 'Michal',
			business: '2',
			status: 2,
			careplan: '2',
			reason: 'Unknown',
			fullday: 1,
			subject: 'Subject',
			attendees: 1235,
			participant: 1235,
			appointments: 
				{value: 'appointment1'},
			practitioner: 'Mr. Ben Dover',
			totalDiscount: 25,
			travelTime: 2,
			timeSubTotal: 98,
			note: 20,
			outStanding: 100,
			billableItem: [{
				name : 'Billable Item Name2',
				NDISnumber: '432KNSJA44',
				unitPrice: 100,
				type: 'type1',
				serialNo: 'AK265F',
				description: 'Description time entry',
				costPrice: 152,
				unitType: 5,
				code: 3,
				taxRate: 17,
				itemTotal: 1088.1
			  }]
		},
	];
}
