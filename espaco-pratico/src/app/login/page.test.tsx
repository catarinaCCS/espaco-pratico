import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockHandleLogin = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  
  (useAuth as jest.Mock).mockReturnValue({
    email: '',
    setEmail: mockSetEmail,
    password: '',
    setPassword: mockSetPassword,
    isLoading: false,
    errors: {},
    handleLogin: mockHandleLogin,
  });
  
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
});

describe('LoginPage', () => {

  it('should render login form with title', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar na conta/i })).toBeInTheDocument();
  });

  it('should update email when input changes', () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('Email');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should update password when input changes', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('Senha');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(mockSetPassword).toHaveBeenCalledWith('password123');
  });

  it('should display loading state when isLoading is true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: true,
      errors: {},
      handleLogin: mockHandleLogin,
    });

    render(<LoginPage />);

    expect(screen.getByRole('button', { name: /Entrando.../i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should display email error message when present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: false,
      errors: { email: 'Email é obrigatório' },
      handleLogin: mockHandleLogin,
    });
    
    render(<LoginPage />);
    
    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
  });

  it('should display password error message when present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: false,
      errors: { password: 'Senha é obrigatória' },
      handleLogin: mockHandleLogin,
    });

    render(<LoginPage />);

    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
  });

  it('should display both error messages when both are present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: false,
      errors: { 
        email: 'Email é obrigatório',
        password: 'Senha é obrigatória'
      },
      handleLogin: mockHandleLogin,
    });

    render(<LoginPage />);
    
    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
  });

  it('should render with pre-filled email and password values', () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      setEmail: mockSetEmail,
      password: 'password123',
      setPassword: mockSetPassword,
      isLoading: false,
      errors: {},
      handleLogin: mockHandleLogin,
    });
    
    render(<LoginPage />);

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
  });

  it('should have required attribute on input fields', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Senha');
    
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('should call handleLogin when form is submitted', () => {
    render(<LoginPage />);
    const form = screen.getByRole('form');
    
    fireEvent.submit(form);
    
    expect(mockHandleLogin).toHaveBeenCalled();
  });

  it('should use correct input types for email and password', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Senha');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  
  it('should handle form submission with valid data', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      email: 'valid@example.com',
      setEmail: mockSetEmail,
      password: 'validPassword123',
      setPassword: mockSetPassword,
      isLoading: false,
      errors: {},
      handleLogin: mockHandleLogin,
    });
    
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /Entrar na conta/i });
    
    fireEvent.click(submitButton);
    
    expect(mockHandleLogin).toHaveBeenCalled();
  });
});
