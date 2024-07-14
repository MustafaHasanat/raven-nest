enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

enum FilterOperator {
    CONTAINS = "contains",
    MORE = "moreThan",
    MORE_EQ = "moreThanOrEqual",
    LESS = "lessThan",
    LESS_EQ = "lessThanOrEqual",
    NUMBER_EQUALS = "numberEquals",
    STRING_EQUALS = "stringEquals",
}

export { SortDirection, FilterOperator };
