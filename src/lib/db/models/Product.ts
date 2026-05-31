import mongoose, { Schema, models, model } from "mongoose";

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    path: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    details: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    images: { type: [ProductImageSchema], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", details: "text" });

export default models.Product || model("Product", ProductSchema);
