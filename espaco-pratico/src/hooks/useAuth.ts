'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userServices";
import { useToast } from "@/contexts/ToastContext";

interface LoginForm {
  email: string;
  password: string;
}

interface AuthErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
}

export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName
  ] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const router = useRouter();
  const { showToast } = useToast();

  const validateLoginForm = () => {
    const newErrors: AuthErrors = {};
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

  const validateRegisterForm = () => {
    const newErrors: AuthErrors = {};
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

    if (!fullName) {
      newErrors.fullName = "Nome completo é obrigatório";
      isValid = false;
    } else if (fullName.length < 3) {
      newErrors.fullName = "Nome completo deve ter pelo menos 3 caracteres";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
      isValid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      setIsLoading(true);
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
        router.push("/subjects");
      }

    } catch (error) {
      console.error("Erro ao realizar login:", error);
      showToast("Erro ao realizar login. Tente novamente mais tarde.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await userService.register({
        email,
        password,
        fullName,
      });

      if (response.statusCode === 400) {
        showToast(response.message, "error");
        return;
      }

      if (response.statusCode === 500) {
        showToast(response.message, "error");
        return;
      }

      showToast(response.message || "Registro realizado com sucesso!", "success");
      router.push("/login");

    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      showToast("Erro ao registrar usuário. Tente novamente mais tarde.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errors,
    handleLogin,
    validateForm: validateLoginForm,
    validateLoginForm,
    validateRegisterForm,
    handleRegister
  };
}