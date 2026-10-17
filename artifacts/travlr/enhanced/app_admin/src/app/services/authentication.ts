import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from '../services/trip-data';

interface JwtPayload {
    email?: string;
    name?: string;
    role?: 'user' | 'admin';
    exp?: number;
}

@Injectable({ providedIn: 'root' })
export class Authentication {
    constructor(
        @Inject(BROWSER_STORAGE) private storage: Storage,
        private tripData: TripData
    ) { }

    authResp: AuthResponse = new AuthResponse();

    private decodeToken(): JwtPayload | null {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        try {
            const payload = token.split('.')[1];
            if (!payload) {
                return null;
            }
            return JSON.parse(atob(payload)) as JwtPayload;
        } catch {
            return null;
        }
    }

    public getToken(): string {
        const out = this.storage.getItem('travlr-token');
        return out || '';
    }

    public saveToken(token: string): void {
        this.storage.setItem('travlr-token', token);
    }

    public logout(): void {
        this.storage.removeItem('travlr-token');
    }

    public isLoggedIn(): boolean {
        const payload = this.decodeToken();
        return !!payload?.exp && payload.exp > (Date.now() / 1000);
    }

    public isAdmin(): boolean {
        const payload = this.decodeToken();
        return this.isLoggedIn() && payload?.role === 'admin';
    }

    public getCurrentUser(): User {
        const payload = this.decodeToken();
        return {
            email: payload?.email || '',
            name: payload?.name || '',
            role: payload?.role || 'user'
        } as User;
    }

    public login(user: User, passwd: string): void {
        this.tripData.login(user, passwd)
            .subscribe({
                next: (value: AuthResponse) => {
                    if (value?.token) {
                        this.authResp = value;
                        this.saveToken(this.authResp.token);
                    }
                },
                error: (error: any) => {
                    console.log('Error: ' + error);
                }
            });
    }

    public register(user: User, passwd: string): void {
        this.tripData.register(user, passwd)
            .subscribe({
                next: (value: AuthResponse) => {
                    if (value?.token) {
                        this.authResp = value;
                        this.saveToken(this.authResp.token);
                    }
                },
                error: (error: any) => {
                    console.log('Error: ' + error);
                }
            });
    }
}
