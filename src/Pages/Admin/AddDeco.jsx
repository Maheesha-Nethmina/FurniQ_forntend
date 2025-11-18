import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertTriangle, Package } from 'lucide-react';

// FIXED PATHS: The previous path was causing compilation errors.
// These paths are adjusted to match standard project structure.
import Navbar from '../../Components/Navbar/Navbar'; 
import AdminNavbar from '../../Components/Navbar/AdminNavbar'; 

function AddDeco() {
  // State for all text/number inputs
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    price: '',
    // ADDED: Quantity field
    quantity: '', 
  });

  // Separate state for the image file
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // Define the API URL once
  const API_URL = 'http://localhost:8080/api/v1/homedeco/saveHomedeco';

  // Handler for text/number/select inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a URL for image preview
      const previewUrl = URL.createObjectURL(file);
      // Clean up previous preview URL to avoid memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(previewUrl);
    }
  };

  // Function to pass data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    if (!imageFile) {
      setMessage({ type: 'error', content: 'Please select an item image.' });
      setLoading(false);
      return;
    }
    
    try {
      // 1. Prepare the JSON Data Object (Mapping frontend state to Backend DTO keys)
      const decoData = {
        decoName: formData.name,
        decoDetails: formData.description,
        decoPrice: formData.price.toString(),
        decoSize: formData.size,
        // UPDATED: Sending quantity as an Integer
        quantity: parseInt(formData.quantity) 
      };

      // 2. Create FormData
      const data = new FormData();
      
      // Part 1: The File (Key must be 'file')
      data.append('file', imageFile);
      
      // Part 2: The Data (Key must be 'data')
      data.append('data', JSON.stringify(decoData));

      // 3. Send the request
      const response = await axios.post(
        API_URL, // Using the defined API_URL constant
        data, 
        {
          headers: {
            // This header is essential for sending files
            'Content-Type': 'multipart/form-data', 
          }
        }
      );

      // 4. Handle success (Assuming VarList.RSP_SUCCESS is "00")
      if (response.data.code === "00") {
        setMessage({ type: 'success', content: 'Deco item added successfully!' });
        
        // Reset form
        setFormData({ name: '', description: '', size: '', price: '', quantity: '' });
        setImageFile(null);
        if (imagePreview) { URL.revokeObjectURL(imagePreview); }
        setImagePreview(null);
        
        window.scrollTo(0, 0);
      } else {
         // Handle logical errors (e.g., duplicate name)
         setMessage({ type: 'error', content: response.data.message || 'Failed to add item. A duplicate item may exist.' });
      }

    } catch (error) {
      // Handle network or server errors
      console.error('Error adding deco item:', error.response?.data || error.message);
      setMessage({
        type: 'error',
        content: error.response?.data?.message || 'Failed to connect to server. Check logs/CORS settings.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex pt-16">
        <AdminNavbar />
        <main className="flex-1 p-6 md:p-10">
          
          {/* Form Container */}
          <div className="max-w-4xl mx-auto">
            
            {/* Header (matches your code) */}
            <h1 className="text-3xl font-bold text-gray-800">
              This is Add deco item page
            </h1>
            <p className="text-lg text-gray-600 mt-1 mb-6">
              Fill in the details below to add a new home deco product.
            </p>

            {/* Success/Error Message Display */}
            {message.content && (
              <div 
                className={`flex items-center gap-3 p-4 mb-6 rounded-lg shadow ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <span className="font-medium">{message.content}</span>
              </div>
            )}

            {/* Start of the Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                
              {/* --- Main Details Card (Now contains all fields) --- */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Deco Details
                </h2>
                
                {/* Grid for text inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="md:col-span-2">
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
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* ADDED: Quantity Input */}
                  <div className="md:col-span-1">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity (Stock)
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Size */}
                  <div className="md:col-span-2">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                      Size (e.g., H: 30cm)
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="H: 30cm, W: 20cm"
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
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
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* --- Image Upload --- */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Image
                  </label>
                  <label 
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 text-center">
                        <UploadCloud size={40} className="mb-4 text-gray-400" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold text-teal-600">Click to upload</span>
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
                
                {/* --- Submit Button --- */}
                <div className="flex justify-end pt-6">
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto inline-flex justify-center items-center gap-2 py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 transition"
                    >
                    <Package size={20} />
                    {loading ? 'Submitting...' : 'Add Deco Item'}
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

export default AddDeco;