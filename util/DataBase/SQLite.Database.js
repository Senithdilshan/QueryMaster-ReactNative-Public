import * as SQLite from 'expo-sqlite';
export const database = SQLite.openDatabaseSync('app.db');

export const init = async () => {
    try {
        await database.execAsync(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY NOT NULL,
            userId TEXT NOT NULL UNIQUE
        )`)

        await database.execAsync(`CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY NOT NULL,
            conversationId  TEXT NOT NULL UNIQUE,
            conversationTitle TEXT NOT NULL,
            date TEXT NOT NULL,
            userId TEXT NOT NULL,
            chatHistory TEXT NOT NULL,
            documentIds TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(userId)
        )`)
    } catch (error) {
        throw new Error(error)
    }
};
