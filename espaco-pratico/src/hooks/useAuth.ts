'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userServices";
import { useToast } from "@/contexts/ToastContext";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const router = useRouter();
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: LoginErrors = {};
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const loggedUser = await userService.login({ email, password });

      if (loggedUser.statusCode === 401) {
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errors,
    handleLogin,
    validateForm
  };
}