'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { userService } from "@/services/userServices";
import { useToast } from "@/contexts/ToastContext";
import { log } from "console";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{email?: string, password?: string}>({});
    const router = useRouter();
    const { showToast } = useToast();

    const validateForm = () => {
        const newErrors: {email?: string, password?: string} = {};
        let isValid = true;

        if (!email) {
            newErrors.email = "Email é obrigatório";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Email inválido";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Senha é obrigatória";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {

            const loggedUser =  await userService.login({ email, password });

            if( loggedUser.statusCode === 401) {
                showToast("Email ou senha inválidos.", "error");
                return;
            }

            if (loggedUser.statusCode === 500) {
                showToast("Erro ao realizar login. Tente novamente mais tarde.", "error");
                return;
            }
            
            if (loggedUser.statusCode === 200) {
                showToast("Login realizado com sucesso!", "success");
                router.push("/");
            }
            
        } catch (error) {

            console.error("Erro ao realizar login:", error);
            showToast("Erro ao realizar login. Tente novamente mais tarde.", "error");
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="authentication">
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
        </form>
    );
}