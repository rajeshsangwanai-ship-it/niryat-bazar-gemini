import { Schema, model, models, Document } from 'mongoose';

export interface IPriceTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPriceUSD: number;
}

export interface IProduct extends Document {
  exporterId: string; // Relational link to PostgreSQL User ID
  title: string;
  slug: string;
  hsCode: string; // Harmonized System Code for Customs
  categories: string[];
  minOrderQuantity: {
    value: number;
    unit: string;
  };
  priceTiers: IPriceTier[];
  availableIncoterms: Array<'FOB' | 'CIF' | 'EXW' | 'CFR' | 'DDP'>;
  specifications: Record<string, any>; // Dynamic Key-Value (e.g., Purity, Moisture, Thread Count)
  certifications: Array<{
    name: string; // e.g., ISO-9001, CE, Spice Board India, FSSAI
    certificateNumber: string;
    documentUrl: string;
  }>;
  shippingSpecs: {
    weightKg: number;
    dimensionsCm: { length: number; width: number; height: number };
    portOfOrigin: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PriceTierSchema = new Schema<IPriceTier>({
  minQuantity: { type: Number, required: true },
  maxQuantity: { type: Number },
  unitPriceUSD: { type: Number, required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    exporterId: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    hsCode: { type: String, required: true, index: true },
    categories: [{ type: String, index: true }],
    minOrderQuantity: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    priceTiers: [PriceTierSchema],
    availableIncoterms: [{ type: String, enum: ['FOB', 'CIF', 'EXW', 'CFR', 'DDP'] }],
    specifications: { type: Map, of: Schema.Types.Mixed },
    certifications: [
      {
        name: { type: String, required: true },
        certificateNumber: { type: String, required: true },
        documentUrl: { type: String, required: true },
      },
    ],
    shippingSpecs: {
      weightKg: { type: Number },
      dimensionsCm: {
        length: Number,
        width: Number,
        height: Number,
      },
      portOfOrigin: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', hsCode: 'text', 'specifications': 'text' });

export const Product = models.Product || model<IProduct>('Product', ProductSchema);