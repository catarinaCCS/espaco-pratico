export type TSubjectProperties = {
    id: string;
    fullName: string;
};

export class Subject {
    private readonly _id: string;
    private _fullName: string;

    constructor(props: TSubjectProperties) {
        this._id = props.id;

        Subject.checkNameIsValid(props.fullName);
        this._fullName = props.fullName;
    }

    get id(): string {
        return this._id;
    }

    get fullName(): string {
        return this._fullName;
    }

    set fullName(value: string) {
        Subject.checkNameIsValid(value);
        this._fullName = value;
    }

    static checkNameIsValid(fullName: string): void {
        if (!fullName || fullName.length < 3) {
            throw new Error("Name must be at least 3 characters long.");
        }

        if (fullName.length > 100) {
            throw new Error("Name must be at most 100 characters long.");
        }
    }

}