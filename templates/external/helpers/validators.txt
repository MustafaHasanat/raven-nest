import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { GetConditionsProps } from "../types/getOperators";

function validateGetConditions<FieldType>(
    conditions: any
): GetConditionsProps<FieldType>[] {
    if (conditions) {
        try {
            return conditions.map((condition: string) =>
                JSON.parse(condition)
            ) as GetConditionsProps<FieldType>[];
        } catch (error) {
            return [
                JSON.parse(`${conditions}`),
            ] as GetConditionsProps<FieldType>[];
        }
    } else {
        return [];
    }
}

async function validateNewInstance({ dto, data }: { dto: any; data: any }) {
    const dtoClass = plainToInstance(dto, data);
    const errors = await validate(dtoClass);

    const errorsArray: string[] = [];
    errors.map((error: any) => {
        if (error.constraints) {
            Object.entries(error.constraints).map((constrain) => {
                const [key, value] = constrain;
                errorsArray.push(`${error.property} -> ${key}: ${value}`);
            });
        }
    });

    if (errorsArray.length !== 0) {
        throw new Error(
            `Validation error occurred: ${errorsArray.join(",\n")}`
        );
    }
}

const emailValidator = (email: string): boolean => {
    return !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export { emailValidator, validateNewInstance, validateGetConditions };
