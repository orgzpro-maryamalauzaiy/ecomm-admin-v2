import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
// import {uploadImage} from "../../utils/uploads/uploadImage"

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

export default function ProductCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState(null);
  const [categories, setCategories] = useState([])

  // Local state for modal form
  const [modalVariation, setModalVariation] = useState({
    color: "",
    size: "",
    price: 0,
    stock: 0,
    sku: "",
    id: null
  });

  // Product state
  const [product, setProduct] = useState({
    image: null,
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    discount: 0,
    bg_color: "#ffffff",
    panel_color: "#f3f4f6",
    text_color: "#000000",
    category_id: "",
    sku: "",
    colors: [],
    sizes: [],
    variations: [],
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Options
  const categoryOptions = [
    { value: "electronics", label: "Elektronik" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Rumah Tangga" },
    { value: "health", label: "Kesehatan" },
    { value: "sports", label: "Olahraga" },
    { value: "books", label: "Buku & Alat Tulis" },
  ];

  const colorOptions = [
    { value: "red", label: "Merah", hex: "#ef4444" },
    { value: "blue", label: "Biru", hex: "#3b82f6" },
    { value: "green", label: "Hijau", hex: "#10b981" },
    { value: "yellow", label: "Kuning", hex: "#f59e0b" },
    { value: "purple", label: "Ungu", hex: "#8b5cf6" },
    { value: "pink", label: "Pink", hex: "#ec4899" },
    { value: "black", label: "Hitam", hex: "#000000" },
    { value: "white", label: "Putih", hex: "#ffffff" },
    { value: "gray", label: "Abu-abu", hex: "#6b7280" },
  ];

  const sizeOptions = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
    { value: "all_size", label: "All Size" },
  ];

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    try {

      await axios.get(`${BASE_URL}/categories`)
                  .then(result => {
                    if(result.status === 200){
                      setCategories(result.data.data)
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    toast.error("Failed, Failed when get categories: " + error)
                  })

    } catch (error) {

      toast.error("Failed, Failed when get categories: "+ error)
    }
  }

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    console.log('file', file)

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // const url = await uploadImage(file)

    // console.log('url', url)



    // setImagePreview(url);
    setImagePreview(URL.createObjectURL(file));
    setProduct(prev => ({ ...prev, image: file }));
  };

  const handleColorToggle = (colorValue) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(colorValue)
        ? prev.filter(c => c !== colorValue)
        : [...prev, colorValue];
      setProduct(prevProduct => ({ ...prevProduct, colors: newColors }));
      return newColors;
    });
  };

  const handleSizeToggle = (sizeValue) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(sizeValue)
        ? prev.filter(s => s !== sizeValue)
        : [...prev, sizeValue];
      setProduct(prevProduct => ({ ...prevProduct, sizes: newSizes }));
      return newSizes;
    });
  };

  // Open modal for adding new variation
  const openAddVariationModal = () => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.warning('Select colors and sizes first');
      return;
    }
    setModalVariation({
      color: selectedColors[0],
      size: selectedSizes[0],
      price: product.original_price,
      stock: 0,
      sku: "",
      id: null
    });
    setEditingVariation(null);
    setShowVariationModal(true);
  };

  // Open modal for editing variation
  const openEditVariationModal = (variation) => {
    setModalVariation({
      color: variation.color,
      size: variation.size,
      price: variation.price,
      stock: variation.stock,
      sku: variation.sku || "",
      id: variation.id
    });
    setEditingVariation(variation);
    setShowVariationModal(true);
  };

  // Handle modal input changes
  const handleModalChange = (field, value) => {
    setModalVariation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddVariation = () => {
    // Validate
    if (!modalVariation.color || !modalVariation.size) {
      toast.error('Please select color and size');
      return;
    }
    if (modalVariation.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (editingVariation) {
      // Update existing variation
      setProduct(prev => ({
        ...prev,
        variations: prev.variations.map(v =>
          v.id === editingVariation.id ? { ...modalVariation, id: v.id } : v
        )
      }));
      toast.success('Variation updated');
    } else {
      // Check if variation already exists
      const exists = product.variations.some(
        v => v.color === modalVariation.color && v.size === modalVariation.size
      );
      if (exists) {
        toast.error('This variation already exists');
        return;
      }
      // Add new variation
      setProduct(prev => ({
        ...prev,
        variations: [...prev.variations, { ...modalVariation, id: Date.now().toString() }]
      }));
      toast.success('Variation added');
    }

    setShowVariationModal(false);
    setEditingVariation(null);
    setModalVariation({
      color: "",
      size: "",
      price: 0,
      stock: 0,
      sku: "",
      id: null
    });
  };

  const handleDeleteVariation = (variationId) => {
    if (window.confirm('Delete this variation?')) {
      setProduct(prev => ({
        ...prev,
        variations: prev.variations.filter(v => v.id !== variationId)
      }));
      toast.success('Variation deleted');
    }
  };

  const generateAllCombinations = () => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.warning('Select colors and sizes first');
      return;
    }

    const newVariations = [];
    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const exists = product.variations.some(v => v.color === color && v.size === size);
        if (!exists) {
          newVariations.push({
            color,
            size,
            price: product.original_price,
            stock: 0,
            sku: `${product.sku || 'VAR'}-${color}-${size}`.toUpperCase(),
            id: `${color}-${size}-${Date.now()}-${Math.random()}`
          });
        }
      }
    }

    if (newVariations.length > 0) {
      setProduct(prev => ({
        ...prev,
        variations: [...prev.variations, ...newVariations]
      }));
      toast.success(`${newVariations.length} variations added`);
    } else {
      toast.info('All combinations already exist');
    }
  };

  const totalStock = product.variations.reduce((sum, v) => sum + (v.stock || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.description || !product.category_id || product.original_price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!product.image) {
      toast.error('Please upload a product image');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', product.image);
      // if (product.image)
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('original_price', product.original_price.toString());
      formData.append('discount', product.discount.toString());
      formData.append('price', product.price.toString());
      formData.append('bg_color', product.bg_color);
      formData.append('panel_color', product.panel_color);
      formData.append('text_color', product.text_color);
      formData.append('category_id', product.category_id);
      formData.append('sku', product.sku);
      formData.append('colors', JSON.stringify(product.colors));
      formData.append('sizes', JSON.stringify(product.sizes));
      formData.append('variations', JSON.stringify(product.variations));

      console.log('formData', formData)
      console.log('image', product)

      const response = await axios.post(`${BASE_URL}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Product created successfully!');
        navigate('/products');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    } finally {
      setIsUploading(false);
    }
  };

  // Variation Modal JSX
  const VariationModal = () => (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-600 flex items-center justify-center z-1200" onClick={() => {
      // bg-black
      setShowVariationModal(false);
      setEditingVariation(null);
    }}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">
          {editingVariation ? 'Edit Variation' : 'Add New Variation'}
        </h3>

        <div className="space-y-4">
          <div>
            <Label>Color</Label>
            <select
              value={modalVariation.color}
              onChange={(e) => handleModalChange('color', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select color</option>
              {selectedColors.map(color => {
                const colorOption = colorOptions.find(c => c.hex === color);
                return (
                  <option key={color} value={color}>
                    {colorOption?.label || color}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <Label>Size</Label>
            <select
              value={modalVariation.size}
              onChange={(e) => handleModalChange('size', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select size</option>
              {selectedSizes.map(size => {
                const sizeOption = sizeOptions.find(s => s.value === size);
                return (
                  <option key={size} value={size}>
                    {sizeOption?.label || size}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <Label>Price (Rp)</Label>
            <input
              type="number"
              value={modalVariation.price}
              onChange={(e) => handleModalChange('price', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Price"
            />
          </div>

          <div>
            <Label>Stock</Label>
            <input
              type="number"
              value={modalVariation.stock}
              onChange={(e) => handleModalChange('stock', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Stock quantity"
            />
          </div>

          <div>
            <Label>Kode Produk (Opsional)</Label>
            <input
              type="text"
              value={modalVariation.sku}
              onChange={(e) => handleModalChange('sku', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Unique SKU"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setShowVariationModal(false);
              setEditingVariation(null);
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddVariation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingVariation ? 'Update' : 'Add'} Variation
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ComponentCard title="Create New Product">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <Label htmlFor="image">Product Image <span className="text-red-500">*</span></Label>
          <div className="mt-2">
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/*"
                name="image"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isUploading}
              />
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isUploading ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
              }`}>
                <div className="flex flex-col items-center justify-center">
                  {isUploading ? (
                    <>
                      <div className="relative w-20 h-20 mb-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                        </div>
                      </div>
                      <p className="text-blue-500 font-medium">Uploading...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </>
                  ) : imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-3" />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(imagePreview);
                          setImagePreview("");
                          setProduct(prev => ({ ...prev, image: null }));
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Click to upload product image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              type="text"
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleInputChange}
              placeholder="PROD-001"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={product.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            placeholder="Enter detailed product description"
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <select
            id="category"
            value={product.category_id}
            onChange={(e) => setProduct(prev => ({ ...prev, category_id: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            required
          >
            <option value="">Select category</option>
            {categories.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="original_price">Original Price <span className="text-red-500">*</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
              <Input
                type="number"
                id="original_price"
                name="original_price"
                value={product.original_price || ''}
                onChange={handleNumberChange}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              type="number"
              id="discount"
              name="discount"
              value={product.discount || ''}
              onChange={handleNumberChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="price">Selling Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
              <Input
                type="number"
                id="price"
                name="price"
                value={product.price || ''}
                onChange={handleNumberChange}
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Colors Selection */}
        <div>
          <Label>Available Colors</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorToggle(color.hex)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedColors.includes(color.hex)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                }`}
              >
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.hex }} />
                <span className="text-sm">{color.label}</span>
              </button>
            ))}
          </div>
          {selectedColors.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedColors.map(c => colorOptions.find(o => o.value === c)?.label).join(', ')}
            </p>
          )}
        </div>

        {/* Sizes Selection */}
        <div>
          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizeOptions.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => handleSizeToggle(size.value)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  selectedSizes.includes(size.value)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 text-gray-700'
                }`}
              >
                <span className="text-sm font-medium">{size.label}</span>
              </button>
            ))}
          </div>
          {selectedSizes.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedSizes.map(s => sizeOptions.find(o => o.value === s)?.label).join(', ')}
            </p>
          )}
        </div>

        {/* Variations Section */}
        {(selectedColors.length > 0 || selectedSizes.length > 0) && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <Label>Product Variations</Label>
              <div className="flex gap-2">
                {selectedColors.length > 0 && selectedSizes.length > 0 && (
                  <button
                    type="button"
                    onClick={generateAllCombinations}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Generate All
                  </button>
                )}
                <button
                  type="button"
                  onClick={openAddVariationModal}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Add Variation
                </button>
              </div>
            </div>

            {product.variations.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No variations added. Add variations to manage different color and size combinations.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Color</th>
                      <th className="px-3 py-2 text-left">Size</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Stock</th>
                      <th className="px-3 py-2 text-left">SKU</th>
                      <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variations.map((variation, key) => (
                      <tr key={variation.id || key} className="border-t dark:border-gray-700">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: colorOptions.find(c => c.value === variation.color)?.hex }}
                            />
                            {colorOptions.find(c => c.value === variation.color)?.label || variation.color}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {sizeOptions.find(s => s.value === variation.size)?.label || variation.size}
                        </td>
                        <td className="px-3 py-2 text-right">Rp {variation.price?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{variation.stock}</td>
                        <td className="px-3 py-2">{variation.sku || '-'}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => openEditVariationModal(variation)}
                            className="text-blue-600 hover:text-blue-700 mx-1 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariation(variation.id)}
                            className="text-red-600 hover:text-red-700 mx-1 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-right">Total Stock:</td>
                      <td className="px-3 py-2 text-right">{totalStock}</td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Color Customization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="bg_color"
                value={product.bg_color}
                onChange={handleInputChange}
                className="w-10 h-10 cursor-pointer rounded border"
              />
              <Input
                type="text"
                name="bg_color"
                value={product.bg_color}
                onChange={handleInputChange}
                className="font-mono"
              />
            </div>
          </div>
          <div>
            <Label>Panel Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="panel_color"
                value={product.panel_color}
                onChange={handleInputChange}
                className="w-10 h-10 cursor-pointer rounded border"
              />
              <Input
                type="text"
                name="panel_color"
                value={product.panel_color}
                onChange={handleInputChange}
                className="font-mono"
              />
            </div>
          </div>
          <div>
            <Label>Text Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="text_color"
                value={product.text_color}
                onChange={handleInputChange}
                className="w-10 h-10 cursor-pointer rounded border"
              />
              <Input
                type="text"
                name="text_color"
                value={product.text_color}
                onChange={handleInputChange}
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isUploading || !product.image}
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Create Product'}
          </button>
        </div>
      </form>

      {/* Variation Modal */}
      {showVariationModal && <VariationModal />}
    </ComponentCard>
  );
}
// import React, { useState } from "react";
// import { useNavigate } from "react-router";
// import ComponentCard from "../../common/ComponentCard.tsx";
// import Label from "../Label.tsx";
// import Input from "../input/InputField.tsx";
// import Select from "../Select.tsx";
// // import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons/index.ts";
// // import DatePicker from "../date-picker.tsx";

// import axios from "axios";
// // Define Product Type
// interface Product {
//   image: File | null; // Changed back to File for upload
//   name: string;
//   description: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   bgColor: string;
//   panelColor: string;
//   textColor: string;
//   stock: number;
//   category: string;
//   sku: string;
//   colors: string[];
// }

// // Define Category Option Type
// interface CategoryOption {
//   value: string;
//   label: string;
// }

// // Define Color Option Type
// interface ColorOption {
//   value: string;
//   label: string;
//   hex: string;
// }

// const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_PROD_URL

// export default function ProductCreate() {
//   // Initial state for the product
//   const [product, setProduct] = useState<Product>({
//     image: null,
//     name: "",
//     description: "",
//     price: 0,
//     originalPrice: 0,
//     discount: 0,
//     bgColor: "#ffffff",
//     panelColor: "#f3f4f6",
//     textColor: "#000000",
//     stock: 0,
//     category: "",
//     sku: "",
//     colors: [],
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedColors, setSelectedColors] = useState<string[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [imagePreview, setImagePreview] = useState<string>("");

//   const navigate = useNavigate()
//   // Category options
//   const categoryOptions: CategoryOption[] = [
//     { value: "electronics", label: "Electronik" },
//     { value: "fashion", label: "Fashion" },
//     { value: "home", label: "Rumah Tangga" },
//     { value: "health", label: "Kesehatan" },
//     { value: "sports", label: "Olahraga" },
//     { value: "books", label: "Buku & Alat Tulis" },
//     { value: "automotive", label: "Otomotif" },
//     { value: "beauty", label: "Kecantikan" },
//     { value: "food", label: "Makanan & Minuman" },
//     { value: "toys", label: "Mainan & Hobi" },
//   ];

//   // Color options
//   const colorOptions: ColorOption[] = [
//     { value: "red", label: "Merah", hex: "#ef4444" },
//     { value: "blue", label: "Biru", hex: "#3b82f6" },
//     { value: "green", label: "Hijau", hex: "#10b981" },
//     { value: "yellow", label: "Kuning", hex: "#f59e0b" },
//     { value: "purple", label: "Ungu", hex: "#8b5cf6" },
//     { value: "pink", label: "Pink", hex: "#ec4899" },
//     { value: "black", label: "Hitam", hex: "#000000" },
//     { value: "white", label: "Putih", hex: "#ffffff" },
//     { value: "gray", label: "Abu-abu", hex: "#6b7280" },
//     { value: "brown", label: "Coklat", hex: "#92400e" },
//   ];

//   // Handle input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     if (e.target.type === 'number') {
//       setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
//     } else {
//       setProduct(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Check file type
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file (JPEG, PNG, GIF, etc.)');
//       return;
//     }

//     // Check file size (e.g., limit to 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }

//     // Create preview URL
//     const previewUrl = URL.createObjectURL(file);
//     setImagePreview(previewUrl);

//     // Update product state with the file
//     setProduct(prev => ({
//       ...prev,
//       image: file
//     }));

//   };

//   // Handle select change
//   const handleSelectChange = (name: string, value: string) => {
//     setProduct(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle color selection
//   const handleColorToggle = (colorValue: string) => {
//     setSelectedColors(prev => {
//       const newColors = prev.includes(colorValue)
//         ? prev.filter(c => c !== colorValue)
//         : [...prev, colorValue];

//       setProduct(prevProduct => ({ ...prevProduct, colors: newColors }));
//       return newColors;
//     });
//   };

//   // Handle form submission with file upload
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log(product)

//     // Validate required fields
//     if (!product.name || !product.description || !product.category || product.originalPrice <= 0) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     // Validate image
//     if (!product.image) {
//       alert('Please upload a product image');
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       // Create FormData for file upload
//       const formData = new FormData();

//       // Append image file
//       if (product.image) {
//         formData.append('image', product.image);
//       }

//       console.log(product.image)

//       // Append other product data
//       formData.append('name', product.name);
//       formData.append('description', product.description);
//       formData.append('price', product.price.toString());
//       formData.append('originalPrice', product.originalPrice.toString());
//       formData.append('discount', product.discount.toString());
//       formData.append('bgColor', product.bgColor);
//       formData.append('panelColor', product.panelColor);
//       formData.append('textColor', product.textColor);
//       formData.append('stock', product.stock.toString());
//       formData.append('category', product.category);
//       formData.append('sku', product.sku);
//       formData.append('colors', JSON.stringify(product.colors));

//       // Create XMLHttpRequest for progress tracking
//       // const xhr = new XMLHttpRequest();

//       // // Track upload progress
//       // xhr.upload.addEventListener('progress', (event) => {
//       //   if (event.lengthComputable) {
//       //     const percentComplete = (event.loaded / event.total) * 100;
//       //     setUploadProgress(Math.round(percentComplete));
//       //   }
//       // });

//       // Handle response
//       // xhr.onreadystatechange = () => {
//       //   if (xhr.readyState === 4) {
//       //     if (xhr.status === 200) {
//       //       const response = JSON.parse(xhr.responseText);
//       //       alert('Product created successfully!');
//       //       console.log('Product created:', response);
//       //       resetForm();
//       //     } else {
//       //       throw new Error('Failed to create product');
//       //     }
//       //     setIsUploading(false);
//       //   }
//       // };

//       // // Handle errors
//       // xhr.onerror = () => {
//       //   setIsUploading(false);
//       //   alert('Network error occurred. Please try again.');
//       // };

//       // // Open and send request
//       // xhr.open('POST', '/api/products', true);
//       // xhr.send(formData);

//       const response = await axios.post(`${BASE_URL || 'http://localhost:3030'}/products`, formData, {headers: {
//           'Content-Type': 'multipart/form-data'
//         },
//           withCredentials: true
//         });

//         console.log(response)

//       if (response.status == 200) {
//         const result = await response.data;
//         alert('Product created successfully!');
//         resetForm();

//         navigate('/products')
//       } else {
//         throw new Error('Failed to create product');
//       }

//       // For demo purposes (if no API endpoint)
//       if (process.env.NODE_ENV === 'development') {
//         console.log('FormData contents:');
//         for (let [key, value] of formData.entries()) {
//           if (key === 'image') {
//             console.log(`${key}:`, (value as File).name, `(${(value as File).size} bytes)`);
//           } else {
//             console.log(`${key}:`, value);
//           }
//         }



//         // Simulate upload
//         // setTimeout(() => {
//         //   setUploadProgress(100);
//         //   setTimeout(() => {
//         //     alert('Product submitted successfully! (Check console for FormData contents)');
//         //     resetForm();
//         //     setIsUploading(false);
//         //   }, 500);
//         // }, 2000);
//       }

//     } catch (error) {
//       console.error('Error creating product:', error);
//       alert('Failed to create product. Please try again.');
//       setIsUploading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setProduct({
//       image: null,
//       name: "",
//       description: "",
//       price: 0,
//       originalPrice: 0,
//       discount: 0,
//       bgColor: "#ffffff",
//       panelColor: "#f3f4f6",
//       textColor: "#000000",
//       stock: 0,
//       category: "",
//       sku: "",
//       colors: [],
//     });
//     setSelectedColors([]);
//     setUploadProgress(0);

//     // Clean up object URL
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview);
//       setImagePreview("");
//     }
//   };

//   // Update price when discount changes
//   const handleDiscountChange = (value: number) => {
//     setProduct(prev => {
//       const newPrice = prev.originalPrice * (1 - value / 100);
//       return {
//         ...prev,
//         discount: value,
//         price: Math.round(newPrice)
//       };
//     });
//   };

//   // Update discount when price changes
//   const handlePriceChange = (value: number) => {
//     setProduct(prev => {
//       const discount = prev.originalPrice > 0
//         ? ((prev.originalPrice - value) / prev.originalPrice) * 100
//         : 0;
//       return {
//         ...prev,
//         price: value,
//         discount: Math.round(discount * 100) / 100
//       };
//     });
//   };

//   // Format file size
//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <ComponentCard title="Create New Product">
//       <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
//         {/* Image Upload */}
//         <div>
//           <Label htmlFor="image">
//             Product Image <span className="text-red-500">*</span>
//           </Label>
//           <div className="mt-2">
//             <div className="relative">
//               <Input
//                 type="file"
//                 id="image"
//                 name="image"
//                 // accept="image/*"
//                 onChange={handleFileUpload}
//                 className="opacity-0 absolute z-0 w-full h-full cursor-pointer"
//                 disabled={isUploading}
//               />
//               <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                 isUploading ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
//               }`}>
//                 <div className="flex flex-col items-center justify-center">
//                   {isUploading ? (
//                     <>
//                       <div className="relative w-20 h-20 mb-4">
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
//                         </div>
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <span className="text-blue-600 font-bold">{uploadProgress}%</span>
//                         </div>
//                       </div>
//                       <p className="text-blue-500 font-medium">Uploading...</p>
//                       <p className="text-sm text-gray-500 mt-1">Please wait while we upload your image</p>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
//                         <div
//                           className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                           style={{ width: `${uploadProgress}%` }}
//                         ></div>
//                       </div>
//                     </>
//                   ) : imagePreview ? (
//                     <>
//                       <div className="relative w-32 h-32 mx-auto mb-3 border border-gray-300 rounded-lg overflow-hidden">
//                         <img
//                           src={imagePreview}
//                           alt="Preview"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       {/* <p className="text-green-600 font-medium">Image Selected ✓</p> */}
//                       {product.image && (
//                         <>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {product.image.name}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             Size: {formatFileSize(product.image.size)} | Type: {product.image.type}
//                           </p>
//                         </>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (imagePreview) {
//                             URL.revokeObjectURL(imagePreview);
//                             setImagePreview("");
//                           }
//                           setProduct(prev => ({ ...prev, image: null }));
//                         }}
//                         className="mt-2 text-sm text-red-600 hover:text-red-700"
//                       >
//                         Hapus Gambar
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       <p className="text-gray-600 font-medium">Upload Product Image</p>
//                       <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
//                       <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {!product.image && !isUploading && (
//               <p className="text-sm text-gray-500 mt-2">
//                 <span className="text-red-500">*</span> Product image is required
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Product Name */}
//         <div>
//           <Label htmlFor="name">
//             Product Name <span className="text-red-500">*</span>
//           </Label>
//           <Input
//             type="text"
//             id="name"
//             name="name"
//             value={product.name}
//             onChange={handleInputChange}
//             placeholder="Enter product name"
//             required
//             disabled={isUploading}
//           />
//         </div>

//         {/* SKU */}
//         <div>
//           <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
//           <Input
//             type="text"
//             id="sku"
//             name="sku"
//             value={product.sku}
//             onChange={handleInputChange}
//             placeholder="e.g., PROD-001"
//             disabled={isUploading}
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <Label htmlFor="description">
//             Description <span className="text-red-500">*</span>
//           </Label>
//           <textarea
//             id="description"
//             name="description"
//             rows={4}
//             value={product.description}
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
//             placeholder="Enter detailed product description"
//             required
//             disabled={isUploading}
//           />
//         </div>

//         {/* Category Selection */}
//         <div>
//           <Label htmlFor="category">
//             Category <span className="text-red-500">*</span>
//           </Label>
//           <Select
//             id="category"
//             options={categoryOptions}
//             placeholder="Select a category"
//             value={product.category}
//             onChange={(value) => handleSelectChange('category', value)}
//             className="dark:bg-gray-800"
//             required
//             disabled={isUploading}
//           />
//         </div>

//         {/* Price Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <Label htmlFor="originalPrice">
//               Original Price <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 Rp
//               </span>
//               <Input
//                 type="number"
//                 id="originalPrice"
//                 name="originalPrice"
//                 value={product.originalPrice || ''}
//                 onChange={(e) => {
//                   const value = parseFloat(e.target.value) || 0;
//                   setProduct(prev => ({
//                     ...prev,
//                     originalPrice: value,
//                     price: value * (1 - product.discount / 100)
//                   }));
//                 }}
//                 className="pl-10"
//                 placeholder="0"
//                 min="0"
//                 step="1000"
//                 required
//                 disabled={isUploading}
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="discount">Discount (%)</Label>
//             <Input
//               type="number"
//               id="discount"
//               name="discount"
//               value={product.discount || ''}
//               onChange={(e) => {
//                 const value = parseFloat(e.target.value) || 0;
//                 handleDiscountChange(value);
//               }}
//               placeholder="0"
//               min="0"
//               max="100"
//               step="1"
//               disabled={isUploading}
//             />
//           </div>

//           <div>
//             <Label htmlFor="price">Selling Price</Label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 Rp
//               </span>
//               <Input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={product.price || ''}
//                 onChange={(e) => {
//                   const value = parseFloat(e.target.value) || 0;
//                   handlePriceChange(value);
//                 }}
//                 className="pl-10 bg-gray-50"
//                 placeholder="0"
//                 min="0"
//                 step="1000"
//                 readOnly={product.discount > 0}
//                 required
//                 disabled={isUploading}
//               />
//             </div>
//             {product.discount > 0 && (
//               <p className="text-sm text-green-600 mt-1">
//                 {product.discount}% discount applied
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Stock Quantity */}
//         <div>
//           <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
//           <Input
//             type="number"
//             id="stock"
//             name="stock"
//             value={product.stock || ''}
//             onChange={handleInputChange}
//             placeholder="0"
//             min="0"
//             required
//             disabled={isUploading}
//           />
//         </div>

//         {/* Color Selection */}
//         <div>
//           <Label>Available Colors</Label>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {colorOptions.map((color) => (
//               <button
//                 key={color.value}
//                 type="button"
//                 onClick={() => !isUploading && handleColorToggle(color.value)}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
//                   selectedColors.includes(color.value)
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-300 hover:border-gray-400'
//                 } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={isUploading}
//               >
//                 <div
//                   className="w-4 h-4 rounded-full border border-gray-300"
//                   style={{ backgroundColor: color.hex }}
//                 />
//                 <span className="text-sm">{color.label}</span>
//               </button>
//             ))}
//           </div>
//           {selectedColors.length > 0 && (
//             <p className="text-sm text-gray-500 mt-2">
//               Selected: {selectedColors.map(c => colorOptions.find(o => o.value === c)?.label).join(', ')}
//             </p>
//           )}
//         </div>

//         {/* Color Customization */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <Label htmlFor="bgColor">Background Color</Label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="color"
//                 id="bgColor"
//                 name="bgColor"
//                 value={product.bgColor}
//                 onChange={handleInputChange}
//                 className="w-10 h-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
//                 disabled={isUploading}
//               />
//               <Input
//                 type="text"
//                 value={product.bgColor}
//                 onChange={handleInputChange}
//                 name="bgColor"
//                 placeholder="#ffffff"
//                 className="font-mono"
//                 disabled={isUploading}
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="panelColor">Panel Color</Label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="color"
//                 id="panelColor"
//                 name="panelColor"
//                 value={product.panelColor}
//                 onChange={handleInputChange}
//                 className="w-10 h-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
//                 disabled={isUploading}
//               />
//               <Input
//                 type="text"
//                 value={product.panelColor}
//                 onChange={handleInputChange}
//                 name="panelColor"
//                 placeholder="#f3f4f6"
//                 className="font-mono"
//                 disabled={isUploading}
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="textColor">Text Color</Label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="color"
//                 id="textColor"
//                 name="textColor"
//                 value={product.textColor}
//                 onChange={handleInputChange}
//                 className="w-10 h-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
//                 disabled={isUploading}
//               />
//               <Input
//                 type="text"
//                 value={product.textColor}
//                 onChange={handleInputChange}
//                 name="textColor"
//                 placeholder="#000000"
//                 className="font-mono"
//                 disabled={isUploading}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={resetForm}
//             className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//             disabled={isUploading}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isUploading || !product.image}
//           >
//             {isUploading ? `Uploading... ${uploadProgress}%` : 'Create Product'}
//           </button>
//         </div>
//       </form>
//     </ComponentCard>
//   );
// }