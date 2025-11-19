import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

import Navbar from '../../Components/Navbar/Navbar';
import AdminNavbar from '../../Components/Navbar/Adminnavbar'; // keep as-is if file name matches

const furnitureTypes = [
  "Living Room",
  "Bedroom",
  "Dining Room",
  "Office",
  "Outdoor",
  "Other"
];

function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    type: furnitureTypes[0],
    description: '',
    quantity: '',
    size: '',
    price: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // revoke previous preview URL if any to avoid memory leaks
      if (imagePreview) URL.revokeObjectURL(imagePreview);

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    if (!imageFile) {
      setMessage({ type: 'error', content: 'Please select an image.' });
      setLoading(false);
      return;
    }

    try {
      const furnitureData = {
        furnitureName: formData.name,
        furnitureDetails: formData.description,
        furnitureType: formData.type,
        furniturePrice: formData.price?.toString() || '0',
        furnitureSize: formData.size,
        quantity: parseInt(formData.quantity, 10) || 0
      };

      const data = new FormData();
      data.append('file', imageFile);
      data.append('data', JSON.stringify(furnitureData));

      const response = await axios.post(
        'http://localhost:8080/api/v1/furniture/saveNewfurniture',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.code === "00") {
        setMessage({ type: 'success', content: 'Item added successfully!' });

        setFormData({
          name: '',
          type: furnitureTypes[0],
          description: '',
          quantity: '',
          size: '',
          price: '',
        });
        setImageFile(null);

        // revoke preview URL and clear it
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }

        window.scrollTo(0, 0);
      } else {
        setMessage({ type: 'error', content: response.data.message || 'Failed to add item.' });
      }

    } catch (error) {
      console.error('Error adding item:', error);
      setMessage({
        type: 'error',
        content: error.response?.data?.message || 'Failed to connect to server.'
      });
    } finally {
      setLoading(false);
    }
  };

  // EFFECT: reload page 8 seconds after a successful submission
  useEffect(() => {
    let timer;
    if (message.type === 'success') {
      timer = setTimeout(() => {
        window.location.reload();
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [message.type]);

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex pt-16">
        <AdminNavbar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Add New Furniture Item
            </h1>

            {message.content && (
              <div
                className={`flex items-center gap-3 p-4 mb-6 rounded-lg ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <span className="font-medium">{message.content}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                  />
                </div>

                {/* Furniture Type */}
                <div className="md:col-span-1">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Furniture Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                  >
                    {furnitureTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                {/* Quantity */}
                <div className="md:col-span-1">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                  />
                </div>

                {/* Price */}
                <div className="md:col-span-1">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                  />
                </div>

                {/* Size */}
                <div className="md:col-span-2">
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                    Size (e.g., H: 80cm, W: 120cm, D: 40cm)
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Image
                  </label>
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                        <UploadCloud size={32} className="mb-3" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs">PNG, JPG, or WEBP (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      required
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400"
                  >
                    {loading ? 'Submitting...' : 'Add Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddItem;
