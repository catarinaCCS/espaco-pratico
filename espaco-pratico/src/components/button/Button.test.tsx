import Button from './Button';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Button Component', () => {
  it('should render the button with children text', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    );
    const buttonElement = screen.getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have disabled attribute when disabled', () => {
    render(<Button disabled>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeDisabled();
  });

  it('should pass additional props to the button element', () => {
    render(<Button aria-label="custom-label">Click Me</Button>);
    const buttonElement = screen.getByLabelText(/custom-label/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render with complex children', () => {
    render(<Button><span data-testid="child-element">Complex Child</span></Button>);
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  it('should apply className prop correctly', () => {
    render(<Button className="custom-btn">Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toHaveClass('custom-btn');
  });

  it('should be enabled by default', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).not.toBeDisabled();
  });

  it('should handle multiple additional props correctly', () => {
    render(
      <Button 
        aria-label="custom-label" 
        data-testid="test-button" 
        title="Button Title"
      >
        Click Me
      </Button>
    );
    
    const buttonElement = screen.getByLabelText(/custom-label/i);
    expect(buttonElement).toHaveAttribute('data-testid', 'test-button');
    expect(buttonElement).toHaveAttribute('title', 'Button Title');
  });

  it('should handle other event handlers correctly', () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();
    
    render(
      <Button 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover Me
      </Button>
    );
    
    const buttonElement = screen.getByText(/Hover Me/i);
    fireEvent.mouseEnter(buttonElement);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(buttonElement);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should render multiple children correctly', () => {
    render(
      <Button>
        <span data-testid="first-child">First</span>
        <span data-testid="second-child">Second</span>
      </Button>
    );
    
    expect(screen.getByTestId("first-child")).toBeInTheDocument();
    expect(screen.getByTestId("second-child")).toBeInTheDocument();
  });
});