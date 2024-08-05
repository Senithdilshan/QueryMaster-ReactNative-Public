// Add a new user

import { database } from "./SQLite.Database";

export const addUser = async (userId) => {
    try {
        const existingUser = await database.getFirstAsync(`SELECT * FROM users WHERE userId = ?`, [userId])
        if (existingUser) {
            console.log("User already exists");
            return existingUser;
        } else {
            const response = await database.runAsync(`INSERT INTO users (userId) VALUES (?)`, [userId])
            return response;
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const addConversation = async (conversationId, userId, title) => {
    try {
        const emptyChatHistory = JSON.stringify([]);
        const emptyDocumentIds = JSON.stringify([]);
        const date = new Date();
        const isoString = date.toISOString();
        const res = await database.runAsync(`INSERT INTO conversations (conversationId,conversationTitle,date, userId, chatHistory, documentIds) VALUES (?, ?, ?, ?, ?, ?)`,
            [conversationId, title, isoString, userId, emptyChatHistory, emptyDocumentIds])
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateChatHistory = async (conversationId, chatMessage) => {
    try {
        const existingConversation = await database.getFirstAsync(`SELECT * FROM conversations WHERE conversationId = ?`, [conversationId]);
        // console.log("updateChatHistory", existingConversation);
        if (existingConversation) {
            const chatHistory = JSON.parse(existingConversation.chatHistory || '[]');
            chatHistory.push(chatMessage);
            const updatedChatHistory = JSON.stringify(chatHistory);
            await database.runAsync(`UPDATE conversations SET chatHistory = ? WHERE conversationId = ?`, [updatedChatHistory, conversationId]);
        } else {
            throw new Error('Conversation not found');
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const updateDocumentIds = async (conversationId, documentId) => {
    try {
        const existingConversation = await database.getFirstAsync(`SELECT * FROM conversations WHERE conversationId = ?`, [conversationId]);
        // console.log("updateDocumentIds", existingConversation);
        if (existingConversation) {
            const documentIds = JSON.parse(existingConversation.documentIds || '[]');
            documentIds.push(documentId);
            const updatedDocumentIds = JSON.stringify(documentIds);
            await database.runAsync(`UPDATE conversations SET documentIds = ? WHERE conversationId = ?`, [updatedDocumentIds, conversationId]);
        } else {
            throw new Error('Conversation not found');
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const getConversationData = async (conversationId) => {
    try {
        const existingConversation = await database.getFirstAsync(`SELECT * FROM conversations WHERE conversationId = ?`, [conversationId]);
        // console.log("getConversationData", existingConversation);
        if (existingConversation) {
            const chatHistory = JSON.parse(existingConversation.chatHistory);
            const documentIds = JSON.parse(existingConversation.documentIds);
            return { chatHistory, documentIds };
        } else {
            console.log("Conversation not found");
            return { chatHistory: [], documentIds: [] };
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const getAllConversations = async () => {
    try {
        const response = await database.getAllAsync(`SELECT * FROM conversations`);
        const conversations = [];
        for (let i = 0; i < response.length; i++) {
            const row = response[i];
            conversations.push({
                conversationId: row.conversationId,
                conversationTitle: row.conversationTitle,
                chatHistory: JSON.parse(row.chatHistory),
                date: row.date
            });
        }
        return conversations;
    } catch (error) {
        throw new Error(error);
    }
};
