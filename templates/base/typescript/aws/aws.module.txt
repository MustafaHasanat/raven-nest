import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Service } from "./aws.service";
import { S3Controller } from "./aws.controller";

@Module({
    imports: [ConfigModule],
    providers: [S3Service, ConfigService],
    controllers: [S3Controller],
    exports: [S3Service],
})
export class S3Module {}
