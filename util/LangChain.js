import axios from "axios";
import { URLs, TOKEN } from "../env";
export const sendOpenAiMessage = async (message, documentId, history, modelName) => {
    // console.log(documentId);
    try {
        const response = await axios.post(URLs.SEND_MESSAGE,
            {
                "message": message,
                "fileId": documentId,
                "history": history,
                "modelName": modelName
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

export const uploadDocument = async (formdata) => {
    try {
        const response = await axios.post(
            URLs.UPLOAD_DOCUMENT, formdata,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": TOKEN
                }
            }
        );
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

export const deleteDocument = async (id) => {
    try {
        const response = await axios(
            {
                method: 'delete',
                url: "URLS.DELETE_DOCUMENT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": TOKEN
                },
                data: {
                    "ids": [id],
                    "delete_all": true
                }
            }
        );
        // console.log(response.data);
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}