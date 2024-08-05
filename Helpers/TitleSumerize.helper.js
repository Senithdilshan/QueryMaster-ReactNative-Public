export const summarizeTitle = (input) => {
    const words = input.trim().split(/\s+/);
    return words.length <= 3
        ? words.join(' ')
        : `${words.slice(0, 3).join(' ')}...`;
}