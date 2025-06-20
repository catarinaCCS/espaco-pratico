export interface IApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
}

export interface IErrorResponse {
    statusCode: number;
    message: string;
}

export interface IRegisterResponseData {
    id: string;
    fullName: string;
    email: string;
}

export type TRegisterResponse = IApiResponse<IRegisterResponseData>;
export type TLoginResponse = IApiResponse<null>;

