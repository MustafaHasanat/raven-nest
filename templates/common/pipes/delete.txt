/* eslint-disable @typescript-eslint/no-unused-vars */
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { DeleteQueryProps } from "../types";

@Injectable()
export class DELETE_Pipe implements PipeTransform<any> {
    constructor() {}

    transform(query: DeleteQueryProps) {
        if (!query) throw new BadRequestException("query must be defined");

        const { wipe } = query;

        const finalQuery: DeleteQueryProps = structuredClone(query);

        // check the wipe query
        if (typeof wipe === "string") {
            finalQuery.wipe = wipe === "true";
        }

        return finalQuery;
    }
}
