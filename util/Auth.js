import axios from "axios";
import { addUser } from "./DataBase/Functions";
import { FIREBASE_API_KEY } from "../env";

export const Authenicate = async (mode, email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${FIREBASE_API_KEY}`;
    try {
        const response = await axios.post(url, {
            email: email,
            password: password,
            returnSecureToken: true
        });
        const addUserResponse = await addUser(response.data.localId);
        console.log("----User", addUserResponse);
        const token = response.data.idToken;
        return { token, userId: response.data.localId };
    } catch (error) {
        throw new Error(err);
    }

}
export const CreateUser = (email, password) => {
    return Authenicate('signUp', email, password)
}
export const LoginUser = (email, password) => {
    return Authenicate('signInWithPassword', email, password)
}