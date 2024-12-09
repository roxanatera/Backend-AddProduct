import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/productRoutes';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("The MongoDB URI is not defined in the environment variables.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/api/products', productRouter);


const swaggerSpec = {
    swagger: "2.0",
    info: {
        description: "API para la gestión de productos",
        version: "1.0.0",
        title: "API de Productos"
    },
    host: "localhost:5000",
    basePath: "/api",
    schemes: ["http"],
    paths: {
        "/products": {
            get: {
                summary: "Obtener todos los productos",
                description: "Devuelve una lista de todos los productos",
                responses: {
                    200: {
                        description: "Operación exitosa",
                        schema: {
                            type: "array",
                            items: { $ref: "#/definitions/Product" }
                        }
                    }
                }
            },
            post: {
                summary: "Crear un nuevo producto",
                description: "Añade un nuevo producto al catálogo",
                parameters: [
                    {
                        in: "body",
                        name: "body",
                        description: "Objeto de producto que necesita ser añadido a la tienda",
                        required: true,
                        schema: { $ref: "#/definitions/Product" }
                    }
                ],
                responses: { 201: { description: "Producto creado" } }
            }
        },
        "/products/{id}": {
            get: {
                summary: "Obtener un producto por ID",
                description: "Devuelve un solo producto",
                parameters: [
                    { name: "id", in: "path", required: true, type: "string" }
                ],
                responses: {
                    200: {
                        description: "Operación exitosa",
                        schema: { $ref: "#/definitions/Product" }
                    },
                    404: { description: "Producto no encontrado" }
                }
            },
            put: {
                summary: "Actualizar un producto existente",
                description: "Actualiza un objeto de producto",
                parameters: [
                    { name: "id", in: "path", required: true, type: "string" },
                    {
                        in: "body",
                        name: "body",
                        description: "Objeto de producto que necesita ser actualizado",
                        required: true,
                        schema: { $ref: "#/definitions/Product" }
                    }
                ],
                responses: {
                    200: { description: "Producto actualizado" },
                    404: { description: "Producto no encontrado" }
                }
            },
            delete: {
                summary: "Eliminar un producto",
                description: "Elimina un producto del catálogo",
                parameters: [
                    { name: "id", in: "path", required: true, type: "string" }
                ],
                responses: {
                    200: { description: "Producto eliminado" },
                    404: { description: "Producto no encontrado" }
                }
            }
        }
    },
    definitions: {
        Product: {
            type: "object",
            required: ["name", "price", "available"],
            properties: {
                name: { type: "string" },
                price: { type: "number" },
                available: { type: "boolean" }
            }
        }
    }
};
// Configurar Swagger UI con el objeto
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;


mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
