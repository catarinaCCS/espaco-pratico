'use client';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
} & React.ComponentProps<'button'>;

export default function Button({ children, onClick, disabled, ...props }: ButtonProps) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}