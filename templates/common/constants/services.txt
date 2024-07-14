import { ISendMailOptions } from "@nestjs-modules/mailer";
import { readFileSync } from "fs";

const getHTML = (path: string, token: string, domain: string) => {
    try {
        return readFileSync(path, "utf-8")
            .replace("TOKEN", token)
            .replace("DOMAIN", domain);
    } catch (err) {
        console.error("Error reading the HTML file:", err);
        return "";
    }
};

const mailing = {
    passwordRequest: (
        email: string,
        domain: string,
        token: string
    ): ISendMailOptions => ({
        to: email,
        from: process.env.OFFICIAL_EMAIL,
        subject: "Resetting Password Request",
        html: getHTML("views/passwordRequest.hbs", token, domain),
    }),
};

export { mailing };
