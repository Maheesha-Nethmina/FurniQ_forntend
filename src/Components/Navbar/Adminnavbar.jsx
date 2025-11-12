import React from 'react';
// 1. Import Link and useLocation from react-router-dom
import { Link, useLocation } from 'react-router-dom';

// 2. Import the icons
import {
  LayoutDashboard,
  Armchair,
  Lamp,
  PackagePlus
} from 'lucide-react';

// --- AdminNavbar Component Code ---
// I've moved the AdminNavbar code inside this file to fix the import error.

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Order Furniture', icon: Armchair, path: '/order-furniture' },
  { name: 'Order Home Deco', icon: Lamp, path: '/order-homedeco' },
  { name: 'Add Item', icon: PackagePlus, path: '/add-item' },
];

/**
 * This is the AdminNavbar component.
 * It's now inside the same file as AdminDashBoard.
 */
function AdminNavbar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-72 flex-col bg-gray-900 rounded-r-2xl shadow-xl pt-28">
      <nav className="pt-8 flex-1 flex-col p-4 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <Icon size={22} />
              <span className="font-medium text-lg">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
export default AdminNavbar;