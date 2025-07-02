'use client';

interface InputProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export default function Button(props: InputProps) {
    return (
        <button 
            onClick={props.onClick}
        >
            {props.children }
        </button>
    );
}