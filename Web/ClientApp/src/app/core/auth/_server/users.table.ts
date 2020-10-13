export class UsersTable {
	public static users: any = [
		{
			id: 1,
			username: 'therapist',
			password: 'demo',
			email: 'therapist@demo.com',
			accessToken: 'access-token-8f3ae836da744329a6f93bf20594b5cc',
			refreshToken: 'access-token-f8c137a2c98743f48b643e71161d90aa',
			roles: [1], // Therapist
			pic: './assets/media/users/300_25.jpg',
			fullname: 'Sean',
			welcome: 1,
			occupation: 'CEO',
			companyName: 'Keenthemes',
			phone: '456669067890',
			address: {
				addressLine: 'L-12-20 Vertex, Cybersquare',
				city: 'San Francisco',
				state: 'California',
				postCode: '45000'
			},
			socialNetworks: {
				linkedIn: 'https://linkedin.com/admin',
				facebook: 'https://facebook.com/admin',
				twitter: 'https://twitter.com/admin',
				instagram: 'https://instagram.com/admin'
			},
			lastLoggedIn: null
		},
		{
			id: 2,
			username: 'admin',
			password: 'demo',
			email: 'admin@demo.com',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806dbf',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e55',
			roles: [2], // Administrator
			pic: './assets/media/users/100_2.jpg',
			fullname: 'Admin',
			occupation: 'Deputy Head of Keenthemes in New York office',
			companyName: 'Keenthemes',
			welcome: 1,
			phone: '456669067891',
			address: {
				addressLine: '3487  Ingram Road',
				city: 'Greensboro',
				state: 'North Carolina',
				postCode: '27409'
			},
			socialNetworks: {
				linkedIn: 'https://linkedin.com/user',
				facebook: 'https://facebook.com/user',
				twitter: 'https://twitter.com/user',
				instagram: 'https://instagram.com/user'
			},
			lastLoggedIn: null
		},

		{
			id: 3,
			username: 'guest',
			password: 'demo',
			email: 'guest@demo.com',
			accessToken: 'access-token-d2dff7b82f784de584b60964abbe45b9',
			refreshToken: 'access-token-c999ccfe74aa40d0aa1a64c5e620c1a5',
			roles: [3], // Guest
			pic: './assets/media/users/default.jpg',
			fullname: 'Ginobili Maccari',
			occupation: 'CFO',
			companyName: 'Keenthemes',
			phone: '456669067892',
			address: {
				addressLine: '1467  Griffin Street',
				city: 'Phoenix',
				state: 'Arizona',
				postCode: '85012'
			},
			socialNetworks: {
				linkedIn: 'https://linkedin.com/guest',
				facebook: 'https://facebook.com/guest',
				twitter: 'https://twitter.com/guest',
				instagram: 'https://instagram.com/guest'
			},
			lastLoggedIn: null
		},
		{
			id: 1234,
			username: 'participant',
			password: 'demo',
			email: 'participant@demo.com',
			accessToken: 'access-token-d2dff7b82f784de584b60964abbe46b9',
			refreshToken: 'access-token-c999ccfe74aa40d0aa1a64c5e620c2a5',
			roles: [4], // participant
			pic: './assets/media/users/default.jpg',
			fullname: 'Participant FullName',
			occupation: 'CFO',
			companyName: 'Caretaskr',
			phone: '546465155',
			welcome: 1,
			address: {
				addressLine: '1467  Griffin Street',
				city: 'Phoenix',
				state: 'Arizona',
				postCode: '56025'
			},
			socialNetworks: {
				linkedIn: 'https://linkedin.com/participant',
				facebook: 'https://facebook.com/participant',
				twitter: 'https://twitter.com/participant',
				instagram: 'https://instagram.com/participant'
			}
		}
	];

	public static tokens: any = [
		{
			id: 1,
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random()
		}
	];
}
