import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Importa CORS
import productRouter from './routes/productRoutes';
import swaggerUi from 'swagger-ui-express';
import path from 'path'; // Importa path para resolver las rutas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("The MongoDB URI is not defined in the environment variables.");
    process.exit(1);
}

// Configuración del Middleware
app.use(cors()); 
app.use(express.json());
app.use('/api/products', productRouter);

// Configuración de Swagger UI usando swagger.json
try {
    
    const swaggerDocument = require(path.resolve(__dirname, '../swagger.json')); // Carga el archivo JSON desde la carpeta dist o src
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger documentation is ready at /api-docs');
} catch (error) {
    console.error('Error loading Swagger documentation:', error);
}


mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        // Inicia el servidor solo si la conexión a la base de datos fue exitosa
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
