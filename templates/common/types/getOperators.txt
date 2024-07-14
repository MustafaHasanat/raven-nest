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
    conditions?: GetConditionsProps<FieldType>[];
    sortBy?: FieldType;
    reverse?: boolean;
    page?: number;
    capacity?: number;
    descendants?: string[];
    ascendants?: { [key: string]: { id: string } };
    ids?: string[];
    whereQuery?: { [key: string]: any };
};

type GetOneProps = {
    descendants?: string[];
};

type GetQueryProps = {
    conditions?: any;
    sortBy?: any;
    reverse?: any;
    page?: any;
    capacity?: any;
    descendants?: any;
    whereQuery?: any;
    ids?: any;
};

type DeleteQueryProps = {
    id?: string;
    wipe?: any;
};

export {
    FilteredTermDataType,
    GetConditionsProps,
    GetAllProps,
    GetQueryProps,
    GetOneProps,
    DeleteQueryProps,
};
