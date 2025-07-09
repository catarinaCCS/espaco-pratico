import { renderHook, act } from '@testing-library/react';
import { useToastManager } from '../useToastManager';
import { ToastType } from '@/components/Toast/Toast';

const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
const originalRandomUUID = crypto.randomUUID;

beforeEach(() => {
    crypto.randomUUID = jest.fn().mockReturnValue(mockUUID);
});

afterEach(() => {
    crypto.randomUUID = originalRandomUUID;
});

describe('useToastManager', () => {
    it('should initialize with empty toasts array', () => {
        const { result } = renderHook(() => useToastManager());

        expect(result.current.toasts).toEqual([]);
    });

    describe('showToast', () => {
        it('should add a new toast with the provided message and type', () => {
            const { result } = renderHook(() => useToastManager());
            const message = 'Test message';
            const type: ToastType = 'success';

            act(() => {
                result.current.showToast(message, type);
            });

            expect(result.current.toasts).toEqual([
                { id: mockUUID, message, type }
            ]);
        });

        it('should add multiple toasts when called multiple times', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('First message', 'success');
            });

            const secondUUID = '987f6543-e21b-12d3-a456-426614174000';
            crypto.randomUUID = jest.fn().mockReturnValue(secondUUID);

            act(() => {
                result.current.showToast('Second message', 'error');
            });

            expect(result.current.toasts).toEqual([
                { id: mockUUID, message: 'First message', type: 'success' },
                { id: secondUUID, message: 'Second message', type: 'error' }
            ]);
        });

        it('should preserve existing toasts when adding a new one', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('First message', 'success');
            });

            const initialToasts = [...result.current.toasts];

            const secondUUID = '987f6543-e21b-12d3-a456-426614174000';
            crypto.randomUUID = jest.fn().mockReturnValue(secondUUID);

            act(() => {
                result.current.showToast('Second message', 'error');
            });

            expect(result.current.toasts[0]).toEqual(initialToasts[0]);
        });
    });

    describe('removeToast', () => {
        it('should remove a toast with the specified id', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('Test message', 'success');
            });

            expect(result.current.toasts.length).toBe(1);

            act(() => {
                result.current.removeToast(mockUUID);
            });

            expect(result.current.toasts).toEqual([]);
        });

        it('should only remove the toast with the matching id', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('First message', 'success');
            });

            const secondUUID = '987f6543-e21b-12d3-a456-426614174000';
            crypto.randomUUID = jest.fn().mockReturnValue(secondUUID);

            act(() => {
                result.current.showToast('Second message', 'error');
            });

            act(() => {
                result.current.removeToast(mockUUID);
            });

            expect(result.current.toasts).toEqual([
                { id: secondUUID, message: 'Second message', type: 'error' }
            ]);
        });

        it('should do nothing when trying to remove a non-existent toast id', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('Test message', 'success');
            });

            act(() => {
                result.current.removeToast('non-existent-id');
            });

            expect(result.current.toasts).toEqual([
                { id: mockUUID, message: 'Test message', type: 'success' }
            ]);
        });

        it('should handle removing from an empty toasts array', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.removeToast('any-id');
            });

            expect(result.current.toasts).toEqual([]);
        });
    });

    describe('toast types', () => {
        it('should correctly handle success toast type', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('Success message', 'success');
            });

            expect(result.current.toasts[0].type).toBe('success');
        });

        it('should correctly handle error toast type', () => {
            const { result } = renderHook(() => useToastManager());

            act(() => {
                result.current.showToast('Error message', 'error');
            });

            expect(result.current.toasts[0].type).toBe('error');
        });
    });
});