import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Importa CORS
import productRouter from './routes/productRoutes';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuración de CORS para permitir solicitudes desde el frontend en desarrollo (localhost) o en producción (Netlify)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://adminproducts-app.netlify.app'  // URL de producción en Netlify
    : 'http://localhost:3000',  // URL de desarrollo en localhost
};

app.use(cors(corsOptions)); // Usa la configuración de CORS según el entorno
app.use(express.json());
app.use('/api/products', productRouter);

// Configuración de Swagger para desarrollo y producción
const swaggerSpec = {
  swagger: "2.0",
  info: {
    description: "API para la gestión de productos",
    version: "1.0.0",
    title: "API de Productos"
  },
  host: process.env.NODE_ENV === 'production' 
    ? `${process.env.HOST}`  // En producción, usa el host dinámico
    : `localhost:${PORT}`,     // En desarrollo, usa localhost
  basePath: "/api",
  schemes: process.env.NODE_ENV === 'production' ? ["https"] : ["http"],  // Usar HTTPS en producción
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

// Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Agregar una ruta básica para evitar el mensaje "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Productos. Visita <a href="/api-docs">/api-docs</a> para la documentación.');
});

// Conexión a MongoDB y ejecución del servidor
if (!MONGODB_URI) {
    console.error("MongoDB URI is not defined in the environment variables.");
    process.exit(1); // Termina el proceso si la URI no está definida
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
export default app;
