import React, { useState } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Select from "../Select.tsx";
// import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons/index.ts";
// import DatePicker from "../date-picker.tsx";

import axios from "axios";
// Define Product Type
interface Product {
  image: File | null; // Changed back to File for upload
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  bgColor: string;
  panelColor: string;
  textColor: string;
  stock: number;
  category: string;
  sku: string;
  colors: string[];
}

// Define Category Option Type
interface CategoryOption {
  value: string;
  label: string;
}

// Define Color Option Type
interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development'? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_PROD_URL

export default function ProductCreate() {
  // Initial state for the product
  const [product, setProduct] = useState<Product>({
    image: null,
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    bgColor: "#ffffff",
    panelColor: "#f3f4f6",
    textColor: "#000000",
    stock: 0,
    category: "",
    sku: "",
    colors: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string>("");

  const navigate = useNavigate()
  // Category options
  const categoryOptions: CategoryOption[] = [
    { value: "electronics", label: "Electronik" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Rumah Tangga" },
    { value: "health", label: "Kesehatan" },
    { value: "sports", label: "Olahraga" },
    { value: "books", label: "Buku & Alat Tulis" },
    { value: "automotive", label: "Otomotif" },
    { value: "beauty", label: "Kecantikan" },
    { value: "food", label: "Makanan & Minuman" },
    { value: "toys", label: "Mainan & Hobi" },
  ];

  // Color options
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (e.target.type === 'number') {
      setProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Check file size (e.g., limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Update product state with the file
    setProduct(prev => ({
      ...prev,
      image: file
    }));

  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle color selection
  const handleColorToggle = (colorValue: string) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(colorValue)
        ? prev.filter(c => c !== colorValue)
        : [...prev, colorValue];

      setProduct(prevProduct => ({ ...prevProduct, colors: newColors }));
      return newColors;
    });
  };

  // Handle form submission with file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(product)

    // Validate required fields
    if (!product.name || !product.description || !product.category || product.originalPrice <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate image
    if (!product.image) {
      alert('Please upload a product image');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append image file
      if (product.image) {
        formData.append('image', product.image);
      }

      console.log(product.image)

      // Append other product data
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price.toString());
      formData.append('originalPrice', product.originalPrice.toString());
      formData.append('discount', product.discount.toString());
      formData.append('bgColor', product.bgColor);
      formData.append('panelColor', product.panelColor);
      formData.append('textColor', product.textColor);
      formData.append('stock', product.stock.toString());
      formData.append('category', product.category);
      formData.append('sku', product.sku);
      formData.append('colors', JSON.stringify(product.colors));

      // Create XMLHttpRequest for progress tracking
      // const xhr = new XMLHttpRequest();

      // // Track upload progress
      // xhr.upload.addEventListener('progress', (event) => {
      //   if (event.lengthComputable) {
      //     const percentComplete = (event.loaded / event.total) * 100;
      //     setUploadProgress(Math.round(percentComplete));
      //   }
      // });

      // Handle response
      // xhr.onreadystatechange = () => {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       const response = JSON.parse(xhr.responseText);
      //       alert('Product created successfully!');
      //       console.log('Product created:', response);
      //       resetForm();
      //     } else {
      //       throw new Error('Failed to create product');
      //     }
      //     setIsUploading(false);
      //   }
      // };

      // // Handle errors
      // xhr.onerror = () => {
      //   setIsUploading(false);
      //   alert('Network error occurred. Please try again.');
      // };

      // // Open and send request
      // xhr.open('POST', '/api/products', true);
      // xhr.send(formData);

      const response = await axios.post(`${BASE_URL || 'http://localhost:3030'}/products`, formData, {headers: {
          'Content-Type': 'multipart/form-data',
        }, withCredentials: true});

        console.log(response)

      if (response.status == 200) {
        const result = await response.data;
        alert('Product created successfully!');
        resetForm();

        navigate('/products')
      } else {
        throw new Error('Failed to create product');
      }

      // For demo purposes (if no API endpoint)
      if (process.env.NODE_ENV === 'development') {
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
          if (key === 'image') {
            console.log(`${key}:`, (value as File).name, `(${(value as File).size} bytes)`);
          } else {
            console.log(`${key}:`, value);
          }
        }



        // Simulate upload
        // setTimeout(() => {
        //   setUploadProgress(100);
        //   setTimeout(() => {
        //     alert('Product submitted successfully! (Check console for FormData contents)');
        //     resetForm();
        //     setIsUploading(false);
        //   }, 500);
        // }, 2000);
      }

    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
      setIsUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setProduct({
      image: null,
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      bgColor: "#ffffff",
      panelColor: "#f3f4f6",
      textColor: "#000000",
      stock: 0,
      category: "",
      sku: "",
      colors: [],
    });
    setSelectedColors([]);
    setUploadProgress(0);

    // Clean up object URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  };

  // Update price when discount changes
  const handleDiscountChange = (value: number) => {
    setProduct(prev => {
      const newPrice = prev.originalPrice * (1 - value / 100);
      return {
        ...prev,
        discount: value,
        price: Math.round(newPrice)
      };
    });
  };

  // Update discount when price changes
  const handlePriceChange = (value: number) => {
    setProduct(prev => {
      const discount = prev.originalPrice > 0
        ? ((prev.originalPrice - value) / prev.originalPrice) * 100
        : 0;
      return {
        ...prev,
        price: value,
        discount: Math.round(discount * 100) / 100
      };
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ComponentCard title="Create New Product">
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Image Upload */}
        <div>
          <Label htmlFor="image">
            Product Image <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <div className="relative">
              <Input
                type="file"
                id="image"
                name="image"
                // accept="image/*"
                onChange={handleFileUpload}
                className="opacity-0 absolute z-0 w-full h-full cursor-pointer"
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
                      <p className="text-sm text-gray-500 mt-1">Please wait while we upload your image</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </>
                  ) : imagePreview ? (
                    <>
                      <div className="relative w-32 h-32 mx-auto mb-3 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* <p className="text-green-600 font-medium">Image Selected ✓</p> */}
                      {product.image && (
                        <>
                          <p className="text-sm text-gray-500 mt-1">
                            {product.image.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Size: {formatFileSize(product.image.size)} | Type: {product.image.type}
                          </p>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                            setImagePreview("");
                          }
                          setProduct(prev => ({ ...prev, image: null }));
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
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
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {!product.image && !isUploading && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="text-red-500">*</span> Product image is required
              </p>
            )}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <Label htmlFor="name">
            Product Name <span className="text-red-500">*</span>
          </Label>
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

        {/* SKU */}
        <div>
          <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
          <Input
            type="text"
            id="sku"
            name="sku"
            value={product.sku}
            onChange={handleInputChange}
            placeholder="e.g., PROD-001"
            disabled={isUploading}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={product.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
            placeholder="Enter detailed product description"
            required
            disabled={isUploading}
          />
        </div>

        {/* Category Selection */}
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            id="category"
            options={categoryOptions}
            placeholder="Select a category"
            value={product.category}
            onChange={(value) => handleSelectChange('category', value)}
            className="dark:bg-gray-800"
            required
            disabled={isUploading}
          />
        </div>

        {/* Price Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="originalPrice">
              Original Price <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={product.originalPrice || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setProduct(prev => ({
                    ...prev,
                    originalPrice: value,
                    price: value * (1 - product.discount / 100)
                  }));
                }}
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
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                handleDiscountChange(value);
              }}
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
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                type="number"
                id="price"
                name="price"
                value={product.price || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  handlePriceChange(value);
                }}
                className="pl-10 bg-gray-50"
                placeholder="0"
                min="0"
                step="1000"
                readOnly={product.discount > 0}
                required
                disabled={isUploading}
              />
            </div>
            {product.discount > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {product.discount}% discount applied
              </p>
            )}
          </div>
        </div>

        {/* Stock Quantity */}
        <div>
          <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            id="stock"
            name="stock"
            value={product.stock || ''}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            required
            disabled={isUploading}
          />
        </div>

        {/* Color Selection */}
        <div>
          <Label>Available Colors</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => !isUploading && handleColorToggle(color.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedColors.includes(color.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isUploading}
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
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

        {/* Color Customization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="bgColor"
                name="bgColor"
                value={product.bgColor}
                onChange={handleInputChange}
                className="w-10 h-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
                disabled={isUploading}
              />
              <Input
                type="text"
                value={product.bgColor}
                onChange={handleInputChange}
                name="bgColor"
                placeholder="#ffffff"
                className="font-mono"
                disabled={isUploading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="panelColor">Panel Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="panelColor"
                name="panelColor"
                value={product.panelColor}
                onChange={handleInputChange}
                className="w-10 h-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
                disabled={isUploading}
              />
              <Input
                type="text"
                value={product.panelColor}
                onChange={handleInputChange}
                name="panelColor"
                placeholder="#f3f4f6"
                className="font-mono"
                disabled={isUploading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="textColor"
                name="textColor"
                value={product.textColor}
                onChange={handleInputChange}
                className="w-10 h-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
                disabled={isUploading}
              />
              <Input
                type="text"
                value={product.textColor}
                onChange={handleInputChange}
                name="textColor"
                placeholder="#000000"
                className="font-mono"
                disabled={isUploading}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isUploading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading || !product.image}
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Create Product'}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}