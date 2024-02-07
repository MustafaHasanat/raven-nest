import { pathConvertor } from "../utils/helpers/filesHelpers.js";
import { pathCreator } from "../utils/helpers/pathCreator.js";
import NameVariant from "./nameVariant.js";

interface NewPathProps {
    mainDir: string;
    nameVariant: NameVariant;
}

class SubPath {
    constructor({ mainDir, nameVariant }: NewPathProps) {
        const {
            entitiesPath,
            schemasPath,
            dtoPath,
            enumsPath,
            typesPath,
            middlewaresPath,
        } = this.getPaths({ mainDir, nameVariant });

        this.mainPath = mainDir;
        this.enumsPath = enumsPath;
        this.entitiesPath = entitiesPath;
        this.schemasPath = schemasPath;
        this.dtoPath = dtoPath;
        this.typesPath = typesPath;
        this.middlewaresPath = middlewaresPath;
    }
    mainPath = "";
    enumsPath = "";
    entitiesPath = "";
    schemasPath = "";
    dtoPath = "";
    typesPath = "";
    middlewaresPath = "";

    private getPaths = ({ mainDir, nameVariant }: NewPathProps) => {
        const { pluralLowerCaseName } = nameVariant;

        // get the paths
        const [
            entitiesPath,
            enumsPath,
            schemasPath,
            dtoPath,
            typesPath,
            middlewaresPath,
        ] = [
            pathConvertor(mainDir, "entities"),
            pathConvertor(mainDir, "enums"),
            pathConvertor(mainDir, `schemas/${pluralLowerCaseName}`),
            pathConvertor(mainDir, `dto/${pluralLowerCaseName}`),
            pathConvertor(mainDir, `types`),
            pathConvertor(mainDir, `middlewares`),
        ];

        // create the paths if they don't exist
        pathCreator([
            entitiesPath,
            schemasPath,
            dtoPath,
            enumsPath,
            typesPath,
            middlewaresPath,
        ]);

        return {
            entitiesPath,
            schemasPath,
            dtoPath,
            enumsPath,
            typesPath,
            middlewaresPath,
        };
    };
}

export default SubPath;
