import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

describe('Toast Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render with the provided message', () => {
        const mockOnClose = jest.fn();
        render(
            <Toast message="Test message" type="success" onClose={mockOnClose} />
        );

        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should apply the correct type class', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="Success toast" type="success" onClose={mockOnClose} />
        );

        expect(container.firstChild).toHaveClass('toast');
        expect(container.firstChild).toHaveClass('success');
    });

    it('should apply error class when type is error', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="Error toast" type="error" onClose={mockOnClose} />
        );

        expect(container.firstChild).toHaveClass('toast');
        expect(container.firstChild).toHaveClass('error');
    });

    it('should have visible class when initially rendered', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="Test message" type="success" onClose={mockOnClose} />
        );

        expect(container.firstChild).toHaveClass('visible');
        expect(container.firstChild).not.toHaveClass('hidden');
    });

    it('should change to hidden class after duration', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="Test message" type="success" onClose={mockOnClose} />
        );

        expect(container.firstChild).toHaveClass('visible');

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(container.firstChild).toHaveClass('hidden');
        expect(container.firstChild).not.toHaveClass('visible');
    });

    it('should call onClose after duration + animation time', () => {
        const mockOnClose = jest.fn();
        render(
            <Toast message="Test message" type="success" onClose={mockOnClose} />
        );

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(mockOnClose).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should respect custom duration', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="Test message" type="success" duration={5000} onClose={mockOnClose} />
        );

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(mockOnClose).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(container.firstChild).toHaveClass('hidden');
    });

    it('should clean up timers on unmount', () => {
        const mockOnClose = jest.fn();
        const { unmount } = render(
            <Toast message="Test message" type="success" onClose={mockOnClose} />
        );

        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();

        clearTimeoutSpy.mockRestore();
    });

    it('should render with the correct structure', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="Test message" type="success" onClose={mockOnClose} />
        );

        const toastElement = container.firstChild;
        expect(toastElement).toHaveClass('toast');

        const contentElement = toastElement?.firstChild;
        expect(contentElement).toHaveClass('toast-content');

        const messageElement = screen.getByText('Test message');
        expect(messageElement).toBeInTheDocument();
    });

    it('should handle empty message gracefully', () => {
        const mockOnClose = jest.fn();
        const { container } = render(
            <Toast message="" type="success" onClose={mockOnClose} />
        );

        expect(container.querySelector('.toast')).toBeInTheDocument();
        expect(container.querySelector('.toast-content')).toBeInTheDocument();
    });
});