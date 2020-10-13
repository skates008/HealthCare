export class TasksTable {
	public static tasks: any = [
		{
			id: 1111,
			issueDate: new Date(2019, 12, 12),
			dueDate: new Date(2020, 3, 3),
			title: 'Appointment with Dave',
			status: 2,
			description: 'General appointment with Dave'
		},
		{
			id: 1112,
			issueDate: new Date(2019, 12, 12),
			dueDate: new Date(2020, 2, 2),
			title: 'Follow up',
			status: 2,
			description: 'Follow up with participants'
		}
	];
}
