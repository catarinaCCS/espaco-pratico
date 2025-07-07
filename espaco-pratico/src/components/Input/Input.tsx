'use strict';

type InputProps = {
    placeholder?: string;
} & React.ComponentProps<'input'>;

export default function Input({ placeholder, type, ...props }: InputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            {...props}
        />
    );
}