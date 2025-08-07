import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import {registerRequest, loginRequest, forgotPasswordRequest, resetPasswordRequest} from "./swagger/auth.js";

dotenv.config()

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BGL API",
            version: "0.0.1",
            description: "BGL API documentation",
        },
        servers: [
            {
                url: process.env.BACKEND_URL
            }
        ],
        components: {
            schemas: {
                registerRequest,
                loginRequest,
                forgotPasswordRequest,
                resetPasswordRequest
            }
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}