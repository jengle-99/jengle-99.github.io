import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip';
import { TripListing } from './trip-listing/trip-listing';
import { EditTrip } from './edit-trip/edit-trip';
import { Login } from './login/login';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: 'add-trip', component: AddTrip, canActivate: [adminGuard] },
    { path: 'edit-trip', component: EditTrip, canActivate: [adminGuard] },
    { path: 'login', component: Login },
    { path: '', component: TripListing, pathMatch: 'full' }
];
