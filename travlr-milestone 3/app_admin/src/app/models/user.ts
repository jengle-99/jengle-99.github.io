export class User {
    email: string;
    name: string;
    role?: 'user' | 'admin';

    constructor() {
        this.email = '';
        this.name = '';
        this.role = 'user';
    }
}
