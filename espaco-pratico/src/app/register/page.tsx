'use client';

import Button from "@/components/button/Button";
import Input from "@/components/Input/Input";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function RegisterPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        fullName,
        setFullName,
        confirmPassword,
        setConfirmPassword,
        errors,
        handleRegister,
        isLoading
    } = useAuth();

    return (
        <form role="form" className="authentication" onSubmit={handleRegister} >
            <h1>Register</h1>
            <div className="authentication-form">
                <div className="input-container">
                    <Input
                        placeholder="Nome completo..."
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                        required
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Email universitário..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Criar senha..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <div className="input-container">
                    <Input
                        placeholder="Confirmar senha..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        required
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
            </div>
            <Button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
            <div className="mt-4">
                <Link href="/login">
                    <Button type="button" className="secondary-button">
                        Já tenho conta
                    </Button>
                </Link>
            </div>
        </form>
    );
}