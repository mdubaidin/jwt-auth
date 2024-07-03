class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = 'CustomError';
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default CustomError;
