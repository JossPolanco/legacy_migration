import React, { useState } from 'react';
import { User, KeyRound } from 'lucide-react';

export default function Login() {

    const [nickname, setNickname] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        if (!nickname || !password) return setError('El usuario o contraseña son incorrectos.')

        console.log(nickname + ' ' + password);
        e.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname, password })
            });

            if (response.success != true) {
                throw new Error(`Error: ${response.status}`)
            }

            const data = await response.json()
            console.log(data);
        } catch (error) {
            console.log(error);
            setError('Error al iniciar sesión. Inténtalo de nuevo.');
        }

    }

    return (
        <div className="bg-white rounded-lg shadow-md min-h-105 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">

            {/* IMAGE RELATED */}
            <div className="md:w-1/2 w-full hidden sm:block">
                <img
                    className="h-full w-full object-cover"
                    src="/images/image_preview_1.png"
                    alt="image_preview"
                />
            </div>

            {/* FORM */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2 mb-6">
                    <img
                        className="w-26 h-26 object-contain"
                        src="/images/logo_preview_1.png"
                        alt="LOGO"
                    />
                    <p className="text-black text-center">
                        Bienvenido a template-system
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-blue-400 gap-2">
                        <User size={22} />
                        <input
                            className="w-full bg-white py-2 pr-3 pl-1 text-base text-black placeholder:text-gray-500 focus:outline-none"
                            type="text"
                            id="NNICKNAME"
                            placeholder="Nickname"
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-blue-400 gap-2">
                        <KeyRound size={22} />
                        <input
                            className="w-full bg-white py-2 pr-3 pl-1 text-base text-black placeholder:text-gray-500 focus:outline-none"
                            type="password"
                            id="NPASSWORD"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:cursor-pointer hover:bg-blue-600 transition text-white font-bold text-lg py-2 rounded-md"
                        onClick={handleSubmit}
                    >
                        INGRESAR
                    </button>
                </div>
            </div>
        </div>
    );
}
