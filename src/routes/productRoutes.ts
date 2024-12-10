import express from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();


// POST /api/products
router.post('/', createProduct);

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProduct);

// PUT /api/products/:id
router.put('/:id', updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

export default router;
