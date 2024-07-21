import { ColumnTypeChoice } from "lib/enums/createAction.js";
import NameVariant from "../models/nameVariant.js";
import SubPath from "../models/subPath.js";
import { InjectTemplate } from "../types/injectTemplate.js";

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
}

// create table
export interface CreateTableProps {
    paths: SubPath;
    nameVariant: NameVariant;
}

// create column
export interface CreateColumnProps {
    columnData: {
        columnName: string;
        columnType: ColumnTypeChoice;
        mapsData: {
            dtoCreate: string | null;
            dtoUpdate: string | null;
            entityType: string;
            dtoType: string;
        };
        entityProperties: string | null;
        decorators: {
            decoratorsValues: string | null;
            decoratorsImports: string | null;
        };
        dtoProperties: string | null;
        specialInjections: InjectTemplate[];
    };
    paths: SubPath;
    tableNameVariants: NameVariant;
    columNameVariants: NameVariant;
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
