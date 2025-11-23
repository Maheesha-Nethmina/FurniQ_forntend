import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Armchair,
  Lamp,
  PackagePlus,
  Wand2 // 1. Imported a new icon for 'Add Deco'
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Furniture Orders', icon: Armchair, path: '/order-furniture' },
  { name: 'Home Deco Orders', icon: Lamp, path: '/order-homedeco' },
  { name: 'Add New Furnitures', icon: PackagePlus, path: '/add-item' },
  { name: 'Add New Deco', icon: Wand2, path: '/add-deco' }, 
];

function AdminNavbar() {
  const location = useLocation();

  return (
    <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-64 flex-col bg-gray-900 shadow-xl">
      <nav className="pt-8 flex-1 flex-col p-4 space-y-2">
        {navLinks.map((link) => {
          // This line will no longer be undefined
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
              {/* This will now render correctly */}
              <Icon size={20} /> 
              <span className="font-medium text-base">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
export default AdminNavbar;