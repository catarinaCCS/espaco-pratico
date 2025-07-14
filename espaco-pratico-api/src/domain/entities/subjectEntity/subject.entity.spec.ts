import { TSubjectProperties, Subject } from "./subject.entity";

describe('Subject instance validation', () => {
    const subjectData: TSubjectProperties = {
        id: '1',
        fullName: 'Mathematics'
    };
    
    it('should create a new Subject instance with the provided data', () => {
        const subject = new Subject(subjectData);
        expect(subject).toBeInstanceOf(Subject);
        expect(subject.id).toBe(subjectData.id);
        expect(subject.fullName).toBe(subjectData.fullName);
    });

    it('should allow changing the full name', () => {
        const subject = new Subject(subjectData);
        const newFullName = 'Advanced Mathematics';
        subject.fullName = newFullName;
        expect(subject.fullName).toBe(newFullName);
    });

    it('should throw an error when creating a subject with name shorter than 3 characters', () => {
        const invalidSubjectData = { ...subjectData, fullName: 'Ma' };
        expect(() => new Subject(invalidSubjectData)).toThrow('Name must be at least 3 characters long.');
    });

    it('should throw an error when setting a name shorter than 3 characters', () => {
        const subject = new Subject(subjectData);
        expect(() => { subject.fullName = 'Ma' }).toThrow('Name must be at least 3 characters long.');
    });

    it('should throw an error when creating a subject with name longer than 100 characters', () => {
        const longName = 'a'.repeat(101);
        const invalidSubjectData = { ...subjectData, fullName: longName };
        expect(() => new Subject(invalidSubjectData)).toThrow('Name must be at most 100 characters long.');
    });

    it('should throw an error when setting a name longer than 100 characters', () => {
        const subject = new Subject(subjectData);
        const longName = 'a'.repeat(101);
        expect(() => { subject.fullName = longName }).toThrow('Name must be at most 100 characters long.');
    });

    it('should throw an error when creating a subject with empty name', () => {
        const invalidSubjectData = { ...subjectData, fullName: '' };
        expect(() => new Subject(invalidSubjectData)).toThrow('Name must be at least 3 characters long.');
    });
});

describe('static name validation', () => {
    it('should not throw for valid names', () => {
        expect(() => Subject.checkNameIsValid('Mathematics')).not.toThrow();
    });

    it('should throw for names shorter than 3 characters', () => {
        expect(() => Subject.checkNameIsValid('Ma')).toThrow('Name must be at least 3 characters long.');
    });

    it('should throw for names longer than 100 characters', () => {
        const longName = 'a'.repeat(101);
        expect(() => Subject.checkNameIsValid(longName)).toThrow('Name must be at most 100 characters long.');
    });

    it('should throw for empty names', () => {
        expect(() => Subject.checkNameIsValid('')).toThrow('Name must be at least 3 characters long.');
    });

    it('should throw for null or undefined names', () => {
        expect(() => Subject.checkNameIsValid(null as unknown as string)).toThrow('Name must be at least 3 characters long.');
        expect(() => Subject.checkNameIsValid(undefined as unknown as string)).toThrow('Name must be at least 3 characters long.');
    });
});