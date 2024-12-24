"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation";

const role = localStorage.getItem("group");


export default function AdminPanel(){
    const router = useRouter()
    const [aproved, setAproved] = useState(false)
    
    useEffect(()=>{
        if (role !== "admin"){
        router.push("/sign-in")
    }},[])
    const fileInput = useRef(null);
    const [error, setError] = useState(null)


    async function uploadFile(e){
        e.preventDefault();
        setError(null)
        setAproved(null)
        const formData = new FormData();

        formData.append("file", fileInput?.current?.files?.[0]);
        try{
            const response = await fetch("http://localhost:8080/get-file",{
                method: "POST",
                body: formData,
            });
            if (response.ok){
                setError(null)
                setAproved(true)
            }else{
                setError('Загрузите снова');
            }
            
        }catch(err){
            setError("Загрузите файл снова")
        }
        

    }
    return(
        <div>
            <div className="flex justify-end my-4 mx-10">
                <button className="bg-black text-white p-3 rounded-lg hover:bg-black/70 transition delay-75 font-bold" onClick={(e)=>{router.push("/sign-in")}}>
                    Вернутся на авторизацию
                </button>
            </div>
            <form className="flex flex-col gap-4 justify-center items-center translate-y-1/2 text-black">
                <span className="text-black">Upload a file</span>
                <input type="file" name="file" ref={fileInput} />
                <button type="submit" onClick={uploadFile} className="border-4 border-black p-2 rounded-md">
                    Submit
                </button>
                {error && <p className="text-red-400 underline">Загрузите файл снова</p>}
                {aproved && <p className="text-green-500 underline">Успех!</p>}
            </form>
        </div>
    )
}