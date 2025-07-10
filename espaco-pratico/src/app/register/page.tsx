'use client';

import Button from "@/components/button/Button";
import Input from "@/components/Input/Input";

export default function RegisterPage() {

    return (
        <form role="form" className="authentication">
            <h1>Login</h1>
            <div className="authentication-form">
                <div className="input-container">
                    <Input
                        placeholder="Nome completo..."
                        type="text"
                        required
                    />
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Email universitário..."
                        type="text"
                        required
                    />
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Criar senha..."
                        type="password"
                        required
                    />
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Confirmar senha..."
                        type="password"
                        required
                    />
                </div>
            </div>
            <Button
                type="submit"
            >
                Criar conta
            </Button>
        </form>
    );
}