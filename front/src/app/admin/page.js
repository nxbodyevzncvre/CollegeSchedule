"use client"

import { useRef } from "react"

export default function AdminPanel(){
    console.log(localStorage.getItem("group"));
    const fileInput = useRef(null);


    async function uploadFile(e){
        e.preventDefault();
        const formData = new FormData();

        formData.append("file", fileInput?.current?.files?.[0]);
        const response = await fetch("http://localhost:8080/get-file",{
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log(result);




       

    }
    return(
        <form method="POST"  className="flex flex-col gap-4 justify-center items-center translate-y-1/2 text-black">
            <span>Upload a file</span>
            <input type="file" name="file" ref={fileInput} />
            <button type="submit" onClick={uploadFile}>
                Submit
            </button>
    </form>
    )
}