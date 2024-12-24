"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation";

const role = localStorage.getItem("group");


export default function AdminPanel(){
    const router = useRouter()
    
    useEffect(()=>{
        if (role !== "admin"){
        router.push("/sign-in")
    }},[])
    const fileInput = useRef(null);
    const [error, setError] = useState(null)


    async function uploadFile(e){
        e.preventDefault();
        setError(null)
        const formData = new FormData();

        formData.append("file", fileInput?.current?.files?.[0]);
        try{
            const response = await fetch("http://localhost:8080/get-file",{
                method: "POST",
                body: formData,
            });
            if (response.ok){
                setError(null)
            }else{
                setError('Загрузите снова');
            }
            
        }catch(err){
            setError("Загрузите файл снова")
        }
        

    }
    return(
        <form className="flex flex-col gap-4 justify-center items-center translate-y-1/2 text-black">
            <span>Upload a file</span>
            <input type="file" name="file" ref={fileInput} />
            <button type="submit" onClick={uploadFile} className="border-4 border-black p-2 rounded-md">
                Submit
            </button>
            {error && <p className="text-red-400 underline">Загрузите файл снова</p>}
        </form>
    )
}