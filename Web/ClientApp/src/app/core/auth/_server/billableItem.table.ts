export class BillableItemsTable {
	public static billableItems: any = [
		{
			id: 1265,
			issueDate: new Date(2019, 12, 12),
			from: 'Michal',
			business: '1',
			status: 2,

			name: 'Time Entry1',
			price: 325,
			unitType: 2,
			NDISSupportItemNumber: '43565854G',
			GSTCode: 1, 
			description: 'Description',

			category: '2',
			reason: 'Unknown',
		//	billableItemTo: 'suzit',
			participant: 1235,
		//	extraInfo: 'billableItem reference number #24515',
			appointments: 
				{value: 'appointment1'},
			practitioner: 'Mr. Ben Dover',
			totalDiscount: 25,
			billableItemTax: 23,
			billableItemSubTotal: 98,
			note: 'This is a note and there will be note',
			outStanding: 100,
			billableItemItem: [{
				item : 'Inital consultation and treatment',
				quantity: 25,
				unitPrice: 254,
				type: 'type1',
				serialNo: 'AK265F',
				supplier: 'supplier1',
				costPrice: 152,
				discount: 10,
				code: 'CODE1',
				taxRate: 30,
				itemTotal: 7429.5
			  },
			  {
				item : 'Inital consultation and treatment2',
				quantity: 5,
				unitPrice: 54,
				type: 'type1',
				serialNo: 'AK265F',
				supplier: 'supplier1',
				costPrice: 152,
				discount: 5,
				code: 'CODE1',
				taxRate: 5,
				itemTotal: 269.325
			  }]
		},
		{
			id: 1269,
			issueDate: new Date(2019, 12, 12),
			from: 'Michal',
			business: '2',
			status: 2,

			name: 'Time Entry2',
			price: 658,
			unitType: 2,
			NDISSupportItemNumber: '43598854G',
			GSTCode: 1, 
			description: 'Description for second time entry Item',

			category: '1',
			reason: 'Unknown',
		//	billableItemTo: 'suzit',
			participant: 1234,
		//	extraInfo: 'billableItem reference number #24515',
			appointments: 
				{value: 'appointment1'},
			practitioner: 'Mr. Ben Dover',
			totalDiscount: 25,
			billableItemTax: 23,
			billableItemSubTotal: 98,
			note: 'This is a note and there will be note',
			outStanding: 100,
			billableItemItem: [{
				item : 'Inital consultation and treatment',
				quantity: 10,
				unitPrice: 100,
				type: 'type1',
				serialNo: 'AK265F',
				supplier: 'supplier1',
				costPrice: 152,
				discount: 7,
				code: 'CODE1',
				taxRate: 17,
				itemTotal: 1088.1
			  }]
		},
	];
}
