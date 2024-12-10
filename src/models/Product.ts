import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre del producto es obligatorio'], 
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, 'El precio del producto es obligatorio'], 
    min: [0, 'El precio no puede ser negativo'] 
  },
  available: { 
    type: Boolean, 
    required: [true, 'La disponibilidad del producto es obligatoria'], 
    default: true 
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
