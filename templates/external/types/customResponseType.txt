type CustomResponseType<dataType> = {
    message: string;
    data: dataType;
    status: number;
};

export default CustomResponseType;
