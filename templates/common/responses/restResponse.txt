export function foundRes<DataType>(
    message: string,
    payload: DataType,
    count?: number
) {
    return {
        message,
        payload,
        status: 200,
        extra: {
            count,
        },
    };
}

export function notFoundRes(message: string) {
    return {
        message,
        payload: null,
        status: 404,
    };
}

export function newInstanceRes<DataType>(message: string, payload: DataType) {
    return {
        message,
        payload,
        status: 201,
    };
}

export function updatedRes<DataType>(
    message: string,
    payload: DataType,
    changes?: any
) {
    return {
        message,
        payload,
        status: 200,
        extra: {
            changes,
        },
    };
}

export function forbiddenRes(message: string) {
    return {
        message,
        payload: null,
        status: 401,
    };
}

export function deletedRes<DataType>(
    message: string,
    payload: any,
    record?: DataType
) {
    return {
        message,
        payload,
        status: 200,
        extra: {
            record,
        },
    };
}

export function errorRes(error: any) {
    return { message: "Error occurred", payload: error, status: 500 };
}
