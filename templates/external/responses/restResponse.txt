function foundRes<DataType>(message: string, data: DataType) {
    return {
        message,
        data,
        status: 200,
    };
}

function notFoundRes(message: string) {
    return {
        message,
        data: null,
        status: 404,
    };
}

function newInstanceRes<DataType>(message: string, data: DataType) {
    return {
        message,
        data,
        status: 201,
    };
}

function forbiddenRes(message: string) {
    return {
        message,
        data: null,
        status: 401,
    };
}

function deletedRes<DataType>(message: string, data: DataType) {
    return {
        message,
        data,
        status: 200,
    };
}

function errorRes(error: any) {
    return { message: "Error occurred", data: error, status: 500 };
}

export {
    foundRes,
    notFoundRes,
    newInstanceRes,
    forbiddenRes,
    deletedRes,
    errorRes,
};
