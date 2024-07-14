import {
    NestInterceptor,
    Type,
    UseInterceptors,
    applyDecorators,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

function EditorsWrapper(
    dto: any,
    summary: string,
    interceptor: Type<NestInterceptor<any, any>> = FileInterceptor("")
) {
    return applyDecorators(
        ApiOkResponse({ type: dto }),
        ApiConsumes("multipart/form-data"),
        ApiConsumes("application/json"),
        ApiOperation({ summary }),
        UseInterceptors(interceptor)
    );
}

export { EditorsWrapper };
