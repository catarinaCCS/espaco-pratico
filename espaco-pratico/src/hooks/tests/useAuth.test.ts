import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userServices';
import { useToast } from '@/contexts/ToastContext';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/services/userServices', () => ({
    userService: {
        login: jest.fn(),
    },
}));

jest.mock('@/contexts/ToastContext', () => ({
    useToast: jest.fn(),
}));

const mockPush = jest.fn();
const mockShowToast = jest.fn();
const mockPreventDefault = jest.fn();

function createMockEvent() {
    return {
        preventDefault: mockPreventDefault,
    } as unknown as React.FormEvent;
}

function setupValidCredentials(result: any) {
    act(() => {
        result.current.setEmail('valid@example.com');
        result.current.setPassword('password123');
    });
}

async function executeLogin(result: any, event: any) {
    await act(async () => {
        await result.current.handleLogin(event);
    });
}

beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
    });

    (useToast as jest.Mock).mockReturnValue({
        showToast: mockShowToast,
    });
});

describe('useAuth', () => {
    it('should initialize with empty values and no errors', () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current.email).toBe('');
        expect(result.current.password).toBe('');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.errors).toEqual({});
    });

    it('should update email when setEmail is called', () => {
        const { result } = renderHook(() => useAuth());

        act(() => {
            result.current.setEmail('test@example.com');
        });

        expect(result.current.email).toBe('test@example.com');
    });

    it('should update password when setPassword is called', () => {
        const { result } = renderHook(() => useAuth());

        act(() => {
            result.current.setPassword('password123');
        });

        expect(result.current.password).toBe('password123');
    });

    describe('validateForm', () => {
        it('should validate form correctly with all cases', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.setEmail('');
                result.current.setPassword('');
            });

            let isValid;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.email).toBe('Email é obrigatório');
            expect(result.current.errors.password).toBe('Senha é obrigatória');

            setupValidCredentials(result);

            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(result.current.errors).toEqual({});
        });

        it('should clear errors when form becomes valid', async () => {
            const { result } = renderHook(() => useAuth());
            const mockEvent = createMockEvent();

            await executeLogin(result, mockEvent);
            expect(result.current.errors.email).toBeDefined();

            setupValidCredentials(result);
            (userService.login as jest.Mock).mockResolvedValue({ statusCode: 200 });

            await executeLogin(result, mockEvent);
            expect(result.current.errors).toEqual({});
        });

        it('should show multiple errors when both email and password are invalid', async () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.setEmail('invalid-email');
            });

            const mockEvent = createMockEvent();
            await executeLogin(result, mockEvent);

            expect(result.current.errors.email).toBe('Email inválido');
            expect(result.current.errors.password).toBe('Senha é obrigatória');
        });
    });

    describe('form validation failures', () => {
        it('should set email error when email is empty', async () => {
            const { result } = renderHook(() => useAuth());
            const mockEvent = createMockEvent();

            await executeLogin(result, mockEvent);

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(result.current.errors.email).toBe('Email é obrigatório');
        });

        it('should set email error when email format is invalid', async () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.setEmail('invalid-email');
            });

            const mockEvent = createMockEvent();
            await executeLogin(result, mockEvent);

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(result.current.errors.email).toBe('Email inválido');
        });

        it('should set password error when password is empty', async () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.setEmail('valid@example.com');
            });

            const mockEvent = createMockEvent();
            await executeLogin(result, mockEvent);

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(result.current.errors.password).toBe('Senha é obrigatória');
        });

        it('should not call userService.login when form is invalid', async () => {
            const { result } = renderHook(() => useAuth());
            const mockEvent = createMockEvent();

            await executeLogin(result, mockEvent);

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(userService.login).not.toHaveBeenCalled();
        });

        it('should not set loading state when form validation fails', async () => {
            const { result } = renderHook(() => useAuth());
            const mockEvent = createMockEvent();

            expect(result.current.isLoading).toBe(false);
            await executeLogin(result, mockEvent);

            expect(result.current.isLoading).toBe(false);
            expect(userService.login).not.toHaveBeenCalled();
        });
    });

    describe('handleLogin', () => {
        it('should call userService.login with correct credentials when form is valid', async () => {
            const { result } = renderHook(() => useAuth());
            (userService.login as jest.Mock).mockResolvedValue({
                statusCode: 200,
                message: 'Login successful'
            });

            setupValidCredentials(result);
            const mockEvent = createMockEvent();
            await executeLogin(result, mockEvent);

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(userService.login).toHaveBeenCalledWith({
                email: 'valid@example.com',
                password: 'password123'
            });
        });

        describe('status code handling', () => {
            const testCases = [
                {
                    description: 'should show success toast and redirect to home page on successful login',
                    statusCode: 200,
                    expectedMessage: 'Login realizado com sucesso!',
                    toastType: 'success',
                    shouldRedirect: true
                },
                {
                    description: 'should show error toast when credentials are invalid (401)',
                    statusCode: 401,
                    expectedMessage: 'Email ou senha inválidos.',
                    toastType: 'error',
                    shouldRedirect: false
                },
                {
                    description: 'should show error toast when server error occurs (500)',
                    statusCode: 500,
                    expectedMessage: 'Erro ao realizar login. Tente novamente mais tarde.',
                    toastType: 'error',
                    shouldRedirect: false
                }
            ];

            testCases.forEach(({ description, statusCode, expectedMessage, toastType, shouldRedirect }) => {
                it(description, async () => {
                    const { result } = renderHook(() => useAuth());

                    (userService.login as jest.Mock).mockResolvedValue({
                        statusCode,
                        message: 'Server message'
                    });

                    setupValidCredentials(result);
                    const mockEvent = createMockEvent();
                    await executeLogin(result, mockEvent);

                    expect(mockShowToast).toHaveBeenCalledWith(expectedMessage, toastType);
                    if (shouldRedirect) {
                        expect(mockPush).toHaveBeenCalledWith('/subjects');
                    } else {
                        expect(mockPush).not.toHaveBeenCalled();
                    }
                });
            });

            it('should handle unknown status codes from server correctly', async () => {
                const { result } = renderHook(() => useAuth());

                (userService.login as jest.Mock).mockResolvedValue({
                    statusCode: 403,
                    message: 'Forbidden'
                });

                setupValidCredentials(result);
                const mockEvent = createMockEvent();
                await executeLogin(result, mockEvent);

                expect(result.current.isLoading).toBe(false);
                expect(mockShowToast).not.toHaveBeenCalled();
                expect(mockPush).not.toHaveBeenCalled();
            });
        });

        it('should handle unexpected errors during login', async () => {
            const { result } = renderHook(() => useAuth());

            (userService.login as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            setupValidCredentials(result);
            const mockEvent = createMockEvent();
            await executeLogin(result, mockEvent);

            expect(mockShowToast).toHaveBeenCalledWith('Erro ao realizar login. Tente novamente mais tarde.', 'error');
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('Loading state', () => {
        it('should set isLoading to true while processing login and false after completion', async () => {
            const { result } = renderHook(() => useAuth());

            let resolveLogin: (value: any) => void;
            const loginPromise = new Promise(resolve => {
                resolveLogin = resolve;
            });

            (userService.login as jest.Mock).mockReturnValue(loginPromise);

            setupValidCredentials(result);
            const mockEvent = createMockEvent();

            expect(result.current.isLoading).toBe(false);

            let handleLoginPromise: Promise<void>;
            act(() => {
                handleLoginPromise = result.current.handleLogin(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(true);
            });

            act(() => {
                resolveLogin({ statusCode: 200 });
            });

            await act(async () => {
                await handleLoginPromise;
            });

            expect(result.current.isLoading).toBe(false);
        });
    });
});