import React, { useRef, useState, useEffect } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, editProduct, resetProductState } from '../../store/productSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Editproductpage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputs = useRef([]);
  const { product, loading, error, success } = useSelector(state => state.product);

  const [productData, setproductData] = useState({
    productNmae: '',
    Description: '',
    ProductType: '',
    PackageContents: '',
    Fit: '',
    Fabric: '',
    Pattern: '',
    Packof: '',
    countInStock: 0,
    sizes: [],
    Price: 0,
    Bestsller: false,
    images: [null, null, null, null],
  });

  // Load product data into form
  useEffect(() => {
    if (product && product._id === id) {
      const imgs = (product.images?.slice(0, 4) || []).map(img => ({ url: img }));
      while (imgs.length < 4) imgs.push(null);

      setproductData({
        productNmae: product.productName || '',
        Description: product.Description || '',
        ProductType: product.ProductType || '',
        PackageContents: product.PackageContain || '',
        Fit: product.Fit || '',
        Fabric: product.Fabric || '',
        Pattern: product.Pattern || '',
        Packof: product.Packof || '',
        countInStock: product.countInStock || 0,
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        Price: product.Price || 0,
        Bestsller: product.Bestsller || false,
        images: imgs,
      });
    }
  }, [product, id]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(resetProductState());
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      navigate('/admin/Products');
      dispatch(resetProductState());
    }
  }, [success, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setproductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...productData.images];
      newImages[index] = {
        file,
        url: URL.createObjectURL(file),
      };
      setproductData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleUploadClick = (index) => {
    fileInputs.current[index]?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productData.productNmae.trim() ||
      !productData.Description.trim() ||
      !productData.ProductType.trim() ||
      !productData.PackageContents.trim() ||
      !productData.Fit.trim() ||
      !productData.Fabric.trim() ||
      !productData.Pattern.trim() ||
      !productData.Packof.trim() ||
      !productData.countInStock ||
      !productData.Price ||
      productData.sizes.length === 0 ||
      productData.images.filter(img => img && (img.file || img.url)).length === 0
    ) {
      toast.error('Please fill out all required fields, select at least one size, and upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('productName', productData.productNmae);
    formData.append('Description', productData.Description);
    formData.append('ProductType', productData.ProductType);
    formData.append('PackageContain', productData.PackageContents);
    formData.append('Fit', productData.Fit);
    formData.append('Fabric', productData.Fabric);
    formData.append('Pattern', productData.Pattern);
    formData.append('Packof', productData.Packof);
    formData.append('countInStock', productData.countInStock);
    formData.append('Price', productData.Price);
    formData.append('Bestsller', productData.Bestsller);
    formData.append('sizes', JSON.stringify(productData.sizes));

    productData.images.forEach((imgObj, idx) => {
      if (imgObj?.file) {
        formData.append(`image${idx + 1}`, imgObj.file);
      }
    });

    dispatch(editProduct({ id, formData }));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg font-sans">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Edit Product</h2>
      <button
        type="button"
        onClick={() => navigate('/admin/Products')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      {loading && <div className="mb-2 text-indigo-700">Loading...</div>}
      {error && <div className="mb-2 text-red-600">Failed: {typeof error === 'string' ? error : JSON.stringify(error)}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="productNmae"
            value={productData.productNmae}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Product Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
          <select
            name="ProductType"
            value={productData.ProductType}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
              <option hidden value="">Select Product Type</option>
<option value="Saree">Saree</option>
<option value="Kurti">Kurti</option>
<option value="Pants">Pants</option>
<option value="Co-ord Set">Co-ord Set</option>
<option value="Blouses">Blouses</option>
<option value="Fabrics">Fabrics</option>
</select>
        </div>

        {/* Remaining Fields */}
        {[
          { label: 'Package Contents', name: 'PackageContents' },
          { label: 'Fit', name: 'Fit' },
          { label: 'Fabric', name: 'Fabric' },
          { label: 'Pattern', name: 'Pattern' },
          { label: 'Pack of', name: 'Packof' },
          { label: 'Count In Stock', name: 'countInStock', type: 'number' },
          { label: 'Price', name: 'Price', type: 'number' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={productData[name]}
              onChange={handleChange}
                            onWheel={(e) => e.target.blur()} // Prevent scroll changing value

              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        ))}

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="Description"
            value={productData.Description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Sizes */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
          <div className="flex flex-wrap gap-4">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <label key={size} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  value={size}
                  checked={productData.sizes.includes(size)}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setproductData(prev => {
                      const newSizes = e.target.checked
                        ? [...prev.sizes, selected]
                        : prev.sizes.filter(s => s !== selected);
                      return { ...prev, sizes: newSizes };
                    });
                  }}
                  className="accent-indigo-600"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Best Seller Checkbox */}
        <div className="col-span-1 md:col-span-2 flex items-center space-x-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="Bestsller"
              checked={productData.Bestsller}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            Best Seller
          </label>
        </div>

        {/* Upload Images */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
          <div className="flex gap-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div
                key={index}
                onClick={() => handleUploadClick(index)}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 relative"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={el => (fileInputs.current[index] = el)}
                  onChange={(e) => handleFileChange(index, e)}
                />
                {image?.url ? (
                  <img
                    src={image.url}
                    alt={`product-${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 text-xs">
                    <FiUploadCloud className="text-xl mb-1" />
                    Upload
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-indigo-700 transition-all duration-300"
            disabled={loading}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default Editproductpage;
