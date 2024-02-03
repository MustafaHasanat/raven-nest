import { pathConvertor } from "../utils/helpers/filesHelpers.js";
import { pathCreator } from "../utils/helpers/pathCreator.js";
import NameVariant from "./nameVariant.js";

interface NewPathProps {
    mainDir: string;
    nameVariant: NameVariant;
}

class SubPath {
    constructor({ mainDir, nameVariant }: NewPathProps) {
        const { entitiesPath, schemasPath, dtoPath, enumsPath, typesPath } =
            this.getPaths({ mainDir, nameVariant });

        this.mainPath = mainDir;
        this.enumsPath = enumsPath;
        this.entitiesPath = entitiesPath;
        this.schemasPath = schemasPath;
        this.dtoPath = dtoPath;
        this.typesPath = typesPath;
    }
    mainPath = "";
    enumsPath = "";
    entitiesPath = "";
    schemasPath = "";
    dtoPath = "";
    typesPath = "";

    private getPaths = ({ mainDir, nameVariant }: NewPathProps) => {
        const { pluralLowerCaseName } = nameVariant;

        // get the paths
        const [entitiesPath, enumsPath, schemasPath, dtoPath, typesPath] = [
            pathConvertor(mainDir, "entities"),
            pathConvertor(mainDir, "enums"),
            pathConvertor(mainDir, `schemas/${pluralLowerCaseName}`),
            pathConvertor(mainDir, `dto/${pluralLowerCaseName}`),
            pathConvertor(mainDir, `types`),
        ];

        // create the paths if they don't exist
        pathCreator([entitiesPath, schemasPath, dtoPath, enumsPath, typesPath]);

        return { entitiesPath, schemasPath, dtoPath, enumsPath, typesPath };
    };
}

export default SubPath;
