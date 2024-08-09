/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ColumnDecoratorChoice,
    ColumnPropertyChoice,
    ColumnTypeChoice,
} from "../enums/createAction.js";
import NameVariant from "../models/nameVariant.js";
import SubPath from "../models/subPath.js";
import { InjectionAdditionAction } from "../types/injectTemplate.js";

// create main
export interface CreateMainProps {
    projectName: any;
    rootDir: any;
    isAWS: any;
    isMailer: any;
    publicDir: any;
    mainDest: any;
    schemasPath: any;
}

// create database
export interface CreateDatabaseProps {
    paths: {
        user: SubPath;
        role: SubPath;
        permission: SubPath;
    };
    appModuleDest: string;
    envLocation: string;
    db: {
        host: string;
        username: string;
        password: string;
        name: string;
        port: string;
    };
}

// create table
export interface CreateTableProps {
    paths: SubPath;
    nameVariant: NameVariant;
}

// create column

export interface ColumnAdditions {
    entityAdditions: InjectionAdditionAction[];
    createDtoAdditions: InjectionAdditionAction[];
    updateDtoAdditions: InjectionAdditionAction[];
}

export interface GetColumnInjectionAdditions {
    columNameVariants: NameVariant;
    tableNameVariants: NameVariant;
    columnType: ColumnTypeChoice[];
    description: string;
    defaultValue: string;
    columnProperties: ColumnPropertyChoice[];
    columnDecorators: ColumnDecoratorChoice[];
}

export interface CreateColumnProps {
    paths: SubPath;
    tableNameVariants: NameVariant;
    columNameVariants: NameVariant;
    columnAdditions: ColumnAdditions;
    // columnData: {
    //     columnName: string;
    //     columnType: ColumnTypeChoice;
    //     mapsData: {
    //         dtoCreate: string | null;
    //         dtoUpdate: string | null;
    //         entityType: string;
    //         dtoType: string;
    //     };
    //     entityProperties: string | null;
    //     decorators: {
    //         decoratorsValues: string | null;
    //         decoratorsImports: string | null;
    //     };
    //     dtoProperties: string | null;
    //     specialInjections: InjectTemplate[];
    // };
}

// create relation
export interface CreateRelationProps {
    relationType: string;
    table1: {
        nameVariant: NameVariant;
        paths: SubPath;
    };
    table2: {
        nameVariant: NameVariant;
        paths: SubPath;
    };
}
