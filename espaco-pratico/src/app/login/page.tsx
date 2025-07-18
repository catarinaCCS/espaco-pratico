'use client';

import Button from "@/components/button/Button";
import Input from "@/components/Input/Input";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        errors,
        handleLogin,
    } = useAuth();

    return (
        <form role="form" onSubmit={handleLogin} className="authentication">
            <h1>Login</h1>
            <div className="authentication-form">
                <div className="input-container">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
            </div>
            <Button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Entrando..." : "Entrar na conta"}
            </Button>
            <div className="mt-4">
                <Link href="/register">
                    <Button type="button" className="secondary-button">
                        Criar uma conta
                    </Button>
                </Link>
            </div>
        </form>
    );
}