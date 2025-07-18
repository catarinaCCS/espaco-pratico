import api from './api';

interface Subject {
    _id: string;
    _fullName: string;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    data?: Subject[]
}

export const subjectServices = {
    async listSubjects(): Promise<ApiResponse> {
        try {

            const response = await api.get('/subjects/list');
            return response.data;


        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('400')) {
                    return {
                        statusCode: 400,
                        message: "Erro ao listar disciplinas."
                    };
                }

                if (error.message.includes('500')) {
                    return {
                        statusCode: 500,
                        message: "Erro interno do servidor. Tente novamente mais tarde."
                    };
                }

                return {
                    statusCode: 500,
                    message: "Erro desconhecido. Tente novamente mais tarde."
                };
            } else {
                return {
                    statusCode: 500,
                    message: "Erro desconhecido. Tente novamente mais tarde."
                };
            }
        }
    },
};