import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { NewInstanceTransformer } from "../../common/types";
import { filterNullsObject } from "../../common/middlewares";
import { TablesNames } from "../enums/tables.enum";

type TransformerMappingType = {
    number: number;
    boolean: boolean;
    date: boolean;
    array: boolean;
};

const tablesTransformers: { [tableName: string]: NewInstanceTransformer } = {
    users: {},
    products: {
        price: "number",
    },
    categories: {},
    profiles: {},
    roles: {},
    permissions: {},
};

@Injectable()
export class POST_PATCH_Pipe implements PipeTransform<any> {
    constructor(tableName: TablesNames) {
        this.transformer = tablesTransformers[tableName];
    }

    transformer: NewInstanceTransformer = {};

    transformerMapping = (value: any): TransformerMappingType =>
        typeof value !== "string"
            ? {
                  number: value,
                  boolean: value,
                  date: value,
                  array: value,
              }
            : {
                  number: Number(value),
                  boolean: value === "true",
                  date: new Date(value),
                  array: value.indexOf(",") !== -1 ? value.split(",") : value,
              };

    async transform(bodyData: any, { metatype: DtoClass }: ArgumentMetadata) {
        if (!DtoClass || !this.toValidate(DtoClass)) {
            return bodyData;
        }

        // filter nulls
        const filteredData = filterNullsObject<any>(bodyData);

        // transform string data according to the mapping object
        const transformedData = structuredClone(filteredData);
        Object.entries(filteredData).map(([key, value]) => {
            if (Object.keys(this.transformer).includes(key)) {
                transformedData[key] =
                    this.transformerMapping(value)[this.transformer[key]];
            }
        });

        // validate data according to the DTO object
        const object = plainToInstance(DtoClass, transformedData);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorsArray: string[] = [];
            errors.forEach((error) => {
                Object.values(error.constraints).map((value) =>
                    errorsArray.push(value)
                );
            });

            throw new BadRequestException({
                message: "Validation error",
                payload: null,
                status: 400,
                extra: errorsArray,
            });
        }

        // check if the object is empty
        if (Object.keys(transformedData).length === 0)
            throw new BadRequestException(
                "Invalid request body: you have to specify at least one attribute"
            );

        return transformedData;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
