declare module "utils-types" {
    interface DecoratorsMapProps {
        decoratorsArr: string[];
        importsArr: string[];
    }

    interface GetColumnAttributesProps {
        columnDecorators: string[];
        columnProperties: string[];
        isRequired: boolean;
    }

    interface GetColumnAttributesReturn {
        decorators: {
            decoratorsImports: string | null;
            decoratorsValues: string | null;
        };
        dtoProperties: string | null;
        entityProperties: string | null;
    }
}
