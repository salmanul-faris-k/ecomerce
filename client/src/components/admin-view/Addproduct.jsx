import React, { useRef, useState, useEffect } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, resetProductState } from '../../store/productSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Addproduct() {
  const [productData, setproductData] = useState({
    productNmae: '',
    Description: '',
    ProductType: '',
    PackageContents: '',
    Fit: '',
    Fabric: '',
    Pattern: '',
    Packof: '',
    countInStock: '',
    sizes: [],
    Price: '',
    gstPercentage: '', // ⭐ Added GST %
    Bestsller: false,
    Newcollection: false,
    images: [null, null, null, null],
  });

  const fileInputs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.product);

  // ⭐ GST rules
const gstRules = {
  Saree: 5,
  Kurti: 5,
  Pants: 5,
  "Co-ord Set": 5,
  Blouses: 5,
  Fabrics: 5,
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setproductData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Auto GST when ProductType changes
      if (name === 'ProductType' && gstRules[value] !== undefined) {
        updatedData.gstPercentage = gstRules[value];
      }
      return updatedData;
    });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...productData.images];
      newImages[index] = {
        file,
        url: URL.createObjectURL(file),
      };
      setproductData({ ...productData, images: newImages });
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
      productData.images.filter((img) => img && img.file).length === 0
    ) {
      toast.error('Please fill out all required fields and upload at least one image.');
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
    formData.append('countInStock', Number(productData.countInStock));
    formData.append('Price', Number(productData.Price));
    formData.append('gstPercentage', Number(productData.gstPercentage) || 0); // ⭐ send GST
    formData.append('Bestsller', productData.Bestsller);
    formData.append('sizes', JSON.stringify(productData.sizes));

    productData.images.forEach((imageObj, idx) => {
      if (imageObj && imageObj.file) {
        formData.append(`image${idx + 1}`, imageObj.file);
      }
    });

    dispatch(addProduct(formData));
  };

  useEffect(() => {
    if (success) {
      setproductData({
        productNmae: '',
        Description: '',
        ProductType: '',
        PackageContents: '',
        Fit: '',
        Fabric: '',
        Pattern: '',
        Packof: '',
        countInStock: '',
        sizes: [],
        Price: '',
        gstPercentage: '',
        Bestsller: false,
        Newcollection: false,
        images: [null, null, null, null],
      });
      toast.success('Product is added');
      dispatch(resetProductState());
      navigate('/admin/Products');
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg font-sans">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Add Product</h2>
      <button
        type="button"
        onClick={() => navigate('/admin/Products')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      {loading && <div className="mb-2 text-indigo-700">Uploading...</div>}
      {error && <div className="mb-2 text-red-600">Failed: {typeof error === 'string' ? error : JSON.stringify(error)}</div>}
      {success && <div className="mb-2 text-green-700">Product created successfully!</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="productNmae"
            value={productData.productNmae}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          { label: 'Count In Stock', name: 'countInStock', type: 'numberOnly' },
          { label: 'Price', name: 'Price', type: 'numberOnly' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              inputMode={type === 'numberOnly' ? 'numeric' : undefined}
              pattern={type === 'numberOnly' ? '[0-9]*' : undefined}
              value={productData[name]}
              onChange={(e) => {
                const val = e.target.value;
                if (type === 'numberOnly') {
                  if (val === '' || /^[0-9]+$/.test(val)) {
                    setproductData((prevData) => ({ ...prevData, [name]: val }));
                  }
                } else {
                  handleChange(e);
                }
              }}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        {/* GST % */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST %</label>
          <input
            type="text"
            name="gstPercentage"
            value={productData.gstPercentage}
            onChange={handleChange}
            disabled={gstRules[productData.ProductType] !== undefined}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="Description"
            value={productData.Description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    const selectedSize = e.target.value;
                    setproductData((prevData) => {
                      const newSizes = e.target.checked
                        ? [...prevData.sizes, selectedSize]
                        : prevData.sizes.filter((s) => s !== selectedSize);
                      return { ...prevData, sizes: newSizes };
                    });
                  }}
                  className="accent-indigo-600"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Best Seller */}
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

        {/* Upload Image */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
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
                  ref={(el) => (fileInputs.current[index] = el)}
                  onChange={(e) => handleFileChange(index, e)}
                />
                {image ? (
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

        {/* Submit */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-indigo-700 transition-all duration-300"
            disabled={loading}
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default Addproduct;
