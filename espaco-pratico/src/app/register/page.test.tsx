import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockHandleRegister = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSetFullName = jest.fn();
const mockSetConfirmPassword = jest.fn();
const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useAuth as jest.Mock).mockReturnValue({
    email: '',
    setEmail: mockSetEmail,
    password: '',
    setPassword: mockSetPassword,
    fullName: '',
    setFullName: mockSetFullName,
    confirmPassword: '',
    setConfirmPassword: mockSetConfirmPassword,
    isLoading: false,
    errors: {},
    handleRegister: mockHandleRegister,
  });

  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
});

describe('RegisterPage', () => {
  it('should render registration form with title', () => {
    render(<RegisterPage />);

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome completo...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email universitário...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Criar senha...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmar senha...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar conta/i })).toBeInTheDocument();
  });

  it('should update fullName when input changes', () => {
    render(<RegisterPage />);
    const fullNameInput = screen.getByPlaceholderText('Nome completo...');

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

    expect(mockSetFullName).toHaveBeenCalledWith('John Doe');
  });

  it('should update email when input changes', () => {
    render(<RegisterPage />);
    const emailInput = screen.getByPlaceholderText('Email universitário...');

    fireEvent.change(emailInput, { target: { value: 'john@university.edu' } });

    expect(mockSetEmail).toHaveBeenCalledWith('john@university.edu');
  });

  it('should update password when input changes', () => {
    render(<RegisterPage />);
    const passwordInput = screen.getByPlaceholderText('Criar senha...');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockSetPassword).toHaveBeenCalledWith('password123');
  });

  it('should update confirmPassword when input changes', () => {
    render(<RegisterPage />);
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar senha...');

    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(mockSetConfirmPassword).toHaveBeenCalledWith('password123');
  });

  it('should display loading state when isLoading is true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      fullName: '',
      setFullName: mockSetFullName,
      confirmPassword: '',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: true,
      errors: {},
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByRole('button', { name: /Criando conta.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criando conta.../i })).toBeDisabled();
  });

  it('should display fullName error message when present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      fullName: '',
      setFullName: mockSetFullName,
      confirmPassword: '',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: { fullName: 'Nome completo é obrigatório' },
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByText('Nome completo é obrigatório')).toBeInTheDocument();
  });

  it('should display email error message when present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      fullName: '',
      setFullName: mockSetFullName,
      confirmPassword: '',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: { email: 'Email é obrigatório' },
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
  });

  it('should display password error message when present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      fullName: '',
      setFullName: mockSetFullName,
      confirmPassword: '',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: { password: 'Senha é obrigatória' },
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
  });

  it('should display confirmPassword error message when present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      fullName: '',
      setFullName: mockSetFullName,
      confirmPassword: '',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: { confirmPassword: 'As senhas não coincidem' },
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
  });

  it('should display multiple error messages when multiple errors are present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      fullName: '',
      setFullName: mockSetFullName,
      confirmPassword: '',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: {
        email: 'Email é obrigatório',
        password: 'Senha é obrigatória',
        fullName: 'Nome completo é obrigatório',
        confirmPassword: 'As senhas não coincidem'
      },
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Nome completo é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
  });

  it('should render with pre-filled form values', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: 'john@university.edu',
      setEmail: mockSetEmail,
      password: 'password123',
      setPassword: mockSetPassword,
      fullName: 'John Doe',
      setFullName: mockSetFullName,
      confirmPassword: 'password123',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: {},
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);

    expect(screen.getByPlaceholderText('Nome completo...')).toHaveValue('John Doe');
    expect(screen.getByPlaceholderText('Email universitário...')).toHaveValue('john@university.edu');
    expect(screen.getByPlaceholderText('Criar senha...')).toHaveValue('password123');
    expect(screen.getByPlaceholderText('Confirmar senha...')).toHaveValue('password123');
  });

  it('should have required attribute on all input fields', () => {
    render(<RegisterPage />);

    const fullNameInput = screen.getByPlaceholderText('Nome completo...');
    const emailInput = screen.getByPlaceholderText('Email universitário...');
    const passwordInput = screen.getByPlaceholderText('Criar senha...');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar senha...');

    expect(fullNameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });

  it('should call handleRegister when form is submitted', () => {
    render(<RegisterPage />);
    const form = screen.getByRole('form');

    fireEvent.submit(form);

    expect(mockHandleRegister).toHaveBeenCalled();
  });

  it('should use correct input types for all fields', () => {
    render(<RegisterPage />);

    const fullNameInput = screen.getByPlaceholderText('Nome completo...');
    const emailInput = screen.getByPlaceholderText('Email universitário...');
    const passwordInput = screen.getByPlaceholderText('Criar senha...');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar senha...');

    expect(fullNameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should handle form submission with valid data', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: 'valid@university.edu',
      setEmail: mockSetEmail,
      password: 'validPassword123',
      setPassword: mockSetPassword,
      fullName: 'Valid Name',
      setFullName: mockSetFullName,
      confirmPassword: 'validPassword123',
      setConfirmPassword: mockSetConfirmPassword,
      isLoading: false,
      errors: {},
      handleRegister: mockHandleRegister,
    });

    render(<RegisterPage />);
    const submitButton = screen.getByRole('button', { name: /Criar conta/i });

    fireEvent.click(submitButton);

    expect(mockHandleRegister).toHaveBeenCalled();
  });
});