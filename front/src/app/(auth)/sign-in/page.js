"use client"

import { handleSignIn } from "@/app/api/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignIn(){
    const router = useRouter();
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    
    async function handleForm(e){
        e.preventDefault();
        setError(null);

        try{
            if (!name || !password){
                console.log("Ошибка, введите данные")
            }
            const response = await handleSignIn(name, password);
            if (response.data.group){
                localStorage.setItem("group", response.data.group)
                console.log(response);
                router.push("/")
            }
        }catch(err){
            setError("Неверное имя или пароль");
        }
        
    }

    return(
        <div className="container-fluid translate-y-1/2">
            <div className="flex flex-col">
                <h1 className="text-center text-3xl leading-normal">Войдите в свой аккаунт</h1>
                <form onSubmit={handleForm} className="flex flex-col text-sm sm:text-xl items-center justify-center gap-5 mt-10">
                    <input 
                        type="text" 
                        placeholder="Логин" 
                        value={name}
                        onChange={
                            (e)=>{
                                setName(e.target.value)
                            }}
                        name="name"  
                        className="py-2 px-4 border-nedoblack border-2 rounded-lg" required/>
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        value={password}
                        onChange = {(e) =>{
                            setPassword(e.target.value)
                        }}
                        name = "password" 
                        className="py-2 px-4 border-nedoblack border-2 rounded-lg"/>
                    <button className="relative inline-block py-2 px-6 border-2  rounded-xl border-nedoblack text-sm text-nowrap sm:text-xl text-nedowhite bg-no-repeat hover:bg-gradient-to-hover bg-center bg-nedoblack transition-colors duration-300 hover:text-nedoblack hover:animate-fill-center hover:border-nedoblack">
                        Войти
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                </form>
            </div>
        </div>
    );
}