import axios from "axios";

export async function handleSignIn(username, password){
    try{
        const response = await axios.post("http://localhost:8080/sign-in",{
            username,
            password
        });
        return response

    }catch(err){
        throw "Неправильный логин или пароль";
    };
}
