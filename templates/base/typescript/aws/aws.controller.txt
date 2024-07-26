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
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ControllerWrapper } from "../../common/decorators";
import { CustomResponseType } from "../../common/types";
import {
    DeleteObjectCommandOutput,
    GetObjectCommandOutput,
} from "@aws-sdk/client-s3";

@ControllerWrapper("aws")
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get("image")
    @ApiOperation({ summary: "Get the image as a string" })
    @ApiConsumes("multipart/form-data")
    @ApiQuery({ name: "imagePath", required: true })
    @ApiQuery({ name: "imageName", required: true })
    @ApiQuery({ name: "bucketName", required: false })
    async getImage(
        @Query()
        query: {
            imagePath: string;
            imageName: string;
            bucketName?: string;
        },
        @Res() res: Response
    ) {
        const response: CustomResponseType<string> =
            await this.s3Service.getImage(query);

        return res.status(response.status).json(response);
    }

    @Get("image/url")
    @ApiOperation({ summary: "Get the URL of the image" })
    @ApiConsumes("multipart/form-data")
    @ApiQuery({ name: "imagePath", required: true })
    @ApiQuery({ name: "imageName", required: true })
    @ApiQuery({ name: "bucketName", required: false })
    async getImageURL(
        @Query()
        query: {
            imagePath: string;
            imageName: string;
            bucketName?: string;
        },
        @Res() res: Response
    ) {
        const response: CustomResponseType<string> =
            await this.s3Service.getImageURL(query);

        return res.status(response.status).json(response);
    }

    @Get("images")
    @ApiConsumes("multipart/form-data")
    @ApiQuery({ name: "imagesPath", required: true })
    @ApiQuery({ name: "bucketName", required: false })
    async getAllImages(
        @Query()
        query: {
            imagesPath: string;
            bucketName?: string;
        },
        @Res() res: Response
    ) {
        const response: CustomResponseType<GetObjectCommandOutput> =
            await this.s3Service.getAllImages(query);

        return res.status(response.status).json(response);
    }

    @Post("bucket")
    @ApiQuery({ name: "bucketName", required: true })
    async createBucket(
        @Query() query: { bucketName: string },
        @Res() res: Response
    ) {
        const response: CustomResponseType<any> =
            await this.s3Service.createBucket({
                bucketName: query?.bucketName,
            });

        return res.status(response.status).json(response);
    }

    @Post("image")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("image"))
    @ApiBody({
        schema: {
            type: "object",
            required: ["image", "filePath"],
            properties: {
                image: {
                    type: "string",
                    format: "binary",
                },
                filePath: {
                    type: "string",
                },
                fileName: {
                    type: "string",
                    default: "",
                },
                bucketName: {
                    type: "string",
                    nullable: true,
                },
            },
        },
    })
    async uploadImage(
        @UploadedFile() image: Express.Multer.File,
        @Body()
        body: {
            filePath: string;
            fileName?: string;
            bucketName?: string;
        },
        @Res() res: Response
    ) {
        const response: CustomResponseType<any> =
            await this.s3Service.uploadImage({ ...body, file: image });

        return res.status(response.status).json(response);
    }

    @Delete("image")
    @ApiConsumes("multipart/form-data")
    @ApiQuery({ name: "filePath", required: true })
    @ApiQuery({ name: "fileName", required: true })
    @ApiQuery({ name: "bucketName", required: false })
    async deleteFile(
        @Query()
        query: { filePath: string; fileName: string; bucketName?: string },
        @Res() res: Response
    ) {
        const response: CustomResponseType<DeleteObjectCommandOutput> =
            await this.s3Service.deleteFile(query);

        return res.status(response.status).json(response);
    }
}
