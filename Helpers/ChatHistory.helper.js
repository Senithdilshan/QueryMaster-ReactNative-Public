export const getLastTransformedHistory = (chatHistory, maxEntries = 4) => {
    const lastEntries = chatHistory.slice(-maxEntries);

    const transformedHistory = lastEntries.map(chat => ({
        role: chat.isAi ? 'assistant' : 'user',
        content: chat.message
    }));

    return transformedHistory;
};