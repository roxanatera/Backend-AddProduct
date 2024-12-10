import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  
import productRouter from './routes/productRoutes.js';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuración de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://adminproducts-app.netlify.app'
    : 'http://localhost:5173', // Cambia esto según el puerto de tu frontend local
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/products', productRouter);


// Ajustamos el host a la URL pública. Si lo tienes en Render, usa el dominio final.
// Por ejemplo: backend-addproduct.onrender.com
const hostUrl = process.env.NODE_ENV === 'production' 
  ? 'backend-addproduct.onrender.com'
  : `localhost:${PORT}`;

const swaggerSpec = {
  swagger: "2.0",
  info: {
    description: "API para la gestión de productos",
    version: "1.0.0",
    title: "API de Productos"
  },
  host: hostUrl,
  basePath: "/api",
  schemes: process.env.NODE_ENV === 'production' ? ["https"] : ["http"],
  paths: {
    "/products": {
      post: {
        summary: "Crear un nuevo producto",
        description: "Añade un nuevo producto al catálogo.",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Objeto del producto que se desea crear",
            required: true,
            schema: { $ref: "#/definitions/Product" }
          }
        ],
        responses: {
          201: { description: "Producto creado con éxito" }
        }
      },
      get: {
        summary: "Obtener todos los productos",
        description: "Devuelve una lista de todos los productos.",
        responses: {
          200: {
            description: "Operación exitosa",
            schema: {
              type: "array",
              items: { $ref: "#/definitions/Product" }
            }
          }
        }
      }
    },
    "/products/{id}": {
      get: {
        summary: "Obtener un producto por ID",
        description: "Devuelve un producto específico dado su ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "ID del producto a obtener"
          }
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
        description: "Actualiza los datos de un producto existente.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "ID del producto a actualizar"
          },
          {
            in: "body",
            name: "body",
            description: "Objeto del producto con los nuevos datos",
            required: true,
            schema: { $ref: "#/definitions/Product" }
          }
        ],
        responses: {
          200: { description: "Producto actualizado con éxito" },
          404: { description: "Producto no encontrado" }
        }
      },
      delete: {
        summary: "Eliminar un producto",
        description: "Elimina un producto existente dado su ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "ID del producto a eliminar"
          }
        ],
        responses: {
          200: { description: "Producto eliminado con éxito" },
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

// Ruta básica
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Productos. Visita <a href="/api-docs">/api-docs</a> para la documentación.');
});

// Conexión a MongoDB
if (!MONGODB_URI) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
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
