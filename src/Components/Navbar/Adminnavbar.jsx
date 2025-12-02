import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Armchair,
  Lamp,
  PackagePlus,
  Wand2,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'User Details', icon: Users, path: '/userdetails' },
  { name: 'Furniture Orders', icon: Armchair, path: '/order-furniture' },
  { name: 'Home Deco Orders', icon: Lamp, path: '/order-homedeco' },
  // { name: 'Add New Furniture', icon: PackagePlus, path: '/add-item' },
  // { name: 'Add New Deco', icon: Wand2, path: '/add-deco' },
];

function AdminNavbar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      className={`
        sticky top-16 flex flex-col bg-gray-900 shadow-xl h-[calc(100vh-4rem)] 
        transition-all duration-300 ease-in-out border-r border-gray-800
        ${isExpanded ? 'w-64' : 'w-20'} 
      `}
    >
      {/* 4. Toggle Button */}
      <div className="flex justify-end p-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 flex-col px-3 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
                ${!isExpanded && 'justify-center'} // Center icon when collapsed
              `}
            >
              <div className="min-w-[20px]"> {/* Ensures icon doesn't shrink */}
                <Icon size={22} />
              </div>

              {/* 5. Text is hidden when collapsed with smooth transition */}
              <span 
                className={`
                  font-medium text-base whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
                `}
              >
                {link.name}
              </span>

              {/* Optional: Tooltip on hover when collapsed */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md border border-gray-700">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default AdminNavbar;