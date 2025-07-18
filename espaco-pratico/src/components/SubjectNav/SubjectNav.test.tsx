import { render, screen, fireEvent } from '@testing-library/react';
import { SubjectNav } from './SubjectNav';
import { useSubjects } from '@/contexts/SubjectContext';

jest.mock('@/contexts/SubjectContext');

describe('SubjectNav Component', () => {
  const mockSetSelectedSubject = jest.fn();
  const mockUseSubjects = useSubjects as jest.MockedFunction<typeof useSubjects>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering states', () => {
    it('should render welcome message', () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: false,
        error: '',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText('Bem-vindo!')).toBeInTheDocument();
    });

    it('should render loading state when isLoading is true', () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: true,
        error: '',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText('Carregando disciplinas...')).toBeInTheDocument();
    });

    it('should render error message when error exists', () => {
      const errorMessage = 'Failed to load subjects';
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: false,
        error: errorMessage,
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass('error-message');
    });

    it('should render "Nenhuma disciplina encontrada" when subjects array is empty', () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: false,
        error: '',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText('Nenhuma disciplina encontrada')).toBeInTheDocument();
    });

    it('should render list of subjects when available', () => {
      const mockSubjects = [
        { _id: '1', _fullName: 'Mathematics' },
        { _id: '2', _fullName: 'Physics' },
        { _id: '3', _fullName: 'Chemistry' },
      ];

      mockUseSubjects.mockReturnValue({
        subjects: mockSubjects,
        isLoading: false,
        error: '',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      expect(screen.getByText('Physics')).toBeInTheDocument();
      expect(screen.getByText('Chemistry')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('should call setSelectedSubject when a subject is clicked', () => {
      const mockSubjects = [
        { _id: '1', _fullName: 'Mathematics' },
        { _id: '2', _fullName: 'Physics' },
      ];

      mockUseSubjects.mockReturnValue({
        subjects: mockSubjects,
        isLoading: false,
        error: '',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);
      fireEvent.click(screen.getByText('Mathematics'));

      expect(mockSetSelectedSubject).toHaveBeenCalledWith('1');
    });

    it('should apply active class to selected subject', () => {
      const mockSubjects = [
        { _id: '1', _fullName: 'Mathematics' },
        { _id: '2', _fullName: 'Physics' },
      ];

      mockUseSubjects.mockReturnValue({
        subjects: mockSubjects,
        isLoading: false,
        error: '',
        selectedSubject: '1',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);
      const mathItem = screen.getByText('Mathematics');
      const physicsItem = screen.getByText('Physics');

      expect(physicsItem.parentElement).not.toHaveClass('li-active');
    });
  });

  describe('edge cases', () => {
    it('should handle both loading and error states correctly', () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: true,
        error: 'Some error occurred',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText('Carregando disciplinas...')).toBeInTheDocument();
      expect(screen.queryByText('Some error occurred')).not.toBeInTheDocument();
    });

    it('should not display "Nenhuma disciplina encontrada" when there is an error', () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: false,
        error: 'Failed to load subjects',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.queryByText('Nenhuma disciplina encontrada')).not.toBeInTheDocument();
    });

    it('should handle subjects with long names correctly', () => {
      const mockSubjects = [
        { _id: '1', _fullName: 'A very long subject name that might cause layout issues if not handled properly' },
      ];

      mockUseSubjects.mockReturnValue({
        subjects: mockSubjects,
        isLoading: false,
        error: '',
        selectedSubject: '',
        setSelectedSubject: mockSetSelectedSubject,
      });

      render(<SubjectNav />);

      expect(screen.getByText('A very long subject name that might cause layout issues if not handled properly')).toBeInTheDocument();
    });
  });
});