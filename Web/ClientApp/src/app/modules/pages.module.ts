// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from './../layout/partials/partials.module';
// Pages
import { CoreModule } from './../core/core.module';
import { UserManagementModule } from './user-management/user-management.module';
// import { ProviderAppointmentsComponent } from './provider-appointments/provider-appointments.component';


@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		UserManagementModule,
	],
	providers: []
})
export class PagesModule {
}
