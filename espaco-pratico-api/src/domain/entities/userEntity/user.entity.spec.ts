import { TUserProperties, User } from "./user.entity";

describe('User instance validation', () => {
    const userData: TUserProperties = {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: '@Teste123'
    }
    
    it ('must create a new User instance with the provided data', () => {
        const user = new User(userData);
        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe(userData.id);
        expect(user.fullName).toBe(userData.fullName);
        expect(user.email).toBe(userData.email);
    })

    it('should allow changing the full name (fullName)', () => {
        const user = new User(userData);
        const newFullName = 'Jane Doe';
        user.fullName = newFullName;
        expect(user.fullName).toBe(newFullName);
    })

    it('should allow changing the email', () => {
        const user = new User(userData);
        const newEmail = 'joane@example.com';
        user.email = newEmail;
        expect(user.email).toBe(newEmail);
    })

        it('should throw an error when creating a user with invalid email', () => {
        const invalidUserData = { ...userData, email: 'invalid-email' };
        expect(() => new User(invalidUserData)).toThrow('Invalid email format');
    })

    it('should throw an error when setting an invalid email', () => {
        const user = new User(userData);
        expect(() => { user.email = 'invalid-email' }).toThrow('Invalid email format');
    })

    it('should throw an error when creating a user with invalid password', () => {
        const invalidPasswordData = { ...userData, password: 'weak' };
        expect(() => new User(invalidPasswordData)).toThrow('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
    })

    it('should correctly verify a matching password', () => {
        const user = new User(userData);
        expect(user.checkPassword('@Teste123')).toBe(true);
    })

    it('should correctly reject a non-matching password', () => {
        const user = new User(userData);
        expect(user.checkPassword('WrongPassword123!')).toBe(false);
    }) 
}) 

describe('static email validation', () => {

    it('should not throw for valid emails', () => {
        expect(() => User.checkEmailIsValid('valid@example.com')).not.toThrow('Invalid email format');
    })

    it('should throw for emails without @', () => {
        expect(() => User.checkEmailIsValid('invalidemail.com')).toThrow('Invalid email format');
    })

    it('should throw for emails without domain', () => {
        expect(() => User.checkEmailIsValid('invalid@')).toThrow('Invalid email format');
    })
})

describe('static password validation', () => {
    it('should not throw for valid passwords', () => {
        expect(() => User.checkPasswordIsValid('@Teste123')).not.toThrow('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
    })

    it('should throw for passwords without uppercase letter', () => {
        expect(() => User.checkPasswordIsValid('@teste123')).toThrow('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
    })

    it('should throw for passwords without lowercase letter', () => {
        expect(() => User.checkPasswordIsValid('@TESTE123')).toThrow('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
    })

    it('should throw for passwords without number', () => {
        expect(() => User.checkPasswordIsValid('@TesteAbc')).toThrow('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
    })

    it('should throw for passwords without special character', () => {
        expect(() => User.checkPasswordIsValid('Teste123')).toThrow('Password must have at least one uppercase letter, one lowercase letter, one number and one special character');
    })
})
