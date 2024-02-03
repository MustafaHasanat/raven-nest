import { S3Service } from "./aws.service";
import {
    Body,
    Delete,
    Get,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ApiBody, ApiConsumes, ApiQuery } from "@nestjs/swagger";
import { TablesNames } from "src/enums/tables-data.enum";
import { CustomResponseType, ControllerWrapper } from "src/ravennest";
import { S3 } from "aws-sdk";

@ControllerWrapper("aws")
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get("image")
    @ApiConsumes("multipart/form-data")
    @ApiQuery({ name: "image" })
    @ApiQuery({ name: "tableName", enum: TablesNames })
    async getImage(
        @Query() query: { image: string; tableName: TablesNames },
        @Res() res: Response
    ) {
        const { image, tableName } = query;
        const response: CustomResponseType<string> =
            await this.s3Service.getImage(image, tableName);

        return res.status(response.status).json(response);
    }

    @Post("upload")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("image"))
    @ApiBody({
        schema: {
            type: "object",
            required: ["image", "tableName"],
            properties: {
                image: {
                    type: "string",
                    format: "binary",
                },
                tableName: {
                    type: "string",
                    enum: Object.values(TablesNames),
                },
            },
        },
    })
    async uploadImage(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { tableName: TablesNames },
        @Res() res: Response
    ) {
        const { tableName } = body;
        const response: CustomResponseType<S3.ManagedUpload.SendData> =
            await this.s3Service.uploadImage(image, tableName);

        return res.status(response.status).json(response);
    }

    @Delete("image")
    @ApiConsumes("multipart/form-data")
    @ApiQuery({ name: "image" })
    @ApiQuery({ name: "tableName", enum: TablesNames })
    async deleteImage(
        @Query() query: { image: string; tableName: TablesNames },
        @Res() res: Response
    ) {
        const { image, tableName } = query;
        const response: CustomResponseType<S3.DeleteObjectOutput> =
            await this.s3Service.deleteImage(image, tableName);

        return res.status(response.status).json(response);
    }
}
