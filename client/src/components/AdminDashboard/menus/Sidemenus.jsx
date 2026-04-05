import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sidemenu } from '../../data/sidemenu';
import logo from '../../../asset/img/Logo/Logos.png';

const SideMenu = ({ onMenuSelect }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  const toggleSubMenu = (index, title) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
    onMenuSelect(title);
  };

  return (
    <nav className="bg-[#082f49] text-slate-300 w-64 h-full flex flex-col shadow-xl z-20">
      {/* Logo Section */}
      <div className="h-[8vh] flex items-center justify-center bg-white border-b border-slate-200">
        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Navigation Links */}
      <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1">
        {sidemenu.map((item, index) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isActive = location.pathname === item.path;

          return (
            <div key={index} className="space-y-1">
              {item.path ? (
                /* Single Link Item (Dashboard) */
                <Link
                  to={item.path}
                  onClick={() => onMenuSelect(item.title)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} w-6 text-center mr-3`}></i>
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              ) : (
                /* Collapsible Menu Item */
                <button
                  onClick={() => toggleSubMenu(index, item.title)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800 bg-transparent transition-colors group"
                >
                  <div className="flex items-center">
                    <i className={`${item.icon} w-6 text-center mr-3 group-hover:text-blue-400`}></i>
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <i className={`fa-solid fa-chevron-right text-[10px] transition-transform ${openSubMenu === index ? 'rotate-90' : ''}`} />
                </button>
              )}

              {/* Submenu Logic */}
              {hasSubmenu && openSubMenu === index && (
                <div className="ml-9 mt-1 space-y-1 border-l border-slate-700">
                  {item.submenu.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.path}
                      className="block px-6 py-2 text-xs hover:text-blue-400 text-slate-400 transition-colors"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default SideMenu;