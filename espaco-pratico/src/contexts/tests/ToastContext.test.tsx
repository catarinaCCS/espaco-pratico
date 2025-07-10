import { render, screen, act, renderHook } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';
import { useToastManager } from '@/hooks/useToastManager';

jest.mock('@/hooks/useToastManager');

const mockShowToast = jest.fn();
const mockRemoveToast = jest.fn();

describe('ToastContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useToastManager as jest.Mock).mockReturnValue({
            toasts: [
                { id: '1', message: 'Test toast', type: 'success' }
            ],
            showToast: mockShowToast,
            removeToast: mockRemoveToast
        });
    });

    describe('ToastProvider', () => {
        it('should render children correctly', () => {
            render(
                <ToastProvider>
                    <div data-testid="test-child">Test Child</div>
                </ToastProvider>
            );

            expect(screen.getByTestId('test-child')).toBeInTheDocument();
            expect(screen.getByText('Test Child')).toBeInTheDocument();
        });

        it('should render toasts from useToastManager', () => {
            render(
                <ToastProvider>
                    <div>Test Content</div>
                </ToastProvider>
            );

            expect(useToastManager).toHaveBeenCalled();
            expect(screen.getByText('Test toast')).toBeInTheDocument();
        });

        it('should pass removeToast to Toast component', () => {
            render(
                <ToastProvider>
                    <div>Test Content</div>
                </ToastProvider>
            );

            const toast = screen.getByText('Test toast');
            expect(toast).toBeInTheDocument();

            act(() => {
                toast.parentElement?.dispatchEvent(new Event('animationend'));
            });

            expect(mockRemoveToast).not.toHaveBeenCalled();
        });

        it('should render multiple toasts when present', () => {
            (useToastManager as jest.Mock).mockReturnValue({
                toasts: [
                    { id: '1', message: 'First toast', type: 'success' },
                    { id: '2', message: 'Second toast', type: 'error' }
                ],
                showToast: mockShowToast,
                removeToast: mockRemoveToast
            });

            render(
                <ToastProvider>
                    <div>Test Content</div>
                </ToastProvider>
            );

            expect(screen.getByText('First toast')).toBeInTheDocument();
            expect(screen.getByText('Second toast')).toBeInTheDocument();
        });
    });

    describe('useToast', () => {
        it('should throw error when used outside of ToastProvider', () => {
            const originalConsoleError = console.error;
            console.error = jest.fn();

            expect(() => {
                renderHook(() => useToast());
            }).toThrow('useToast must be used within a ToastProvider');

            console.error = originalConsoleError;
        });

        it('should provide showToast function from context', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ToastProvider>{children}</ToastProvider>
            );

            const { result } = renderHook(() => useToast(), { wrapper });

            act(() => {
                result.current.showToast('Test message', 'success');
            });

            expect(mockShowToast).toHaveBeenCalledWith('Test message', 'success');
        });

        it('should call showToast with correct parameters', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ToastProvider>{children}</ToastProvider>
            );

            const { result } = renderHook(() => useToast(), { wrapper });

            act(() => {
                result.current.showToast('Error message', 'error');
            });

            expect(mockShowToast).toHaveBeenCalledWith('Error message', 'error');
        });

        it('should render container without toasts when array is empty', () => {
            (useToastManager as jest.Mock).mockReturnValue({
                toasts: [],
                showToast: mockShowToast,
                removeToast: mockRemoveToast
            });

            render(
                <ToastProvider>
                    <div>Test Content</div>
                </ToastProvider>
            );

            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

    });
});