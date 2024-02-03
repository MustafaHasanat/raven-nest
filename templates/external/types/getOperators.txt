import { FilterOperator } from "../enums/filters";

enum FilteredTermDataType {
    STRING = "string",
    NUMBER = "number",
}

type GetConditionsProps<FieldType> = {
    filteredTerm: {
        dataType: FilteredTermDataType;
        value: string | number;
    };
    filterOperator: FilterOperator;
    field: FieldType;
};

type GetAllProps<FieldType> = {
    conditions: GetConditionsProps<FieldType>[];
    sortBy?: FieldType;
    reverse?: boolean;
    page?: number;
};

type GetQueryProps<FieldType> = {
    sortBy: FieldType;
    reverse: string;
    page: number;
    conditions: string[];
};

export { FilteredTermDataType, GetConditionsProps, GetAllProps, GetQueryProps };
