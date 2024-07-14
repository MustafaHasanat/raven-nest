import { GetConditionsProps } from "../types";

export function validateGetConditions<FieldType>(
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

export const emailValidator = (email: string): boolean => {
    return !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
