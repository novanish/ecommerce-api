const getAllProducts = async (req, res) => {
  res.send("All products");
};

const getProductById = async (req, res) => {
  res.send("Single product");
};

const createProduct = async (req, res) => {
  res.send("Create product");
};

const updateProduct = async (req, res) => {
  res.send("Update product");
};

const uploadProductImage = async (req, res) => {
  res.send("Upload product image");
};

const deleteProduct = async (req, res) => {
  res.send("Delete product");
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
};
