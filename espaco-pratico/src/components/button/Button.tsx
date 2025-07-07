'use client';

type InputProps = {
    children: React.ReactNode;
    onClick?: () => void;
} & React.ComponentProps<'button'>;

export default function Button({ children, onClick, ...props }: InputProps) {
    return (
        <button 
            onClick={onClick}
            {...props}
        >
            {children }
        </button>
    );
}