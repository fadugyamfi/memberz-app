export interface RegisterUserContract {
    id?: any;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    dob: string;
    gender: string;
    password: string;
    remember_me?: boolean;
}