import { join } from "path";
import { InjectTemplate } from "../../../types/injectTemplate.js";
import { CreateRelationProps } from "../../../interfaces/builder.js";

const createRelationInjection = ({
    relationType,
    table1: {
        nameVariant: {
            camelCaseName: camelCaseName1,
            upperCaseName: upperCaseName1,
            pluralLowerCaseName: pluralLowerCaseName1,
            pluralUpperCaseName: pluralUpperCaseName1,
        },
        paths: { schemasPath: schemasPath1, entitiesPath },
    },
    table2: {
        nameVariant: {
            camelCaseName: camelCaseName2,
            upperCaseName: upperCaseName2,
            pluralLowerCaseName: pluralLowerCaseName2,
            pluralUpperCaseName: pluralUpperCaseName2,
        },
        paths: { dtoPath: dtoPath2, schemasPath: schemasPath2 },
        camelCaseColumnName: camelCaseColumnName2,
    },
}: CreateRelationProps): InjectTemplate[] => {
    // OneToMany relation
    if (relationType === "OneToMany")
        return [
            {
                signature: "TABLE1.entity.ts",
                injectable: join(entitiesPath, `${camelCaseName1}.entity.ts`),
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${upperCaseName2} } from './${camelCaseName2}.entity';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "{ Entity",
                        addition: {
                            base: ", OneToMany",
                            additionIsFile: false,
                            conditional: {
                                type: "SUPPOSED_TO_BE_THERE",
                                data: "OneToMany",
                            },
                        },
                    },
                    {
                        keyword: "// --- relations ---",
                        addition: {
                            base: `\n@OneToMany(() => ${upperCaseName2}, (${camelCaseName2}) => ${camelCaseName2}.${camelCaseName1})\n${pluralLowerCaseName2}: ${upperCaseName2}[];\n\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "TABLE2.entity.ts",
                injectable: join(entitiesPath, `${camelCaseName2}.entity.ts`),
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${upperCaseName1} } from './${camelCaseName1}.entity';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "{ Entity",
                        addition: {
                            base: ", ManyToOne",
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "// --- relations ---",
                        addition: {
                            base: `\n@ManyToOne(() => ${upperCaseName1}, (${camelCaseName1}) => ${camelCaseName1}.${pluralLowerCaseName2})\n${camelCaseName1}: ${upperCaseName1};\n\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "TABLE2.module.ts",
                injectable: `${schemasPath2}/${pluralLowerCaseName2}.module.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${pluralUpperCaseName1}Module } from '../${pluralLowerCaseName1}/${pluralLowerCaseName1}.module';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "imports: [",
                        addition: {
                            base: `${pluralUpperCaseName1}Module,\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "TABLE2.service.ts",
                injectable: `${schemasPath2}/${pluralLowerCaseName2}.service.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${pluralUpperCaseName1}Service } from '../${pluralLowerCaseName1}/${pluralLowerCaseName1}.service';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: `@InjectRepository(${upperCaseName2})`,
                        addition: {
                            base: `\nprivate readonly ${pluralLowerCaseName1}Service: ${pluralUpperCaseName1}Service,`,
                            additionIsFile: false,
                        },
                    },

                    {
                        keyword: "// --- DUMMY_TABLE_NAME_CREATE ---",
                        addition: {
                            base: `\n${camelCaseName1}: ${camelCaseName1}Id,`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "// --- DUMMY_TABLE_NAME_UPDATE ---",
                        addition: {
                            base: `\n${camelCaseName1}: ${camelCaseName1}Id,`,
                            additionIsFile: false,
                        },
                        replica: true,
                    },
                    {
                        keyword: "// --- Table ID check - create ---",
                        addition: {
                            base: "components/typescript/table/tableIdCheck-service-file.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME1",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME1",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_PLURAL_UPPER_NAME1",
                                newString: pluralLowerCaseName1,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME2",
                                newString: camelCaseName2,
                            },
                        ],
                    },
                    {
                        keyword: "// --- Table ID check - update ---",
                        addition: {
                            base: "components/typescript/table/tableIdCheck-service-file.txt",
                        },
                        replica: true,
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME1",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME1",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_PLURAL_UPPER_NAME1",
                                newString: pluralLowerCaseName1,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME2",
                                newString: camelCaseName2,
                            },
                        ],
                    },
                    {
                        keyword: "// --- Relational REST APIs ---",
                        addition: {
                            base: "components/typescript/table/getRows-x-By-y-Id-service-file.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME1",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME1",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME2",
                                newString: camelCaseName2,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME2",
                                newString: upperCaseName2,
                            },
                            {
                                oldString: "TABLE_PLURAL_UPPER_NAME2",
                                newString: pluralUpperCaseName2,
                            },
                        ],
                    },
                ],
                deletions: [
                    {
                        keyword: "CHANGE_THIS_TO_DEFAULT_FIELD",
                        deletion: {
                            conditional: {
                                type: "REPLACED_WITH",
                                data: camelCaseColumnName2,
                            },
                        },
                    },
                ],
            },
            {
                signature: "TABLE2.controller.ts",
                injectable: `${schemasPath2}/${pluralLowerCaseName2}.controller.ts`,
                additions: [
                    {
                        keyword: "// --- Relational REST endpoints ---",
                        addition: {
                            base: "components/typescript/table/getRows-x-By-y-Id-controller-file.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME1",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME1",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME2",
                                newString: upperCaseName2,
                            },
                            {
                                oldString: "TABLE_PLURAL_LOWER_NAME2",
                                newString: pluralLowerCaseName2,
                            },
                            {
                                oldString: "TABLE_PLURAL_UPPER_NAME2",
                                newString: pluralUpperCaseName2,
                            },
                        ],
                    },
                ],
            },
            {
                signature: "create-TABLE2.dto.ts",
                injectable: `${dtoPath2}/create-${camelCaseName2}.dto.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: "import { ApiProperty } from '@nestjs/swagger';",
                            additionIsFile: false,
                            conditional: {
                                type: "SUPPOSED_TO_BE_THERE",
                                data: "ApiProperty",
                            },
                        },
                    },
                    {
                        keyword: "// --- Relational fields ---",
                        addition: {
                            base: `\n@ApiProperty({ required: true })\n${camelCaseName1}: string;\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "update-TABLE2.dto.ts",
                injectable: `${dtoPath2}/update-${camelCaseName2}.dto.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: "import { ApiProperty } from '@nestjs/swagger';",
                            additionIsFile: false,
                            conditional: {
                                type: "SUPPOSED_TO_BE_THERE",
                                data: "ApiProperty",
                            },
                        },
                    },
                    {
                        keyword: "// --- Relational fields ---",
                        addition: {
                            base: `\n@ApiProperty({ required: false, default: '' })\n${camelCaseName1}?: string;\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
        ];
    // OneToOne relation
    else if (relationType === "OneToOne")
        return [
            {
                signature: "TABLE1.entity.ts",
                injectable: join(entitiesPath, `${camelCaseName1}.entity.ts`),
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${upperCaseName2} } from './${camelCaseName2}.entity';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "{ Entity",
                        addition: {
                            base: ", OneToOne, JoinColumn",
                            additionIsFile: false,
                            conditional: {
                                type: "SUPPOSED_TO_BE_THERE",
                                data: "OneToOne",
                            },
                        },
                    },
                    {
                        keyword: "// --- relations ---",
                        addition: {
                            base: `\n@OneToOne(() => ${upperCaseName2}, (${camelCaseName2}) => ${camelCaseName2}.${camelCaseName1}), {cascade: true,})\n@JoinColumn()\n${camelCaseName2}: ${upperCaseName2};\n\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "TABLE2.entity.ts",
                injectable: join(entitiesPath, `${camelCaseName2}.entity.ts`),
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${upperCaseName1} } from './${camelCaseName1}.entity';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "{ Entity",
                        addition: {
                            base: ", OneToOne",
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "// --- relations ---",
                        addition: {
                            base: `\n@OneToOne(() => ${upperCaseName1}, (${camelCaseName1}) => ${camelCaseName1}.${camelCaseName2})\n${camelCaseName1}: ${upperCaseName1};\n\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "TABLE1.service.ts",
                injectable: `${schemasPath1}/${pluralLowerCaseName1}.service.ts`,
                additions: [
                    {
                        keyword: "// --- Relational REST APIs ---",
                        addition: {
                            base: "components/typescript/table/getRow-x-By-y-Id-service-file.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME_X",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_X",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_PLURAL_LOWER_NAME_X",
                                newString: pluralLowerCaseName1,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME_Y",
                                newString: camelCaseName2,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_Y",
                                newString: upperCaseName2,
                            },
                        ],
                    },
                ],
            },
            {
                signature: "TABLE1.controller.ts",
                injectable: `${schemasPath1}/${pluralLowerCaseName1}.controller.ts`,
                additions: [
                    {
                        keyword: "// --- Relational REST endpoints ---",
                        addition: {
                            base: "components/typescript/table/getRow-x-By-y-Id-controller.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME_X",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_X",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_PLURAL_LOWER_NAME_X",
                                newString: pluralLowerCaseName1,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME_Y",
                                newString: camelCaseName2,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_Y",
                                newString: upperCaseName2,
                            },
                        ],
                    },
                ],
            },
            {
                signature: "TABLE2.module.ts",
                injectable: `${schemasPath2}/${pluralLowerCaseName2}.module.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${pluralUpperCaseName1}Module } from '../${pluralLowerCaseName1}/${pluralLowerCaseName1}.module';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "imports: [",
                        addition: {
                            base: `${pluralUpperCaseName1}Module,\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "TABLE2.service.ts",
                injectable: `${schemasPath2}/${pluralLowerCaseName2}.service.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: `import { ${pluralUpperCaseName1}Service } from '../${pluralLowerCaseName1}/${pluralLowerCaseName1}.service';\n`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: `@InjectRepository(${upperCaseName2})`,
                        addition: {
                            base: `\nprivate readonly ${pluralLowerCaseName1}Service: ${pluralUpperCaseName1}Service,`,
                            additionIsFile: false,
                        },
                    },

                    {
                        keyword: "// --- DUMMY_TABLE_NAME_CREATE ---",
                        addition: {
                            base: `\n${camelCaseName1}: ${camelCaseName1}Id,`,
                            additionIsFile: false,
                        },
                    },
                    {
                        keyword: "// --- DUMMY_TABLE_NAME_UPDATE ---",
                        addition: {
                            base: `\n${camelCaseName1}: ${camelCaseName1}Id,`,
                            additionIsFile: false,
                        },
                        replica: true,
                    },
                    {
                        keyword: "// --- Table ID check - create ---",
                        addition: {
                            base: "components/typescript/table/tableIdCheck-service-file.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME1",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME1",
                                newString: upperCaseName1,
                            },
                            {
                                oldString: "TABLE_PLURAL_UPPER_NAME1",
                                newString: pluralLowerCaseName1,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME2",
                                newString: camelCaseName2,
                            },
                        ],
                    },
                    {
                        keyword: "// --- Relational REST APIs ---",
                        addition: {
                            base: "components/typescript/table/getRow-x-By-y-Id-service-file.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME_X",
                                newString: camelCaseName2,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_X",
                                newString: upperCaseName2,
                            },
                            {
                                oldString: "TABLE_PLURAL_LOWER_NAME_X",
                                newString: pluralLowerCaseName2,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME_Y",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_Y",
                                newString: upperCaseName1,
                            },
                        ],
                    },
                ],
            },
            {
                signature: "TABLE2.controller.ts",
                injectable: `${schemasPath2}/${pluralLowerCaseName2}.controller.ts`,
                additions: [
                    {
                        keyword: "// --- Relational REST endpoints ---",
                        addition: {
                            base: "components/typescript/table/getRow-x-By-y-Id-controller.txt",
                        },
                        replacements: [
                            {
                                oldString: "TABLE_LOWER_NAME_X",
                                newString: camelCaseName2,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_X",
                                newString: upperCaseName2,
                            },
                            {
                                oldString: "TABLE_PLURAL_LOWER_NAME_X",
                                newString: pluralLowerCaseName2,
                            },
                            {
                                oldString: "TABLE_LOWER_NAME_Y",
                                newString: camelCaseName1,
                            },
                            {
                                oldString: "TABLE_UPPER_NAME_Y",
                                newString: upperCaseName1,
                            },
                        ],
                    },
                ],
            },
            {
                signature: "create-TABLE2.dto.ts",
                injectable: `${dtoPath2}/create-${camelCaseName2}.dto.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: "import { ApiProperty } from '@nestjs/swagger';",
                            additionIsFile: false,
                            conditional: {
                                type: "SUPPOSED_TO_BE_THERE",
                                data: "ApiProperty",
                            },
                        },
                    },
                    {
                        keyword: "// --- Relational fields ---",
                        addition: {
                            base: `\n@ApiProperty({ required: true })\n${camelCaseName1}: string;\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
            {
                signature: "update-TABLE2.dto.ts",
                injectable: `${dtoPath2}/update-${camelCaseName2}.dto.ts`,
                additions: [
                    {
                        keyword: "*",
                        addition: {
                            base: "import { ApiProperty } from '@nestjs/swagger';",
                            additionIsFile: false,
                            conditional: {
                                type: "SUPPOSED_TO_BE_THERE",
                                data: "ApiProperty",
                            },
                        },
                    },
                    {
                        keyword: "// --- Relational fields ---",
                        addition: {
                            base: `\n@ApiProperty({ required: false, default: '' })\n${camelCaseName1}?: string;\n`,
                            additionIsFile: false,
                        },
                    },
                ],
            },
        ];
    // ManyToMany relation
    else return [];
};

export { createRelationInjection };
