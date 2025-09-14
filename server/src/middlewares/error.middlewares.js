import mongoose from 'mongoose';
import { Apierror } from '../Utils/ApiError.js';

const errorhandler = (err, req, res, next) => {
    let error = err

    if(!(error instanceof Apierror)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500

        const message = error.message || "Something went wrong"
        error = new Apierror(statusCode, message, error?.errors || [], err.stack)
    }

    const statusCode = error.statusCode || 500;

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? {stack: error.stack } : {})
    }
    console.log(statusCode)

    return res.status(statusCode).json(response)

}

export {errorhandler}