import React, { useEffect, useState } from 'react';
import { 
  Lamp, 
  Pencil, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Save, 
  Loader2,
  Ruler,
  Tag
} from 'lucide-react';
import api from '../../api/axiosConfig';

// Layout Components
import Navbar from '../../Components/Navbar/Navbar';
import AdminNavbar from '../../Components/Navbar/AdminNavbar'; 
import Footer from '../../Components/Footer/Footer';

function Oder_Homedeco() {
  const [decoList, setDecoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- 1. FETCH DATA & SORT ---
  const fetchDeco = async () => {
    try {
      setLoading(true);
      const response = await api.get('/homedeco/getAllHomedeco');
      
      if (response.data.code === "00") {
        // Normalize & Sort by ID to prevent jumping
        const normalizedData = response.data.content.map(item => ({
            ...item,
            // Ensure we have a valid number for quantity
            quantity: item.quantity ?? 0 
        }))
        .sort((a, b) => a.id - b.id);

        setDecoList(normalizedData);
      } else {
        setError("Failed to fetch home deco list.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeco();
  }, []);

  // --- 2. HANDLE QUANTITY CHANGE ---
  const handleQuantityChange = async (item, change) => {
    const currentQty = item.quantity ?? 0;
    const newQuantity = currentQty + change;
    
    if (newQuantity < 0) return; 

    // Confirmation Dialog
    const action = change > 0 ? "increase" : "decrease";
    const confirmMsg = `Are you sure you want to ${action} the stock for "${item.decoName}" to ${newQuantity}?`;
    
    if (!window.confirm(confirmMsg)) {
        return; 
    }

    // Optimistic Update
    const updatedItemState = { ...item, quantity: newQuantity };
    setDecoList(prev => 
      prev.map(i => i.id === item.id ? updatedItemState : i)
    );

    try {
      const response = await api.put('/homedeco/updateDeco', updatedItemState);
      
      if (response.data.code !== "00") {
        alert("Failed to update stock on server.");
        fetchDeco(); // Revert
      }
    } catch (err) {
      console.error(err);
      fetchDeco(); // Revert
    }
  };

  // --- 3. HANDLE DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item permanently?")) {
      try {
        const response = await api.delete(`/homedeco/deleteHomedeco?id=${id}`);
        if (response.data.code === "00") {
          setDecoList(prev => prev.filter(item => item.id !== id));
        } else {
          alert("Failed to delete item.");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting item.");
      }
    }
  };

  // --- 4. HANDLE EDIT MODAL ---
  const openEditModal = (item) => {
    setEditingItem({ ...item }); 
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/homedeco/updateDeco', editingItem);
      if (response.data.code === "00") {
        setDecoList(prev => 
          prev.map(i => i.id === editingItem.id ? editingItem : i)
        );
        setIsModalOpen(false);
        alert("Item updated successfully!");
      } else {
        alert("Update failed: " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving updates.");
    }
  };

  // --- RENDER TABLE ROW ---
  const DecoRow = ({ item }) => {
    const displayQty = item.quantity ?? 0;

    return (
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              src={item.decoPicture || "https://via.placeholder.com/50"} 
              alt={item.decoName}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            <div>
              <div className="font-bold text-gray-900">{item.decoName}</div>
              <div className="text-xs text-gray-500 max-w-[200px] truncate">
                {item.decoDetails}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-teal-600"/> 
              LKR {item.decoPrice}
            </div>
            {item.decoSize && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Ruler size={12}/> {item.decoSize}
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-3 bg-gray-100 w-max px-3 py-1 rounded-full border border-gray-200">
            <button 
              onClick={() => handleQuantityChange(item, -1)}
              className="text-gray-500 hover:text-red-600 active:scale-90 transition disabled:opacity-50"
              disabled={displayQty <= 0}
            >
              <Minus size={16} />
            </button>
            
            <span className={`font-mono font-bold w-8 text-center ${displayQty < 5 ? 'text-red-600' : 'text-gray-800'}`}>
              {displayQty}
            </span>

            <button 
              onClick={() => handleQuantityChange(item, 1)}
              className="text-gray-500 hover:text-green-600 active:scale-90 transition"
            >
              <Plus size={16} />
            </button>
          </div>
          {displayQty < 5 && (
              <span className="text-[10px] text-red-500 font-bold ml-1">Low Stock</span>
          )}
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => openEditModal(item)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              title="Edit Details"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
              title="Delete Item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        <div className="hidden md:block">
            <AdminNavbar />
        </div>

        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Home Deco Inventory</h1>
              <p className="text-gray-500 mt-2">Manage decor items, prices, and stock.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
                Total Items: {decoList.length}
            </div>
          </div>

          {loading ? (
             <div className="h-96 flex items-center justify-center">
               <Loader2 className="animate-spin text-teal-600" size={48} />
             </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Lamp className="text-teal-600" /> Current Stock
                  </h2>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50/50">
                     <tr>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price & Info</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {decoList.length > 0 ? (
                        decoList.map(item => <DecoRow key={item.id} item={item} />)
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No home deco items found.</td>
                        </tr>
                      )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* --- EDIT MODAL --- */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 bg-gray-900 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Pencil size={18} /> Edit Home Deco
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={saveEdit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  name="decoName" 
                  value={editingItem.decoName} 
                  onChange={handleModalChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              {/* Price & Quantity Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (LKR)</label>
                  <input 
                    type="number" 
                    name="decoPrice" 
                    value={editingItem.decoPrice} 
                    onChange={handleModalChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    value={editingItem.quantity} 
                    onChange={handleModalChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Size Row */}
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Size / Dimensions</label>
                 <input 
                   type="text" 
                   name="decoSize" 
                   value={editingItem.decoSize} 
                   onChange={handleModalChange}
                   className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                 />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  name="decoDetails" 
                  rows="3"
                  value={editingItem.decoDetails} 
                  onChange={handleModalChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                 <button 
                   type="button" 
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex-1 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                 >
                   <Save size={18} /> Save Changes
                 </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Oder_Homedeco;