import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { search = "", category = "" } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { product_name: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } }
    ];
  }

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.deleteOne();
  res.json({ message: "Product deleted" });
};
