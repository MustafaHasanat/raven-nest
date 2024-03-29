export interface DecoratorsMapProps {
    decoratorsArr: string[];
    importsArr: string[];
}

export interface GetColumnAttributesProps {
    columnDecorators: string[];
    columnProperties: string[];
    isRequired: boolean
}

export interface GetColumnAttributesReturn {
    decorators: {
        decoratorsImports: string | null;
        decoratorsValues: string | null;
    };
    dtoProperties: string | null;
    entityProperties: string | null;
}
