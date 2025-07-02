'use client';

import Button from "@/components/button/Button";
import Input from "@/components/Input/Input";

export default function LoginPage() {
    return (
        <div className="authentication">
            <h1>Login</h1>
            <div className="authentication-form">
                <Input 
                    placeholder="Email"
                    type="email"
                />
                <Input
                    placeholder= "Senha"
                    type="password"
                />
            </div>
            <Button 
                onClick={() => console.log("Login clicked")}
            >Entrar na conta
            </Button>
        </div>
    )
}