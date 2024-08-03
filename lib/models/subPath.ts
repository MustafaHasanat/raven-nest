import { pathConvertor } from "../utils/helpers/filesHelpers.js";
import { pathCreator } from "../utils/helpers/pathCreator.js";
import NameVariant from "./nameVariant.js";

interface NewPathProps {
    mainDir: string;
    nameVariant: NameVariant;
    disablePlural?: boolean;
}

class SubPath {
    constructor({ mainDir, nameVariant, disablePlural = false }: NewPathProps) {
        const {
            entitiesPath,
            schemasPath,
            dtoPath,
            pipesPath,
            constantsPath,
            enumsPath,
            typesPath,
            middlewaresPath,
        } = this.getPaths({ mainDir, nameVariant });

        this.disablePlural = disablePlural;

        this.mainPath = mainDir;
        this.enumsPath = enumsPath;
        this.entitiesPath = entitiesPath;
        this.schemasPath = schemasPath;
        this.dtoPath = dtoPath;
        this.pipesPath = pipesPath;
        this.constantsPath = constantsPath;
        this.typesPath = typesPath;
        this.middlewaresPath = middlewaresPath;
    }
    mainPath = "";
    enumsPath = "";
    entitiesPath = "";
    schemasPath = "";
    dtoPath = "";
    pipesPath = "";
    typesPath = "";
    middlewaresPath = "";
    constantsPath = "";
    disablePlural = false;

    private getPaths = ({ mainDir, nameVariant }: NewPathProps) => {
        const { pluralLowerCaseName, camelCaseName } = nameVariant;

        // get the paths
        const [
            entitiesPath,
            enumsPath,
            schemasPath,
            dtoPath,
            typesPath,
            middlewaresPath,
            constantsPath,
            pipesPath,
        ] = [
            pathConvertor(mainDir, "entities"),
            pathConvertor(mainDir, "common/enums"),
            pathConvertor(
                mainDir,
                `schemas/${this.disablePlural ? camelCaseName : pluralLowerCaseName}`
            ),
            pathConvertor(
                mainDir,
                `common/dto/${this.disablePlural ? camelCaseName : pluralLowerCaseName}`
            ),
            pathConvertor(mainDir, `common/types`),
            pathConvertor(mainDir, `common/middlewares`),
            pathConvertor(mainDir, `common/constants`),
            pathConvertor(mainDir, `common/pipes`),
        ];

        // create the paths if they don't exist
        pathCreator([
            entitiesPath,
            schemasPath,
            dtoPath,
            enumsPath,
            typesPath,
            middlewaresPath,
            constantsPath,
            pipesPath,
        ]);

        return {
            entitiesPath,
            schemasPath,
            dtoPath,
            enumsPath,
            typesPath,
            middlewaresPath,
            constantsPath,
            pipesPath,
        };
    };
}

export default SubPath;
