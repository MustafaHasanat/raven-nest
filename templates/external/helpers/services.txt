import CustomResponseType from "../types/customResponseType";
import { SentMessageInfo } from "nodemailer";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";

const sendEmail = async (
    options: ISendMailOptions,
    mailerService: MailerService
): Promise<CustomResponseType<SentMessageInfo>> => {
    try {
        const response: SentMessageInfo = await mailerService.sendMail(options);

        return {
            message: `We've sent an email with a password-reset link to ${options.to}. Please check your inbox or spam messages`,
            data: {
                accepted: response?.accepted,
                rejected: response?.rejected,
                sender: response?.envelope?.from,
                recipient: response?.envelope?.to,
                messageId: response?.messageId,
            },
            status: 200,
        };
    } catch (error) {
        console.log(error);
        return {
            message: "Error occurred",
            data: error,
            status: 500,
        };
    }
};

export { sendEmail };
