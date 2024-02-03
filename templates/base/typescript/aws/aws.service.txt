import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { config, S3 } from "aws-sdk";
import { CustomResponseType } from "src/ravennest";
import { TablesNames } from "src/enums/tables-data.enum";

@Injectable()
export class S3Service {
    constructor(private readonly configService: ConfigService) {
        try {
            config.update({
                accessKeyId: this.configService.get("AWS_ACCESS_KEY"),
                secretAccessKey: this.configService.get(
                    "AWS_SECRET_ACCESS_KEY"
                ),
                region: this.configService.get("AWS_REGION"),
            });
            this.s3 = new S3();
        } catch (error) {
            console.log(error);
        }
    }
    private readonly s3: S3;
    private bucketName = process.env.S3_BUCKET_NAME;

    // --- fetching ---

    async getImage(
        imageName: string,
        folder: TablesNames
    ): Promise<CustomResponseType<string>> {
        try {
            const imageURL = `https://${this.bucketName}.s3.amazonaws.com/${folder}/${imageName}`;
            return {
                message: "Image is retrieved successfully!",
                data: imageURL,
                status: 201,
            };
        } catch (error) {
            return { message: "Error occurred", data: error, status: 500 };
        }
    }

    async getAllImages(
        folder: TablesNames
    ): Promise<CustomResponseType<string[]>> {
        try {
            const params = {
                Bucket: this.bucketName,
                Prefix: folder,
                ACL: "bucket-owner-full-control",
            };
            const response = await this.s3.listObjectsV2(params).promise();

            return {
                message: response?.Contents
                    ? "Images are retrieved successfully!"
                    : "No images have been found.",
                data: response?.Contents
                    ? response.Contents.map((object) => object.Key || "")
                    : [],
                status: response?.Contents ? 201 : 400,
            };
        } catch (error) {
            return { message: "Error occurred", data: error, status: 500 };
        }
    }

    // --- uploading ---

    async uploadImage(
        file: Express.Multer.File,
        folder: TablesNames
    ): Promise<CustomResponseType<S3.ManagedUpload.SendData>> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: `${folder}/${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "bucket-owner-full-control",
            };
            const response = await this.s3.upload(params).promise();

            return {
                message: "Image is uploaded successfully!",
                data: response,
                status: 201,
            };
        } catch (error) {
            return { message: "Error occurred", data: error, status: 500 };
        }
    }

    async bulkUpload(images: Express.Multer.File[], folder: TablesNames) {
        await Promise.all(
            images.map((image) => {
                this.uploadImage(image, folder);
            })
        );
    }

    // --- deletion ---

    async deleteImage(
        imageName: string,
        folder: TablesNames
    ): Promise<CustomResponseType<S3.DeleteObjectOutput>> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: `${folder}/${imageName}`,
            };

            const response = await this.s3.deleteObject(params).promise();
            return {
                message: "Image is deleted successfully!",
                data: response,
                status: 201,
            };
        } catch (error) {
            return { message: "Error occurred", data: error, status: 500 };
        }
    }

    async bulkDelete(images: string[], folder: TablesNames) {
        await Promise.all(
            images.map((imageName) => {
                this.deleteImage(imageName, folder);
            })
        );
    }
}
