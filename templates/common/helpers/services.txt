import { SentMessageInfo } from "nodemailer";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { CustomResponseType, FullTokenPayload } from "../types";
import { Request } from "express";

export const sendEmail = async (
    options: ISendMailOptions,
    mailerService: MailerService
): Promise<CustomResponseType<SentMessageInfo>> => {
    try {
        const response: SentMessageInfo = await mailerService.sendMail(options);

        return {
            message: `We've sent an email with a password-reset link to ${options.to}. Please check your inbox or spam messages`,
            payload: {
                accepted: response?.accepted,
                rejected: response?.rejected,
                sender: response?.envelope?.from,
                recipient: response?.envelope?.to,
                messageId: response?.messageId,
            },
            status: 200,
        };
    } catch (error) {
        return {
            message: "Error occurred",
            payload: error,
            status: 500,
        };
    }
};

export const getUserTokenData = (req: Request): FullTokenPayload | null => {
    if (req && req["user"]) {
        if (Object.keys(req["user"]).length === 0) {
            return null;
        }

        const userTokenData = {
            ...req["user"],
        } as FullTokenPayload;

        userTokenData["expiredIn"] = `${Math.floor(
            (userTokenData.exp - userTokenData.iat) / 3600
        )} Hours`;

        return userTokenData;
    } else {
        return null;
    }
};
