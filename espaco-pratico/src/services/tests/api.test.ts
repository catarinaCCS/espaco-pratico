import axios from 'axios';

jest.mock('axios', () => ({
    create: jest.fn(() => mockAxiosInstance)
}));

const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

const originalEnv = process.env;

beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_API_URL;
});

afterAll(() => {
    process.env = originalEnv;
});

describe('Configuration', () => {
    it('should create axios instance with default base URL when environment variable is not set', () => {
        delete process.env.NEXT_PUBLIC_API_URL;

        jest.isolateModules(() => {
            require('../api');
        });

        expect(axios.create).toHaveBeenCalledWith({
            baseURL: 'http://localhost:3000',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should create axios instance with environment variable base URL when it is set', () => {
        process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';

        jest.isolateModules(() => {
            require('../api');
        });

        expect(axios.create).toHaveBeenCalledWith({
            baseURL: 'https://api.example.com',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should set Content-Type header to application/json', () => {
        jest.isolateModules(() => {
            require('../api');
        });

        expect(axios.create).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            })
        );
    });
});

describe('API Instance', () => {
    it('should export the created axios instance', () => {
        const sut = require('../api').default;

        expect(sut).toBeDefined();
        expect(axios.create).toHaveBeenCalled();
    });
});