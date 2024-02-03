import {
    DecoratorsMapProps,
    GetColumnAttributesProps,
    GetColumnAttributesReturn,
} from "../../interfaces/utils.js";
import {
    propertiesEntityMapObject,
    decoratorsMapObject,
    propertiesDtoMapObject,
} from "../../utils/constants/builderMaps.js";

const propertiesEntityMap = (properties: string[]): string | null => {
    if (properties.length === 0) return null;
    return `${properties
        .map((property) => propertiesEntityMapObject[property])
        .join(",\n")}`;
};

const propertiesDtoMap = (properties: string[]): string | null => {
    if (properties.length === 0) return null;
    return `${properties
        .reduce((acc: string[], property: string) => {
            const mapped = propertiesDtoMapObject[property];
            if (mapped) {
                return [...acc, mapped];
            }
            return acc;
        }, [])
        .join(",\n")}`;
};

const decoratorsMap = (
    decorators: string[]
): {
    decoratorsValues: string | null;
    decoratorsImports: string | null;
} => {
    if (decorators.length === 0)
        return {
            decoratorsValues: null,
            decoratorsImports: null,
        };

    const { decoratorsArr, importsArr }: DecoratorsMapProps = decorators.reduce(
        (
            { decoratorsArr, importsArr }: DecoratorsMapProps,
            attribute: string
        ) => {
            const { name, usage } = decoratorsMapObject[attribute];
            return {
                decoratorsArr: [...decoratorsArr, usage],
                importsArr: [...importsArr, name],
            };
        },
        {
            decoratorsArr: [],
            importsArr: [],
        }
    );

    const decoratorsValues = decoratorsArr.join("\n");
    const decoratorsImports = `import {

 ${importsArr.join(", ")}
} from 'class-validator';`;

    return {
        decoratorsValues,
        decoratorsImports,
    };
};

const getColumnAttributes = ({
    columnProperties,
    columnDecorators,
}: GetColumnAttributesProps): GetColumnAttributesReturn => {
    return {
        entityProperties: propertiesEntityMap(columnProperties),
        dtoProperties: propertiesDtoMap(columnProperties),
        decorators: decoratorsMap(columnDecorators),
    };
};

export {
    getColumnAttributes,
    propertiesEntityMap,
    decoratorsMap,
    propertiesDtoMap,
};
