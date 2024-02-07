/* eslint-disable prefer-const */
import {
    Equal,
    FindManyOptions,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
} from "typeorm";

import { GetAllProps } from "../types/getOperators";
import { FilterOperator, SortDirection } from "../enums/filters";

const mappedOperators = (value: any) => {
    return {
        moreThan: MoreThan(value),
        moreThanOrEqual: MoreThanOrEqual(value),
        lessThan: LessThan(value),
        lessThanOrEqual: LessThanOrEqual(value),
        stringEquals: Equal(value),
        numberEquals: Equal(value),
        contains: Like(`%${value}%`),
    };
};

const mappingMethod = (
    field: any,
    value: number | string,
    filterOperator: FilterOperator
) => {
    return {
        [field]: mappedOperators(value)[`${filterOperator}`],
    };
};

function filteredGetQuery({
    sortBy,
    reverse,
    page = 1,
    conditions = [],
    whereQuery,
}: GetAllProps<any>): {
    message: string;
    data: FindManyOptions;
    status: number;
} {
    try {
        const finalWhereQuery: { [key: string]: any } = whereQuery || {};

        if (page < 0) {
            return {
                message: "Page number must be a positive integer or a zero",
                data: {},
                status: 400,
            };
        }

        if (conditions.length > 0)
            conditions.forEach((condition) => {
                const {
                    field,
                    filterOperator,
                    filteredTerm: { dataType, value },
                } = condition;

                const isNumber = ![
                    FilterOperator.CONTAINS,
                    FilterOperator.STRING_EQUALS,
                ].includes(filterOperator);

                if (isNumber && dataType === "string") {
                    return {
                        message:
                            "The inputs (field, filterOperator, filteredTerm.dataType, filteredTerm.value) must be consistent",
                        data: null,
                        status: 400,
                    };
                }

                const where = mappingMethod(
                    field,
                    isNumber ? (value as number) : value,
                    filterOperator
                );

                finalWhereQuery[field] = where[field];
            });

        const pageOptions =
            page === 0
                ? {}
                : {
                      take: 5,
                      skip: 5 * (page - 1),
                  };

        return {
            message: "Data retrieved successfully",
            data: {
                where: { ...finalWhereQuery },
                order: {
                    [sortBy]: reverse ? SortDirection.DESC : SortDirection.ASC,
                },
                ...pageOptions,
            },
            status: 200,
        };
    } catch (error: any) {
        console.log(error);
        return {
            message: "Error occurred",
            data: error,
            status: 500,
        };
    }
}

function filterNullsObject<DataType>(object: any): DataType {
    try {
        if (!object) return {} as DataType;

        let newObject: { [key: string]: any } = {};

        Object.entries(object).forEach((entry) => {
            const [key, value] = entry;

            if (value) {
                newObject[`${key}`] = value;
            }
        });

        return newObject as DataType;
    } catch (error) {
        console.log(error);
        return {} as DataType;
    }
}

function filterNullsArray(array: any[]) {
    try {
        if (!array) return [];

        const newArray = array.reduce((acc, item) => {
            const newItem = item ? [item] : [];
            return [...acc, ...newItem];
        }, []);

        return newArray;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export { filteredGetQuery, filterNullsObject, filterNullsArray };
