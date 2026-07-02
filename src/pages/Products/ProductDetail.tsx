import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

const CLIENT_BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'
  ? import.meta.env.VITE_CLIENT_DEV_URL
  : import.meta.env.VITE_CLIENT_PROD_URL

// Types
interface Variation {
  id?: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
}

interface Product {
  id?: string;
  image: string | File | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  bg_color: string;
  panel_color: string;
  text_color: string;
  category_id: string;
  sku: string;
  colors: string[];
  sizes: string[];
  variations: Variation[];
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

interface SizeOption {
  value: string;
  label: string;
}

interface ProductDetailPageProps {
  mode: 'view' | 'edit' | 'create';
}

const ProductDetail: React.FC<ProductDetailPageProps> = ({ mode = 'edit' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(mode === 'edit');
  const [activeTab, setActiveTab] = useState<'details' | 'inventory' | 'media'>('details');
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // Variation modal state
  const [showVariationModal, setShowVariationModal] = useState<boolean>(false);
  const [editingVariation, setEditingVariation] = useState<Variation | null>(null);
  const [modalVariation, setModalVariation] = useState<Variation>({
    color: "",
    size: "",
    price: 0,
    stock: 0,
    sku: "",
    id: undefined
  });

  const [product, setProduct] = useState<Product>({
    image: null,
    name: "",
    slug: "",
    description: "",
    price: 0,
    original_price: 0,
    discount: 0,
    bg_color: "#ffffff",
    panel_color: "#f3f4f6",
    text_color: "#000000",
    stock: 0,
    category_id: "",
    sku: "",
    colors: [],
    sizes: [],
    variations: [],
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Options
  const colorOptions: ColorOption[] = [
    { value: "red", label: "Merah", hex: "#ef4444" },
    { value: "blue", label: "Biru", hex: "#3b82f6" },
    { value: "green", label: "Hijau", hex: "#10b981" },
    { value: "yellow", label: "Kuning", hex: "#f59e0b" },
    { value: "purple", label: "Ungu", hex: "#8b5cf6" },
    { value: "pink", label: "Pink", hex: "#ec4899" },
    { value: "black", label: "Hitam", hex: "#000000" },
    { value: "white", label: "Putih", hex: "#ffffff" },
    { value: "gray", label: "Abu-abu", hex: "#6b7280" },
    { value: "brown", label: "Coklat", hex: "#92400e" },
  ];

  const sizeOptions: SizeOption[] = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
    { value: "all_size", label: "All Size" },
  ];

  // Fetch categories
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Fetch product data
  useEffect(() => {
    if ((mode === 'view' || mode === 'edit') && id) {
      fetchProduct();
    }
  }, [id, mode]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      if (response.status === 200) {
        const productData = response.data.data;

        console.log(productData.variations)

        setProduct({
          ...productData,
          slug: productData.slug || null,
          image: productData.image || null,
          original_price: productData.original_price || productData.price,
          colors: productData.colors || [],
          sizes: productData.sizes || [],
          variations: productData.variations || [],
        });

        // const colors = product.variations.map( value => [...colors, value.color])
        // const uniqueSizesMap = new Map();
        const colors = []
        const sizes = []
        // product.variations.forEach(v => {
        //   console.log('color', v.color)
        //   const colorValue = v.color;
        //   if (!colors.includes(colorValue)) {
        //     colors.push(colorValue)
        //     // uniqueSizesMap.set(sizeValue,);
        //   }
        // });

        console.log('product.variations', product.variations, productData.variations)

        for (let i = 0; i < productData.variations.length; i++) {
          const variation = productData.variations[i];

          if(!colors.includes(variation.color)){
            colors.push(variation.color)
          }
          if(!sizes.includes(variation.size)){
            sizes.push(variation.size)
          }

        }

        console.log('colors', colors)

        setSelectedColors(productData.colors || colors);


        // product.variations.forEach(v => {
        //   const sizeValue = v.size;
        //   if (!sizes.includes(sizeValue)) {
        //     sizes.push(sizeValue)
        //     // uniqueSizesMap.set(sizeValue,);
        //   }
        // });

        // const sizes = product.variations.map( value => [...sizes, value.size])
        console.log('sizes', sizes)
        setSelectedSizes(productData.sizes || sizes);

        if (productData.image) {
          setImagePreview(productData.image);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  // Variation handlers
  const openAddVariationModal = () => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.warning('Select colors and sizes first');
      return;
    }
    setModalVariation({
      color: selectedColors[0],
      size: selectedSizes[0],
      price: product.original_price || 0,
      stock: 0,
      sku: "",
      id: undefined
    });
    setEditingVariation(null);
    setShowVariationModal(true);
  };

  const openEditVariationModal = (variation: Variation) => {
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

  const handleModalChange = (field: keyof Variation, value: string | number) => {
    setModalVariation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddVariation = () => {
    if (!modalVariation.color || !modalVariation.size) {
      toast.error('Please select color and size');
      return;
    }
    if (modalVariation.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (editingVariation) {
      setProduct(prev => ({
        ...prev,
        variations: prev.variations.map(v =>
          v.id === editingVariation.id ? { ...modalVariation, id: v.id } : v
        )
      }));
      toast.success('Variation updated');
    } else {
      const exists = product.variations.some(
        v => v.color === modalVariation.color && v.size === modalVariation.size
      );
      if (exists) {
        toast.error('This variation already exists');
        return;
      }
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
      id: undefined
    });
  };

  const handleDeleteVariation = (variationId: string) => {
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
            price: product.original_price || 0,
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

  // Color and size handlers
  const handleColorToggle = (colorValue: string) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(colorValue)
        ? prev.filter(c => c !== colorValue)
        : [...prev, colorValue];
      setProduct(prevProduct => ({ ...prevProduct, colors: newColors }));
      return newColors;
    });
  };

  const handleSizeToggle = (sizeValue: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(sizeValue)
        ? prev.filter(s => s !== sizeValue)
        : [...prev, sizeValue];
      setProduct(prevProduct => ({ ...prevProduct, sizes: newSizes }));
      return newSizes;
    });
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'number') {
      setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setProduct(prev => ({ ...prev, image: file }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscountChange = (value: number) => {
    setProduct(prev => {
      const newPrice = prev.original_price * (1 - value / 100);
      return {
        ...prev,
        discount: value,
        price: Math.round(newPrice)
      };
    });
  };

  const handlePriceChange = (value: number) => {
    setProduct(prev => {
      const discount = prev.original_price > 0
        ? ((prev.original_price - value) / prev.original_price) * 100
        : 0;
      return {
        ...prev,
        price: value,
        discount: Math.round(discount * 100) / 100
      };
    });
  };

  const handleSave = async () => {
    if (!product.name || !product.description || !product.category_id || product.original_price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'create' && !product.image) {
      toast.error('Please upload a product image');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      if (product.image && typeof product.image !== 'string') {
        formData.append('image', product.image);
      }

      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price.toString());
      formData.append('original_price', product.original_price.toString());
      formData.append('discount', product.discount.toString());
      formData.append('bg_color', product.bg_color);
      formData.append('panel_color', product.panel_color);
      formData.append('text_color', product.text_color);
      formData.append('stock', product.stock.toString());
      formData.append('category_id', product.category_id);
      formData.append('sku', product.sku);
      formData.append('colors', JSON.stringify(product.colors));
      formData.append('sizes', JSON.stringify(product.sizes));
      formData.append('variations', JSON.stringify(product.variations));

      let response;
      if (mode === 'create') {
        response = await axios.post(`${BASE_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        });
        toast.success('Product created successfully!');
      } else if (id) {
        if (product.image && typeof product.image !== 'string') {
          response = await axios.patch(`${BASE_URL}/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
              }
            }
          });
        } else {
          response = await axios.patch(`${BASE_URL}/products/${id}`, formData, {
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
              }
            }
          });
        }
        toast.success('Product updated successfully!');
      }

      if (response && response.status === 200) {
        if (mode === 'create') {
          navigate('/products');
        } else {
          setIsEditing(false);
          await fetchProduct();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(mode === 'create' ? 'Failed to create product' : 'Failed to update product');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    if (imagePreview && typeof product.image === 'object') {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setProduct(prev => ({ ...prev, image: null }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Variation Modal Component
  const VariationModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => {
        setShowVariationModal(false);
        setEditingVariation(null);
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          {editingVariation ? 'Edit Variation' : 'Add New Variation'}
        </h3>

        <div className="space-y-4">
          <div>
            <Label>Color</Label>
            <select
              value={modalVariation.color}
              onChange={(e) => handleModalChange('color', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select color</option>
              {selectedColors.map(color => {
                const colorOption = colorOptions.find(c => c.value === color);
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
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Price"
            />
          </div>

          <div>
            <Label>Stock</Label>
            <input
              type="number"
              value={modalVariation.stock}
              onChange={(e) => handleModalChange('stock', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Stock quantity"
            />
          </div>

          <div>
            <Label>SKU (Optional)</Label>
            <input
              type="text"
              value={modalVariation.sku}
              onChange={(e) => handleModalChange('sku', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
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

  // View Mode Render
  if (mode === 'view' || (mode === 'edit' && !isEditing)) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Product Details</h1>
          {mode === 'edit' && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Product
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex gap-6">
            {['details', 'inventory', 'media'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Image</h3>
                {imagePreview ? (
                  <img src={imagePreview} alt={product.name} className="w-full rounded-lg border border-gray-200 dark:border-gray-700" />
                ) : (
                  <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Product Name</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-white">{product.name}</p>
                  </div>
                  {/* <p className="text-sm text-gray-500 dark:text-gray-400">Product Name</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">{product.name}</p> */}
                  <div>
                    <button className="flex justify-end items-end text-center bg-blue-500 text-white py-3 px-2 rounded-2xl font-semibold" onClick={() => {window.location.href=`${CLIENT_BASE_URL}/product/${product.slug}`}} >Lihat Halaman Produk</button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">SKU</p>
                  <p className="text-gray-800 dark:text-white">{product.sku || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-gray-800 dark:text-white">
                    {categories.find(c => c.id === product.category_id)?.name || product.category_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{product.description}</p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Price</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      Rp {product.original_price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
                    <p className="text-xl font-bold text-green-600">{product.discount}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
                    <p className="text-xl font-bold text-blue-600">
                      Rp {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Variations Display */}
              {(product.variations && product.variations.length > 0) && (
                <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Variations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left dark:text-white">Color</th>
                          <th className="px-3 py-2 text-left dark:text-white">Size</th>
                          <th className="px-3 py-2 text-right dark:text-white">Price</th>
                          <th className="px-3 py-2 text-right dark:text-white">Stock</th>
                          <th className="px-3 py-2 text-left dark:text-white">SKU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variations.map((variation, index) => (
                          <tr key={variation.id || index} className="border-t dark:border-gray-700">
                            <td className="px-3 py-2 dark:text-white">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: colorOptions.find(c => c.value === variation.color)?.hex || variation.color }}
                                />
                                {colorOptions.find(c => c.value === variation.color)?.label || variation.color}
                              </div>
                            </td>
                            <td className="px-3 py-2 dark:text-white">
                              {sizeOptions.find(s => s.value === variation.size)?.label || variation.size}
                            </td>
                            <td className="px-3 py-2 text-right dark:text-white">Rp {variation.price?.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right dark:text-white">{variation.stock}</td>
                            <td className="px-3 py-2 dark:text-white">{variation.sku || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 dark:bg-gray-700 font-semibold">
                        <tr>
                          <td colSpan="3" className="px-3 py-2 text-right dark:text-white">Total Stock:</td>
                          <td className="px-3 py-2 text-right dark:text-white">{totalStock}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stock Quantity</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalStock} units</p>
                  {totalStock <= 10 && totalStock > 0 && (
                    <p className="text-sm text-yellow-600 mt-1">⚠️ Low stock warning</p>
                  )}
                  {totalStock === 0 && (
                    <p className="text-sm text-red-600 mt-1">❌ Out of stock</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Color Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Background Color</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 rounded border" style={{ backgroundColor: product.bg_color }} />
                      <span className="text-gray-800 dark:text-white">{product.bg_color}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Panel Color</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 rounded border" style={{ backgroundColor: product.panel_color }} />
                      <span className="text-gray-800 dark:text-white">{product.panel_color}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Text Color</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 rounded border" style={{ backgroundColor: product.text_color }} />
                      <span className="text-gray-800 dark:text-white">{product.text_color}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Media</h3>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt={product.name} className="w-64 h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No image available</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit/Create Mode Render
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        </h1>
        {mode === 'edit' && (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
          >
            Cancel
          </button>
        )}
      </div>

      <ComponentCard title={mode === 'create' ? 'Product Information' : 'Edit Product Details'}>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">
              Product Image {mode === 'create' && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-2">
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
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
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                          </div>
                        </div>
                        <p className="text-blue-500 font-medium">Uploading...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </>
                    ) : imagePreview ? (
                      <>
                        <div className="relative w-32 h-32 mx-auto mb-3 border border-gray-300 rounded-lg overflow-hidden">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        {typeof product.image === 'object' && product.image && (
                          <>
                            <p className="text-sm text-gray-500 mt-1">{(product.image as File).name}</p>
                            <p className="text-xs text-gray-400">Size: {formatFileSize((product.image as File).size)}</p>
                          </>
                        )}
                        <button type="button" onClick={removeImage} className="mt-2 text-sm text-red-600 hover:text-red-700">
                          Hapus Gambar
                        </button>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 font-medium">Upload Product Image</p>
                        <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
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
                disabled={isUploading}
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
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Description */}
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
              disabled={isUploading}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
            <select
              id="category_id"
              value={product.category_id}
              onChange={(e) => setProduct(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              required
              disabled={isUploading}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                  disabled={isUploading}
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
                onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                max="100"
                step="1"
                disabled={isUploading}
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
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                  disabled={isUploading}
                />
              </div>
              {product.discount > 0 && <p className="text-sm text-green-600 mt-1">{product.discount}% discount applied</p>}
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
                  onClick={() => !isUploading && handleColorToggle(color.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedColors.includes(color.hex)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUploading}
                >
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.hex }} />
                  <span className="text-sm dark:text-white">{color.label}</span>
                </button>
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                Selected: {selectedColors.map(c => colorOptions.find(o => o.value === c)?.label || c).join(', ')}
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
                  onClick={() => !isUploading && handleSizeToggle(size.value)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    selectedSizes.includes(size.value)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 text-gray-700'
                  } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUploading}
                >
                  <span className="text-sm font-medium dark:text-white">{size.label}</span>
                </button>
              ))}
            </div>
            {selectedSizes.length > 0 && (
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                Selected: {selectedSizes.map(s => sizeOptions.find(o => o.value === s)?.label || s).join(', ')}
              </p>
            )}
          </div>

          {/* Variations Section */}
          {(selectedColors.length > 0 || selectedSizes.length > 0) && (
            <div className="border rounded-lg p-4 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <Label>Product Variations</Label>
                <div className="flex gap-2">
                  {selectedColors.length > 0 && selectedSizes.length > 0 && (
                    <button
                      type="button"
                      onClick={generateAllCombinations}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={isUploading}
                    >
                      Generate All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={openAddVariationModal}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isUploading}
                  >
                    + Add Variation
                  </button>
                </div>
              </div>

              {product.variations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4 dark:text-gray-400">
                  No variations added. Add variations to manage different color and size combinations.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left dark:text-white">Color</th>
                        <th className="px-3 py-2 text-left dark:text-white">Size</th>
                        <th className="px-3 py-2 text-right dark:text-white">Price</th>
                        <th className="px-3 py-2 text-right dark:text-white">Stock</th>
                        <th className="px-3 py-2 text-left dark:text-white">SKU</th>
                        <th className="px-3 py-2 text-center dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variations.map((variation, key) => (
                        <tr key={variation.id || key} className="border-t dark:border-gray-700">
                          <td className="px-3 py-2 dark:text-white">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: colorOptions.find(c => c.value === variation.color)?.hex || variation.color }}
                              />
                              {colorOptions.find(c => c.value === variation.color)?.label || variation.color}
                            </div>
                          </td>
                          <td className="px-3 py-2 dark:text-white">
                            {sizeOptions.find(s => s.value === variation.size)?.label || variation.size}
                          </td>
                          <td className="px-3 py-2 text-right dark:text-white">Rp {variation.price?.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right dark:text-white">{variation.stock}</td>
                          <td className="px-3 py-2 dark:text-white">{variation.sku || '-'}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => openEditVariationModal(variation)}
                              className="text-blue-600 hover:text-blue-700 mx-1 text-xs"
                              disabled={isUploading}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVariation(variation.id || '')}
                              className="text-red-600 hover:text-red-700 mx-1 text-xs"
                              disabled={isUploading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700 font-semibold">
                      <tr>
                        <td colSpan="3" className="px-3 py-2 text-right dark:text-white">Total Stock:</td>
                        <td className="px-3 py-2 text-right dark:text-white">{totalStock}</td>
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
              <Label htmlFor="bg_color">Background Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="bg_color"
                  name="bg_color"
                  value={product.bg_color}
                  onChange={handleInputChange}
                  className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                  disabled={isUploading}
                />
                <Input
                  type="text"
                  value={product.bg_color}
                  onChange={handleInputChange}
                  name="bg_color"
                  placeholder="#ffffff"
                  className="font-mono"
                  disabled={isUploading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="panel_color">Panel Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="panel_color"
                  name="panel_color"
                  value={product.panel_color}
                  onChange={handleInputChange}
                  className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                  disabled={isUploading}
                />
                <Input
                  type="text"
                  value={product.panel_color}
                  onChange={handleInputChange}
                  name="panel_color"
                  placeholder="#f3f4f6"
                  className="font-mono"
                  disabled={isUploading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="text_color">Text Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="text_color"
                  name="text_color"
                  value={product.text_color}
                  onChange={handleInputChange}
                  className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                  disabled={isUploading}
                />
                <Input
                  type="text"
                  value={product.text_color}
                  onChange={handleInputChange}
                  name="text_color"
                  placeholder="#000000"
                  className="font-mono"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => mode === 'create' ? navigate('/products') : setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isUploading || (mode === 'create' && !product.image)}
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : (mode === 'create' ? 'Create Product' : 'Save Changes')}
            </button>
          </div>
        </form>
      </ComponentCard>

      {/* Variation Modal */}
      {showVariationModal && <VariationModal />}
    </div>
  );
};

export default ProductDetail;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import ComponentCard from "../../components/common/ComponentCard";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";
// import Select from "../../components/form/Select";

// const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'
//   ? import.meta.env.VITE_DEV_URL
//   : import.meta.env.VITE_PROD_URL;

// // Types
// interface Product {
//   id?: string;
//   image: string | File | null;
//   name: string;
//   description: string;
//   price: number;
//   original_price: number;
//   discount: number;
//   bg_color: string;
//   panel_color: string;
//   text_color: string;
//   stock: number;
//   category: string;
//   sku: string;
//   colors: string[];
// }

// interface CategoryOption {
//   value: string;
//   label: string;
// }

// interface ColorOption {
//   value: string;
//   label: string;
//   hex: string;
// }

// interface ProductDetailPageProps {
//   mode: 'view' | 'edit' | 'create';
// }

// const ProductDetail: React.FC<ProductDetailPageProps> = ({ mode = 'edit' }) => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [imagePreview, setImagePreview] = useState<string>("");
//   // FIX: Initialize isEditing based on mode prop
//   const [isEditing, setIsEditing] = useState<boolean>(mode === 'edit');
//   const [activeTab, setActiveTab] = useState<'details' | 'inventory' | 'media'>('details');

//   const [product, setProduct] = useState<Product>({
//     image: null,
//     name: "",
//     description: "",
//     price: 0,
//     original_price: 0,
//     discount: 0,
//     bg_color: "#ffffff",
//     panel_color: "#f3f4f6",
//     text_color: "#000000",
//     stock: 0,
//     category: "",
//     sku: "",
//     colors: [],
//   });

//   const [selectedColors, setSelectedColors] = useState<string[]>([]);

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

//   // Fetch product data if in view/edit mode and id exists
//   useEffect(() => {
//     if ((mode === 'view' || mode === 'edit') && id) {
//       fetchProduct();
//     }
//   }, [id, mode]);

//   const fetchProduct = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${BASE_URL}/products/${id}`);
//       if (response.status === 200) {
//         const productData = response.data.data;
//         setProduct({
//           ...productData,
//           image: productData.image || null,
//           original_price: productData.original_price || productData.price, // Fix field name
//         });
//         setSelectedColors(productData.colors || []);
//         if (productData.image) {
//           setImagePreview(productData.image);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       toast.error('Failed to load product details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (e.target.type === 'number') {
//       setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
//     } else {
//       setProduct(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file (JPEG, PNG, GIF, etc.)');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }

//     const previewUrl = URL.createObjectURL(file);
//     setImagePreview(previewUrl);
//     setProduct(prev => ({ ...prev, image: file }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setProduct(prev => ({ ...prev, [name]: value }));
//   };

//   const handleColorToggle = (colorValue: string) => {
//     setSelectedColors(prev => {
//       const newColors = prev.includes(colorValue)
//         ? prev.filter(c => c !== colorValue)
//         : [...prev, colorValue];
//       setProduct(prevProduct => ({ ...prevProduct, colors: newColors }));
//       return newColors;
//     });
//   };

//   const handleDiscountChange = (value: number) => {
//     setProduct(prev => {
//       const newPrice = prev.original_price * (1 - value / 100);
//       return {
//         ...prev,
//         discount: value,
//         price: Math.round(newPrice)
//       };
//     });
//   };

//   const handlePriceChange = (value: number) => {
//     setProduct(prev => {
//       const discount = prev.original_price > 0
//         ? ((prev.original_price - value) / prev.original_price) * 100
//         : 0;
//       return {
//         ...prev,
//         price: value,
//         discount: Math.round(discount * 100) / 100
//       };
//     });
//   };

//   const handleSave = async () => {
//     if (!product.name || !product.description || !product.category || product.original_price <= 0) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     if (mode === 'create' && !product.image) {
//       toast.error('Please upload a product image');
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       const formData = new FormData();

//       if (product.image && typeof product.image !== 'string') {
//         formData.append('image', product.image);
//       }

//       formData.append('name', product.name);
//       formData.append('description', product.description);
//       formData.append('price', product.price.toString());
//       formData.append('original_price', product.original_price.toString()); // Fix field name
//       formData.append('discount', product.discount.toString());
//       formData.append('bg_color', product.bg_color);
//       formData.append('panel_color', product.panel_color);
//       formData.append('text_color', product.text_color);
//       formData.append('stock', product.stock.toString());
//       formData.append('category', product.category);
//       formData.append('sku', product.sku);
//       formData.append('colors', JSON.stringify(product.colors));

//       let response = { status : 0};

//       if (mode === 'create') {
//         response = await axios.post(`${BASE_URL}/products`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           withCredentials: true,
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(percent);
//             }
//           },
//         });
//         toast.success('Product created successfully!');
//       } else if (id) {
//         if(product.image){
//           response = await axios.patch(`${BASE_URL}/products/${id}`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//             withCredentials: true,
//             onUploadProgress: (progressEvent) => {
//               if (progressEvent.total) {
//                 const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setUploadProgress(percent);
//               }
//             }
//           });
//         }else{
//         response = await axios.patch(`${BASE_URL}/products/${id}`, formData, {
//             withCredentials: true,
//             onUploadProgress: (progressEvent) => {
//               if (progressEvent.total) {
//                 const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setUploadProgress(percent);
//               }
//             }
//           });
//         }
//       }

//         toast.success('Product updated successfully!');


//         if (response && response?.status === 200) {
//           if (mode === 'create') {
//             navigate('/products');
//           } else {
//             // FIX: Turn off edit mode and refresh data
//             setIsEditing(false);
//             await fetchProduct(); // Refresh the product data
//           }
//         }
//     } catch (error) {
//       console.error('Error saving product:', error);
//       toast.error(mode === 'create' ? 'Failed to create product' : 'Failed to update product');
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const removeImage = () => {
//     if (imagePreview && typeof product.image === 'object') {
//       URL.revokeObjectURL(imagePreview);
//     }
//     setImagePreview("");
//     setProduct(prev => ({ ...prev, image: null }));
//   };

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   // FIX: Updated condition to properly handle edit mode
//   // Show view mode when:
//   // 1. mode is 'view' OR
//   // 2. mode is 'edit' but NOT in editing state
//   const shouldShowViewMode = (mode === 'view') || (mode === 'edit' && !isEditing);

//   // View Mode Render
//   if (shouldShowViewMode) {
//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       );
//     }

//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Header with Edit Button - Only show edit button when mode is 'edit' */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Product Details</h1>
//           {mode === 'edit' && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               Edit Product
//             </button>
//           )}
//         </div>

//         {/* Tab Navigation */}
//         <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
//           <nav className="flex gap-6">
//             {['details', 'inventory', 'media'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab as any)}
//                 className={`pb-3 px-1 text-sm font-medium transition-colors ${
//                   activeTab === tab
//                     ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
//                     : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Content Sections */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//           {activeTab === 'details' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Product Image */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Image</h3>
//                 {imagePreview ? (
//                   <img src={imagePreview} alt={product.name} className="w-full rounded-lg border border-gray-200 dark:border-gray-700" />
//                 ) : (
//                   <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
//                     <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                 )}
//               </div>

//               {/* Product Info */}
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Product Name</p>
//                   <p className="text-lg font-medium text-gray-800 dark:text-white">{product.name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">SKU</p>
//                   <p className="text-gray-800 dark:text-white">{product.sku || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
//                   <p className="text-gray-800 dark:text-white">
//                     {categoryOptions.find(c => c.value === product.category)?.label || product.category}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
//                   <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{product.description}</p>
//                 </div>
//               </div>

//               {/* Pricing Section */}
//               <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pricing</h3>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Original Price</p>
//                     <p className="text-xl font-bold text-gray-800 dark:text-white">
//                       Rp {product.original_price.toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
//                     <p className="text-xl font-bold text-green-600">{product.discount}%</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
//                     <p className="text-xl font-bold text-blue-600">
//                       Rp {product.price.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Colors */}
//               {product.colors && product.colors.length > 0 && (
//                 <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700">
//                   <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available Colors</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {product.colors.map(colorValue => {
//                       const color = colorOptions.find(c => c.value === colorValue);
//                       return color ? (
//                         <div key={colorValue} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
//                           <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.hex }} />
//                           <span className="text-sm text-gray-700 dark:text-gray-300">{color.label}</span>
//                         </div>
//                       ) : (
//                         <div key={colorValue} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
//                           <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: colorValue }} />
//                           <span className="text-sm text-gray-700 dark:text-gray-300">{colorValue}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'inventory' && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stock Quantity</p>
//                   <p className="text-2xl font-bold text-gray-800 dark:text-white">{product.stock} units</p>
//                   {product.stock <= 10 && product.stock > 0 && (
//                     <p className="text-sm text-yellow-600 mt-1">⚠️ Low stock warning</p>
//                   )}
//                   {product.stock === 0 && (
//                     <p className="text-sm text-red-600 mt-1">❌ Out of stock</p>
//                   )}
//                 </div>
//               </div>

//               <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Color Customization</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Background Color</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="w-8 h-8 rounded border" style={{ backgroundColor: product.bg_color }} />
//                       <span className="text-gray-800 dark:text-white">{product.bg_color}</span>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Panel Color</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="w-8 h-8 rounded border" style={{ backgroundColor: product.panel_color }} />
//                       <span className="text-gray-800 dark:text-white">{product.panel_color}</span>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Text Color</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="w-8 h-8 rounded border" style={{ backgroundColor: product.text_color }} />
//                       <span className="text-gray-800 dark:text-white">{product.text_color}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'media' && (
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Media</h3>
//               {imagePreview ? (
//                 <div className="relative inline-block">
//                   <img src={imagePreview} alt={product.name} className="w-64 h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
//                 </div>
//               ) : (
//                 <p className="text-gray-500 dark:text-gray-400">No image available</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Edit/Create Mode Render
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           {mode === 'create' ? 'Create New Product' : 'Edit Product'}
//         </h1> */}
//         {mode === 'edit'? (
//           <button
//               onClick={() => setIsEditing(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
//             >
//               Detail Product
//             </button>
//         ):
//         (
//           <button
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
//             >
//               Edit Product
//             </button>
//         )}
//         {mode === 'edit' && (
//           <button
//             onClick={() => setIsEditing(false)}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
//           >
//             Cancel
//           </button>
//         )}
//       </div>

//       <ComponentCard title={mode === 'create' ? 'Product Information' : 'Edit Product Details'}>
//         <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
//           {/* Image Upload */}
//           <div>
//             <Label htmlFor="image">
//               Product Image {mode === 'create' && <span className="text-red-500">*</span>}
//             </Label>
//             <div className="mt-2">
//               <div className="relative">
//                 <input
//                   type="file"
//                   id="image"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                   disabled={isUploading}
//                 />
//                 <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                   isUploading ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
//                 }`}>
//                   <div className="flex flex-col items-center justify-center">
//                     {isUploading ? (
//                       <>
//                         <div className="relative w-20 h-20 mb-4">
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
//                           </div>
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <span className="text-blue-600 font-bold">{uploadProgress}%</span>
//                           </div>
//                         </div>
//                         <p className="text-blue-500 font-medium">Uploading...</p>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
//                           <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
//                         </div>
//                       </>
//                     ) : imagePreview ? (
//                       <>
//                         <div className="relative w-32 h-32 mx-auto mb-3 border border-gray-300 rounded-lg overflow-hidden">
//                           <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                         </div>
//                         {/* <p className="text-green-600 font-medium">Image Selected ✓</p> */}
//                         {typeof product.image === 'object' && product.image && (
//                           <>
//                             <p className="text-sm text-gray-500 mt-1">{(product.image as File).name}</p>
//                             <p className="text-xs text-gray-400">Size: {formatFileSize((product.image as File).size)}</p>
//                           </>
//                         )}
//                         <button type="button" onClick={removeImage} className="mt-2 text-sm text-red-600 hover:text-red-700">
//                           Hapus Gambar
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         <p className="text-gray-600 font-medium">Upload Product Image</p>
//                         <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
//                         <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Product Name */}
//           <div>
//             <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
//             <Input type="text" id="name" name="name" value={product.name} onChange={handleInputChange} placeholder="Enter product name" required disabled={isUploading} />
//           </div>

//           {/* SKU */}
//           <div>
//             <Label htmlFor="sku">SKU</Label>
//             <Input type="text" id="sku" name="sku" value={product.sku} onChange={handleInputChange} placeholder="e.g., PROD-001" disabled={isUploading} />
//           </div>

//           {/* Description */}
//           <div>
//             <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
//             <textarea id="description" name="description" rows={4} value={product.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" placeholder="Enter detailed product description" required disabled={isUploading} />
//           </div>

//           {/* Category */}
//           <div>
//             <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
//             <Select id="category" options={categoryOptions} placeholder="Select a category" value={product.category} onChange={(value) => handleSelectChange('category', value)} required disabled={isUploading} />
//           </div>

//           {/* Pricing */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="original_price">Original Price <span className="text-red-500">*</span></Label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
//                 <Input type="number" id="original_price" name="original_price" value={product.original_price || ''} onChange={handleInputChange} className="pl-10" placeholder="0" min="0" step="1000" required disabled={isUploading} />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="discount">Discount (%)</Label>
//               <Input type="number" id="discount" name="discount" value={product.discount || ''} onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)} placeholder="0" min="0" max="100" step="1" disabled={isUploading} />
//             </div>
//             <div>
//               <Label htmlFor="price">Selling Price</Label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
//                 <Input type="number" id="price" name="price" value={product.price || ''} onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)} className="pl-10" placeholder="0" min="0" step="1000" required disabled={isUploading} />
//               </div>
//               {product.discount > 0 && <p className="text-sm text-green-600 mt-1">{product.discount}% discount applied</p>}
//             </div>
//           </div>

//           {/* Stock */}
//           <div>
//             <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
//             <Input type="number" id="stock" name="stock" value={product.stock || ''} onChange={handleInputChange} placeholder="0" min="0" required disabled={isUploading} />
//           </div>

//           {/* Colors */}
//           <div>
//             <Label>Available Colors</Label>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {colorOptions.map((color) => (
//                 <button
//                   key={color.value}
//                   type="button"
//                   onClick={() => !isUploading && handleColorToggle(color.value)}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
//                     selectedColors.includes(color.value)
//                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                       : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
//                   } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isUploading}
//                 >
//                   <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
//                   <span className="text-sm">{color.base}</span>
//                 </button>
//               ))}
//             </div>
//             {selectedColors.length > 0 && (
//               <p className="text-sm text-gray-500 mt-2">
//                 Selected: {selectedColors.map(c => colorOptions.find(o => o.value === c)?.label || c).join(', ')}
//               </p>
//             )}
//           </div>

//           {/* Color Customization */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="bg_color">Background Color</Label>
//               <div className="flex items-center gap-3">
//                 <input type="color" id="bg_color" name="bg_color" value={product.bg_color} onChange={handleInputChange} className="w-10 h-10 cursor-pointer rounded border border-gray-300" disabled={isUploading} />
//                 <Input type="text" value={product.bg_color} onChange={handleInputChange} name="bg_color" placeholder="#ffffff" className="font-mono" disabled={isUploading} />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="panel_color">Panel Color</Label>
//               <div className="flex items-center gap-3">
//                 <input type="color" id="panel_color" name="panel_color" value={product.panel_color} onChange={handleInputChange} className="w-10 h-10 cursor-pointer rounded border border-gray-300" disabled={isUploading} />
//                 <Input type="text" value={product.panel_color} onChange={handleInputChange} name="panel_color" placeholder="#f3f4f6" className="font-mono" disabled={isUploading} />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="text_color">Text Color</Label>
//               <div className="flex items-center gap-3">
//                 <input type="color" id="text_color" name="text_color" value={product.text_color} onChange={handleInputChange} className="w-10 h-10 cursor-pointer rounded border border-gray-300" disabled={isUploading} />
//                 <Input type="text" value={product.text_color} onChange={handleInputChange} name="text_color" placeholder="#000000" className="font-mono" disabled={isUploading} />
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
//             <button
//               type="button"
//               onClick={() => mode === 'create' ? navigate('/products') : setIsEditing(false)}
//               className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//               disabled={isUploading || (mode === 'create' && !product.image)}
//             >
//               {isUploading ? `Uploading... ${uploadProgress}%` : (mode === 'create' ? 'Create Product' : 'Save Changes')}
//             </button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// };

// export default ProductDetail;