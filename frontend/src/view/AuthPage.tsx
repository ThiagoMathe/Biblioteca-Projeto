import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    return (
        <div className="flex items-center bg-[#f7fafc] flex-grow justify-evenly flex-col-reverse md:flex-col-reverse p-4 lg:flex-row w-full">
            <img src="reading-avatar.png" className="w-[66%] md:w-[45%] " />

            {mode === "login" ?
                <LoginForm setMode={setMode} />
                :
                <RegisterForm setMode={setMode} />}
        </div>
    )
} 