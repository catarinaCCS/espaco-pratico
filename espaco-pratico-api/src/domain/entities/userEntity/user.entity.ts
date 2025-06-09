export type TUserProperties = {
    id: string;
    fullName: string;
    email: string;
    password: string;
};

export class User {
    private readonly _id: string;
    private _fullName: string;
    private _email: string;
    private _password: string;

    constructor(props: TUserProperties) {
        this._id = props.id;

        User.checkFullNameIsValide(props.fullName);
        this._fullName = props.fullName;

        User.checkEmailIsValid(props.email);
        this._email = props.email;

        User.checkPasswordIsValid(props.password);
        this._password = props.password;
    }

    get id(): string {
        return this._id;
    }

    get fullName(): string {
        return this._fullName;
    }

    set fullName(value: string) {
        User.checkFullNameIsValide(value);
        this._fullName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        User.checkEmailIsValid(value);
        this._email = value;
    }
 
    get password(): string {
        return this._password;
    }

    private set password(value: string) {
        User.checkPasswordIsValid(value);
        this._password = value;
    }

    static checkPasswordIsValid(password: string): void {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
        const result = passwordRegex.test(password);

        if (!result) {
            throw new Error('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
        }
    }

    public checkPassword(password: string): boolean {
        return this._password === password;
    }

    static checkEmailIsValid(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const result = emailRegex.test(email);

        if (!result) {
            throw new Error('Invalid email format');
        }
    }

    static checkFullNameIsValide(fullName: string): void {
        if (fullName.length < 3) {
            throw new Error('Full name must be at least 3 characters long');
        }
        if (fullName.length > 100) {
            throw new Error('Full name must be at most 100 characters long');
        }
    }
}