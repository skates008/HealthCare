import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class User extends BaseModel {
	id: number;
	username: string;
	password: string;
	email: string;
	dateOfBirth: Date;
	accessToken: string;
	refreshToken: string;
	roles: number[];
	pic: string;
	fullName: string;
	firstName: string;
	lastName: string;
	occupation: string;
	companyName: string;
	phoneNumber: string;
	address: any;
	IsRegistrationComplete: number;
	socialNetworks: SocialNetworks;
	lastLoggedIn: Date;
	loginInfo: LoginInfo
	userType: Number;
	userId: string;
	data: any;
	displayPicture: any;
	role: string;
	roleId: string;
	roleHierarchy: string;
	city:string;
	state:string;
	postCode:string;
	unit: string;
	code: string;
	
	streetNumber:string;
	streetName: string;
	teams?: MyTeams[];

	clear(): void {
		// this.id = undefined;
		this.password = '';
		this.email = '';
		this.dateOfBirth = undefined;
		this.roles = undefined;
		this.fullName = '';
		this.city = '';
		this.state = '';
		this.postCode = '';
		this.firstName = '';
		this.lastName = '';
			// this.accessToken = 'access-token-' + Math.random();
		// this.refreshToken = 'access-token-' + Math.random();
		// this.pic = './assets/media/users/default.jpg';
		// this.occupation = '';
		// this.companyName = '';
		// this.phoneNumber = '';
		// this.IsRegistrationComplete = undefined;
		// this.address = "";
		// this.address.clear();
		// this.socialNetworks = new SocialNetworks();
		// this.socialNetworks.clear();
		// this.lastLoggedIn = null;
	}
}

export class LoginInfo {
	FullName: string;
	Email: string;
	PhoneNumber: string;
	DisplayPicture: string;
	UserId: string;
	Role: string;
}

export class MyTeams {
	id?: string;
	TeamName?: string;
}
