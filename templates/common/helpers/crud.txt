/* eslint-disable @typescript-eslint/no-unused-vars */
import { FindManyOptions, Like, Repository } from "typeorm";
import { deletedRes, errorRes, foundRes, notFoundRes } from "../responses";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FullTokenPayload } from "../types";
import { UserRole } from "../enums/users.enum";

export async function getAllHandler<T>({
    query,
    repository,
    table,
    blacklist,
}: {
    query: FindManyOptions;
    repository: Repository<T>;
    table: string;
    blacklist?: string[];
}) {
    try {
        const response = await repository.find(query);
        let filteredRecords: T[] = response;

        if (blacklist?.length > 0) {
            filteredRecords = response.map((record) => {
                blacklist.forEach((item) => {
                    delete record[item];
                });

                return record;
            });
        }

        return foundRes(
            filteredRecords?.length
                ? `${table} have been found`
                : `${table} list is empty`,
            filteredRecords,
            filteredRecords?.length || 0
        );
    } catch (error) {
        return errorRes(error);
    }
}

export async function getByIdHandler<T>({
    id,
    repository,
    table,
}: {
    id: string;
    repository: Repository<T>;
    table: string;
}) {
    try {
        const response = (await repository.findOneBy({ id } as any)) as T;

        return response
            ? foundRes(`${table} has been found`, response)
            : notFoundRes(`${table} does not exist`);
    } catch (error) {
        return errorRes(error.message);
    }
}

export async function createHandler<T>({
    dto,
    repository,
    foreigners = [],
    blacklist = [],
}: {
    dto: any;
    repository: Repository<T>;
    blacklist?: string[];
    foreigners?: {
        key: string;
        repository: Repository<any>;
        blacklist?: string[];
    }[];
}) {
    const finalObj = structuredClone(dto);

    await Promise.all(
        foreigners.map(
            async ({
                key,
                repository: foreignRepository,
                blacklist: foreignBlacklist,
            }) => {
                const foreignId = finalObj[key];
                delete finalObj[key];

                if (foreignId) {
                    const foreignRecord = await foreignRepository.findOneBy({
                        id: foreignId,
                    } as any);

                    if (!foreignRecord) {
                        return notFoundRes(`${key} doesn't exist`);
                    }

                    if (foreignBlacklist.length > 0) {
                        foreignBlacklist.forEach((item) => {
                            delete foreignRecord[item];
                        });
                    }

                    finalObj[key] = foreignRecord;
                }
            }
        )
    );

    const newRecord = repository.create(finalObj) as T;
    await repository.save(newRecord);

    if (blacklist.length > 0) {
        blacklist.forEach((item) => {
            delete newRecord[item];
        });
    }

    return newRecord;
}

export async function updateHandler<T>({
    id,
    dto,
    table,
    repository,
    foreigners = [],
    blacklist = [],
}: {
    id: string;
    dto: any;
    table: string;
    repository: Repository<T>;
    blacklist?: string[];
    // provide the names of the fields for the tables related to this
    // table to check if the related record exist or not
    foreigners?: {
        key: string;
        repository: Repository<any>;
        blacklist?: string[];
    }[];
}) {
    const record = (await repository.findOneBy({ id } as any)) as T;
    if (!record) {
        throw new NotFoundException(`${table} does not exist`);
    }

    const finalObj = structuredClone(dto);

    await Promise.all(
        foreigners.map(
            async ({
                key,
                repository: foreignRepository,
                blacklist: foreignBlacklist,
            }) => {
                const foreignId = finalObj[key];
                delete finalObj[key];

                if (foreignId) {
                    const foreignRecord = await foreignRepository.findOneBy({
                        id: foreignId,
                    } as any);

                    if (!foreignRecord) {
                        return notFoundRes(`${key} doesn't exist`);
                    }

                    if (foreignBlacklist.length > 0) {
                        foreignBlacklist.forEach((item) => {
                            delete foreignRecord[item];
                        });
                    }

                    finalObj[key] = foreignRecord;
                }
            }
        )
    );

    if (blacklist.length > 0) {
        blacklist.forEach((item) => {
            delete finalObj[item];
        });
    }

    return await repository.update(
        {
            id,
        } as any,
        finalObj
    );
}

export async function deleteHandler<T>({
    id,
    wipe,
    repository,
    table,
    userTokenData,
}: {
    id: string | undefined;
    wipe: boolean | undefined;
    repository: Repository<T>;
    table: string;
    userTokenData: FullTokenPayload;
}) {
    try {
        let record: any = {};

        // prevent non-admins from wiping data
        if (userTokenData?.role !== UserRole.ADMIN && wipe) {
            throw new UnauthorizedException(
                "Unauthorized, only admins can truncate tables"
            );
        }

        // check if the record exist
        if (id) {
            record = (await repository.findOneBy({ id } as any)) as T;
            if (!record) {
                throw new NotFoundException(`${table} does not exist`);
            }
        }

        // either delete a single record or truncate the whole table if specified
        const response = wipe
            ? await repository.query(
                  `TRUNCATE TABLE "${table.toLowerCase()}" CASCADE;`
              )
            : await repository.delete(id);

        return deletedRes<T>(
            wipe
                ? `Table "${table}" has been truncated`
                : `${table} has been deleted successfully`,
            response,
            record
        );
    } catch (error) {
        return errorRes(error.message);
    }
}
