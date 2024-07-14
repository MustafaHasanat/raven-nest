/* eslint-disable prefer-const */
import {
    Equal,
    FindManyOptions,
    FindOptionsWhere,
    In,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
} from "typeorm";
import { GetAllProps } from "../types";
import { FilterOperator, SortDirection } from "../enums/filters";
import { BadRequestException } from "@nestjs/common";

export const mappedOperators = (value: any) => {
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

export const mappingMethod = (
    field: any,
    value: number | string,
    filterOperator: FilterOperator
) => {
    return {
        [field]: mappedOperators(value)[`${filterOperator}`],
    };
};

export function filteredGetQuery({
    sortBy = "createdAt",
    reverse = false,
    page = 1,
    capacity = 5,
    conditions = [],
    descendants = [],
    ascendants = {},
    ids = [],
}: GetAllProps<any>): FindManyOptions {
    try {
        const whereQuery: FindOptionsWhere<any> | FindOptionsWhere<any>[] =
            ascendants || {};

        // add the ids to the query if they're given
        ids.length > 0 && (whereQuery["id"] = In(ids));

        // add conditions to the query if they're given
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
                    throw new BadRequestException(
                        "The inputs (field, filterOperator, filteredTerm.dataType, filteredTerm.value) must be consistent"
                    );
                }

                const where = mappingMethod(
                    field,
                    isNumber ? (value as number) : value,
                    filterOperator
                );

                whereQuery[field] = where[field];
            });

        // add page query if it was provided
        const pageQuery =
            page === 0
                ? {}
                : {
                      take: capacity,
                      skip: capacity * (page - 1),
                  };

        // add order query if it was provided
        const orderQuery = {
            [sortBy]: reverse ? SortDirection.DESC : SortDirection.ASC,
        };

        return {
            where: whereQuery,
            order: orderQuery,
            ...pageQuery,
            relations: descendants,
        };
    } catch (error: any) {
        console.error(error);
        return {};
    }
}

export function filterNullsObject<DataType>(object: any): DataType {
    try {
        if (!object) return {} as DataType;

        let newObject: { [key: string]: any } = {};

        Object.entries(object).forEach(([key, value]) => {
            if (value || value === 0) {
                newObject[`${key}`] = value;
            }
        });

        return newObject as DataType;
    } catch (error) {
        console.error(error);
        return {} as DataType;
    }
}

export function filterNullsArray(array: any[]) {
    try {
        if (!array) return [];

        const newArray = array.reduce((acc, item) => {
            const newItem = item ? [item] : [];
            return [...acc, ...newItem];
        }, []);

        return newArray;
    } catch (error) {
        console.error(error);
        return [];
    }
}
