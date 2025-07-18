import { render, screen } from '@testing-library/react';
import { SubjectContent } from './SubjectContent';
import { useSubjects } from '@/contexts/SubjectContext';

jest.mock('@/contexts/SubjectContext');

describe('SubjectContent Component', () => {
  const mockUseSubjects = useSubjects as jest.MockedFunction<typeof useSubjects>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering states', () => {
    it('should render default state when no subject is selected', () => {
      mockUseSubjects.mockReturnValue({
        selectedSubject: '',
        subjects: [],
        isLoading: false,
        error: '',
        setSelectedSubject: jest.fn(),
      });

      render(<SubjectContent />);

      expect(screen.getByAltText('Selecione uma disciplina')).toBeInTheDocument();
      expect(screen.getByText('Selecione uma disciplina para exibir os testes disponíveis')).toBeInTheDocument();
    });

    it('should render "em construção" state when a subject is selected', () => {
      mockUseSubjects.mockReturnValue({
        selectedSubject: 'subject-123',
        subjects: [],
        isLoading: false,
        error: '',
        setSelectedSubject: jest.fn(),
      });

      render(<SubjectContent />);

      expect(screen.getByAltText('Em construção')).toBeInTheDocument();
      expect(screen.getByText('Em construção')).toBeInTheDocument();
    });
  });

  describe('structure and layout', () => {
    it('should have the correct CSS class for styling', () => {
      mockUseSubjects.mockReturnValue({
        selectedSubject: '',
        subjects: [],
        isLoading: false,
        error: '',
        setSelectedSubject: jest.fn(),
      });

      const { container } = render(<SubjectContent />);
      const contentDiv = container.firstChild;

      expect(contentDiv).toHaveClass('subjects-content');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string as selectedSubject value', () => {
      mockUseSubjects.mockReturnValue({
        selectedSubject: '',
        subjects: [],
        isLoading: false,
        error: '',
        setSelectedSubject: jest.fn(),
      });

      render(<SubjectContent />);

      expect(screen.getByAltText('Selecione uma disciplina')).toBeInTheDocument();
    });
  });
});