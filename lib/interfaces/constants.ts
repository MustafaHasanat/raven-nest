import { QuestionCollection } from "inquirer";

// builder constants' interfaces ----------------------------------------------------

export interface BuilderConstantsProps {
    dockerInit: {
        projectName: QuestionCollection<any>;
        rootDir: QuestionCollection<any>;
    };
    createMain: {
        projectName: QuestionCollection<any>;
        mainDest: QuestionCollection<any>;
        publicDir: QuestionCollection<any>;
        rootDir: QuestionCollection<any>;
    };
    createDatabase: {
        rootDir: QuestionCollection<any>;
        mainDest: QuestionCollection<any>;
    };
    createTable: {
        tableName: QuestionCollection<any>;
        isSpecial: ([...any]) => QuestionCollection<any>;
        mainDest: QuestionCollection<any>;
    };
    createColumn: {
        newColumn: QuestionCollection<any>;
        tableName: QuestionCollection<any>;
        description: QuestionCollection<any>;
        mainDest: QuestionCollection<any>;
        columnName: QuestionCollection<any>;
        columnType: QuestionCollection<any>;
        columnProperties: QuestionCollection<any>;
        columnDecorators: QuestionCollection<any>;
        stringLength: QuestionCollection<any>;
        enumValues: QuestionCollection<any>;
        enumName: QuestionCollection<any>;
    };
    createRelation: {
        newRelation: QuestionCollection<any>;
        mainDest: QuestionCollection<any>;
        relationType: QuestionCollection<any>;
        tables: QuestionCollection<any>;
    };
    shared: { overwrite: (files: string[]) => QuestionCollection<any> };
}

// create command interfaces ----------------------------------------------------

export interface CreatorConstantsPros {
    installer: {
        confirmation: (packages: string, count: number) => QuestionCollection;
    };
    neededDeps: {
        [set: string]: PackageType[];
    };
}

export interface PackageType {
    packageName: string;
    commandType: "--save" | "--save-dev";
}

export interface FullDependencies {
    installedDeps: string[];
    neededDeps: PackageType[];
}
