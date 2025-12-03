import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  ArrowLeftRight,
  Ban,
  Loader2
} from 'lucide-react';

import api from '../../api/axiosConfig';

import Navbar from '../../Components/Navbar/Navbar'; 
import AdminNavbar from '../../Components/Navbar/Adminnavbar';
import Footer from '../../Components/Footer/Footer';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/getAllUsers');
      
      if (response.data.code === "00") {
        // Sort by ID (Ascending) - Data is still sorted, just not shown
        const sortedUsers = response.data.content.sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
      } else {
        setError("Failed to fetch users.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  // Handle Role Update (User <-> Admin)
  const handleRoleUpdate = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmMsg = `Are you sure you want to change ${user.username}'s role to ${newRole}?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const payload = {
            id: user.id,
            username: user.username,
            mobileNumber: user.mobileNumber,
            email: user.email,
            role: newRole
        };

        const response = await api.put('/auth/updateUserDetails', payload);

        if (response.data.code === "00") {
          alert(`Success! ${user.username} is now a ${newRole}.`);
          fetchUsers(); 
        } else {
          alert("Failed to update role.");
        }
      } catch (err) {
        alert("Error updating user.");
        console.error(err);
      }
    }
  };

  const handleToggleActive = async (user) => {
    alert("This feature requires an 'isActive' column in your database Users table.");
  };

  
  const adminList = users.filter(u => u.role === 'ADMIN');
  const userList = users.filter(u => u.role === 'USER');

  // --- UPDATED ROW COMPONENT (Removed ID Column) ---
  const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      {/* 1. Removed the ID <td> here */}
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${user.role === 'ADMIN' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>
            {user.role === 'ADMIN' ? <ShieldCheck size={20} /> : <User size={20} />}
          </div>
          <div>
            <div className="font-bold text-gray-900">{user.username}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${true ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Active
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} className="text-gray-400"/> {user.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400"/> {user.mobileNumber || "N/A"}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Role Toggle Button */}
          <button 
            onClick={() => handleRoleUpdate(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 text-gray-600 transition shadow-sm"
            title={`Convert to ${user.role === 'ADMIN' ? 'User' : 'Admin'}`}
          >
            <ArrowLeftRight size={14} />
            {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
          </button>

          {/* Deactivate Button */}
          <button 
            onClick={() => handleToggleActive(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            title="Deactivate User"
          >
            <Ban size={14} />
            Block
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. Top Navbar */}
      <Navbar />

      <div className="flex flex-1 pt-16">
        
        {/* 2. Admin Sidebar */}
        <div className="hidden md:block">
            <AdminNavbar />
        </div>

        {/* 3. Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-2">Manage administrators, standard users, and permissions.</p>
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
            <div className="space-y-10">
              
              {/* --- TABLE 1: ADMINS --- */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-teal-50/30 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <ShieldCheck className="text-teal-600" /> Administrators
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Users with full access to the dashboard.</p>
                  </div>
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                    {adminList.length} Admins
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                      <tr>
                        {/* 2. Removed ID Header */}
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adminList.length > 0 ? (
                        adminList.map(admin => <UserRow key={admin.id} user={admin} />)
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-8 text-center text-gray-400 italic">No admins found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* --- TABLE 2: STANDARD USERS --- */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-blue-50/30 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <User className="text-blue-600" /> Standard Users
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Customers with order capabilities.</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {userList.length} Users
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                      <tr>
                        {/* 3. Removed ID Header */}
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userList.length > 0 ? (
                        userList.map(user => <UserRow key={user.id} user={user} />)
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-8 text-center text-gray-400 italic">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default UserDetails;