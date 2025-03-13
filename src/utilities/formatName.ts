export const formatName = (name: string) => {
    if (name.includes('@')) {
        const namePart = name.split('@')[0];
        return namePart.replace(/\./g, ' ');
    }
    return name;
};