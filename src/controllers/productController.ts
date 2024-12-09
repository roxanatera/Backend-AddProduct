import Product from '../models/Product';
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, available } = req.body;
    try {
        const newProduct = new Product({ name, price, available });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(409).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(404).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(404).json({ message: 'An unknown error occurred' });
        }
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, available } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, available }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(updatedProduct);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(404).json({ message: 'An unknown error occurred' });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(404).json({ message: 'An unknown error occurred' });
        }
    }
};
