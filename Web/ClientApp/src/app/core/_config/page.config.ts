export class PageConfig {
	public defaults: any = {
		dashboard: {
			page: {
				'title': 'Dashboard',
				'desc': 'Latest updates and statistic charts'
			},
		},
		ngbootstrap: {
			accordion: {
				page: { title: 'Accordion', desc: '' }
			},
			alert: {
				page: { title: 'Alert', desc: '' }
			},
			buttons: {
				page: { title: 'Buttons', desc: '' }
			},
			carousel: {
				page: { title: 'Carousel', desc: '' }
			},
			collapse: {
				page: { title: 'Collapse', desc: '' }
			},
			datepicker: {
				page: { title: 'Datepicker', desc: '' }
			},
			dropdown: {
				page: { title: 'Dropdown', desc: '' }
			},
			modal: {
				page: { title: 'Modal', desc: '' }
			},
			pagination: {
				page: { title: 'Pagination', desc: '' }
			},
			popover: {
				page: { title: 'Popover', desc: '' }
			},
			progressbar: {
				page: { title: 'Progressbar', desc: '' }
			},
			rating: {
				page: { title: 'Rating', desc: '' }
			},
			tabs: {
				page: { title: 'Tabs', desc: '' }
			},
			timepicker: {
				page: { title: 'Timepicker', desc: '' }
			},
			tooltip: {
				page: { title: 'Tooltip', desc: '' }
			},
			typehead: {
				page: { title: 'Typehead', desc: '' }
			}
		},
		forms: {
			page: { title: 'Forms', desc: '' }
		},
		mail: {
			page: { title: 'Mail', desc: 'Mail' }
		},
		ecommerce: {
			customers: {
				page: { title: 'Customers', desc: '' }
			},
			products: {
				edit: {
					page: { title: 'Edit product', desc: '' }
				},
				add: {
					page: { title: 'Create product', desc: '' }
				}
			},
			orders: {
				page: { title: 'Orders', desc: '' }
			}
		},
		'user-management': {
			users: {
				page: { title: 'Users', desc: '' }
			},
			roles: {
				page: { title: 'Roles', desc: '' }
			}
		},
		header: {
			actions: {
				page: { title: 'Actions', desc: 'Actions example page' }
			}
		},
		"profile": {
			view: { page: { title: 'User Profile', desc: '' } },
		},
		error: {
			404: {
				page: { title: '404 Not Found', desc: '', subheader: false }
			},
			403: {
				page: { title: '403 Access Forbidden', desc: '', subheader: false }
			}
		},
		wizard: {
			'wizard-2': { page: { title: 'Wizard 2', desc: '' } },
		},
		'participant-record': {
			participants: { page: { title: 'Participants', desc: '' } },
		},
		appointments: {
			view: { page: { title: 'Appointment Management', desc: '' } },
		},
		'participant-appointments': {
			view: { page: { title: 'Appointments', desc: '' } },
		},
		billableItems: {
			billableItems: { page: { title: 'BillableItems', desc: '' } },
		},
		therapistPlans: {
			therapistPlans: { page: { title: 'Therapist Summary Plans', desc: '' } },
		},
		times: {
			times: { page: { title: 'TimeEntry', desc: '' } },
		},
		tasks: {
			tasks: { page: { title: 'Tasks', desc: '' } },
		},
		careplans: {
			careplans: { page: { title: 'CarePlans', desc: '' } },
		},
		scheduling: {
			page: { title: 'Scheduling Assistant', desc: 'Organise your schedule using this tool' }
		},
		settings: {
			page: { title: 'Settings', desc: 'Play around with the settings and preview' }
		},
		'therapist-dashboard': {
			page: { title: 'Dashboard', desc: 'Latest updates on participants' }
		},
		'my-settings': {
			page: { title: 'Settings', desc: 'Play around with the settings and preview' }
		}

	};

	public get configs(): any {
		return this.defaults;
	}
}
