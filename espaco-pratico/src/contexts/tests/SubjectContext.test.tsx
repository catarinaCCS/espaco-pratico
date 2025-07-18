import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import { SubjectProvider, useSubjects } from '../SubjectContext';
import { subjectServices } from '@/services/subjectServices';

jest.mock('@/services/subjectServices');

describe('SubjectContext', () => {
  const mockSubjects = [
    { _id: '1', _fullName: 'Mathematics' },
    { _id: '2', _fullName: 'Physics' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SubjectProvider', () => {
    it('should fetch subjects on mount', async () => {
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 201,
        data: mockSubjects,
        message: 'Success'
      });

      render(
        <SubjectProvider>
          <div data-testid="child">Test Child</div>
        </SubjectProvider>
      );

      expect(subjectServices.listSubjects).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 201,
        data: [],
        message: 'Success'
      });

      render(
        <SubjectProvider>
          <div data-testid="test-child">Test Child Content</div>
        </SubjectProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Child Content')).toBeInTheDocument();
    });
  });

  describe('useSubjects hook', () => {
    it('should throw error when used outside of SubjectProvider', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useSubjects());
      }).toThrow('useSubjects must be used within a SubjectProvider');

      console.error = originalConsoleError;
    });

    it('should provide subjects data when API call succeeds', async () => {
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 201,
        data: mockSubjects,
        message: 'Success'
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );

      const { result } = renderHook(() => useSubjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.subjects).toEqual(mockSubjects);
      expect(result.current.error).toBe('');
    });

    it('should set error when API call fails', async () => {
      const errorMessage = 'Failed to fetch subjects';
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 500,
        message: errorMessage
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );

      const { result } = renderHook(() => useSubjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.subjects).toEqual([]);
    });

    it('should handle exceptions during API call', async () => {
      (subjectServices.listSubjects as jest.Mock).mockRejectedValue(new Error('Network error'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );

      const { result } = renderHook(() => useSubjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Falha ao buscar disciplinas');
      expect(result.current.subjects).toEqual([]);
    });

    it('should update selectedSubject when setSelectedSubject is called', async () => {
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 201,
        data: mockSubjects,
        message: 'Success'
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );
      const { result } = renderHook(() => useSubjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.selectedSubject).toBe('');

      act(() => {
        result.current.setSelectedSubject('1');
      });

      expect(result.current.selectedSubject).toBe('1');
    });
  });

  describe('loading states', () => {
    it('should set isLoading to true while fetching subjects', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      (subjectServices.listSubjects as jest.Mock).mockReturnValue(promise);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );

      const { result } = renderHook(() => useSubjects(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        resolvePromise({
          statusCode: 201,
          data: mockSubjects,
          message: 'Success'
        });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty subjects array from API', async () => {
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 201,
        data: [],
        message: 'Success'
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );

      const { result } = renderHook(() => useSubjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.subjects).toEqual([]);
      expect(result.current.error).toBe('');
    });

    it('should handle undefined data from API', async () => {
      (subjectServices.listSubjects as jest.Mock).mockResolvedValue({
        statusCode: 201,
        message: 'Success'
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SubjectProvider>{children}</SubjectProvider>
      );

      const { result } = renderHook(() => useSubjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.subjects).toEqual(undefined);
    });
  });
});