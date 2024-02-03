function validRes(message: string, data: string) {
    return { message, data, status: 200 };
}

function invalidRes(message: string, data: string) {
    return { message, data, status: 400 };
}

function validationError(message: string, errors: string[]) {
    return { message, data: null, status: 500, errors };
}

export { validRes, invalidRes, validationError };
