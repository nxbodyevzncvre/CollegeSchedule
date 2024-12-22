import axios from "axios";

export async function handleSignIn(name, password){
    try{
        const response = await axios.post("http://localhost:8080/sign-in",{
            name,
            password
        });
        return response

    }catch(err){
        throw "Неправильный логин или пароль";

    };
}