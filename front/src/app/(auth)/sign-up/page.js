import { handleSignUp } from "@/app/api/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUp(){
    const router = useRouter();
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    async function handleSubmit(e){
        e.preventDefault();
        setError(null);

        try{
            if (!name || !password){
                setError("Заполните все поля")
            }
            const response = await handleSignUp(name, password);
            if(response.data.JWT){
                localStorage.setItem("token", response.data.JWT)
                router.push("/");
            }else{
                setError("Пользователь уже существует")
            }

        }
    }

    return(
        <div className="container-fluid translate-y-1/2">
            <div className="flex flex-col">
                <h1 className="text-center text-3xl leading-normal">Войдите в свой аккаунт</h1>
                <form className="flex flex-col text-xs sm:text-xl items-center gap-5 mt-10"
                    onSubmit={handleSubmit}>
                    <input
                        type="text" 
                        value = {name} 
                        onChange={(e) =>{setName(e.target.value)}} 
                        placeholder="Username" 
                        name="name"  
                        className="py-2 px-4 border-nedoblack border-2 rounded-lg" required/>
                    <input 
                        type="password" 
                        value = {password}
                        onChange={(e) =>{setPassword(e.target.value)}}
                        placeholder="Password" 
                        name = "password" 
                        className="py-2 px-4 border-nedoblack border-2 rounded-lg" required/>
                    <button className="relative inline-block py-2 px-6 border-2  rounded-xl border-nedoblack text-nowrap text-xl text-nedowhite bg-no-repeat hover:bg-gradient-to-hover bg-center bg-nedoblack transition-colors duration-300 hover:text-nedoblack hover:animate-fill-center hover:border-nedoblack">
                        Sign Up
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>

    )
}