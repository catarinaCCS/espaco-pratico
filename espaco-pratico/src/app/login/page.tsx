'use client';

import Button from "@/components/button/Button";
import Input from "@/components/Input/Input";

export default function LoginPage() {
    return (
        <form method="POST" className="authentication">
            <h1>Login</h1>
            <div className="authentication-form">
                <Input 
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    placeholder= "Senha"
                    type="password"
                    required
                />
            </div>
            <Button 
                onClick={() => console.log("Login clicked")}
            >Entrar na conta
            </Button>
        </form>
    )
}