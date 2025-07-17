export interface IApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T | T[];
}
export interface IRegisterResponseData {
    id: string;
    fullName: string;
    email: string;
}
export interface ICreateSubjectDTO {
    id: string;
    fullName: string;
}
export type TRegisterResponse = IApiResponse<IRegisterResponseData>;
export type TLoginResponse = IApiResponse<null>;
export type TCreateSubjectResponse = IApiResponse<ICreateSubjectDTO>;
