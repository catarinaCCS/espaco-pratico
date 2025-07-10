import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('should render the input with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const inputElement = screen.getByPlaceholderText(/Enter text/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('should call onChange handler when text is entered', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'New value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should accept and display a value', () => {
    render(<Input value="Initial value" />);
    const inputElement = screen.getByDisplayValue(/Initial value/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('should pass additional props to the input element', () => {
    render(<Input aria-label="custom-label" />);
    const inputElement = screen.getByLabelText(/custom-label/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('should set the input type correctly', () => {
    render(<Input type="email" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('type', 'email');
  });

  it('should pass custom className to the input element', () => {
    render(<Input className="my-custom-class" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('my-custom-class');
  });
  
  it('should handle undefined value and placeholder props', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue('');
    expect(inputElement).not.toHaveAttribute('placeholder');
  });

  it('should handle empty string value and placeholder props', () => {
    render(<Input value="" placeholder="" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue('');
    expect(inputElement).toHaveAttribute('placeholder', '');
});

  it('should render as disabled when disabled prop is provided', () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });

  it('should work as a controlled component with value and onChange', () => {
    const handleChange = jest.fn();
    const { rerender } = render(<Input value="Initial" onChange={handleChange} />);
    const inputElement = screen.getByDisplayValue('Initial');
  
    fireEvent.change(inputElement, { target: { value: 'New value' } });
  
    expect(handleChange).toHaveBeenCalledTimes(1);
  
    rerender(<Input value="New value" onChange={handleChange} />);
    expect(screen.getByDisplayValue('New value')).toBeInTheDocument();
  })
});