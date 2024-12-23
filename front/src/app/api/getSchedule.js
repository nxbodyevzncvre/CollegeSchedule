import axios from "axios";

export async function getSchedule(group){
    try{
        const response = await axios.post("http://localhost:8080/schedule", {group})
        return response
    }catch(err){
        throw "Неизвестная группа"
    }

}