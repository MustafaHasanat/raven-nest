export const passwordGenerator = (length = 12) => {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
};

export const camelCaseToSnakeCase = (word: string) =>
    word.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

export const getMarketingEmail = (email: string): string => {
    const parts = email.split("@");

    if (!parts[1].endsWith(".com")) return email;

    parts[1] = parts[1].replace(/\.com$/, ".marketing.com");

    return parts.join("@");
};
