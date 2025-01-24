import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { nav } from '../../data/AdminNav'; 

const Header = ({ onLogout }) => { 
  const [navlist, setNavList] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setNavList(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white lg:h-[8vh] md:h-[7vh] h-[8vh] shadow-custom fixed w-full top-0 z-50 flex items-center justify-between px-4 md:px-12">
      <div className="relative right-12">
        <button
          onClick={() => setNavList(!navlist)}
          className="px-2 py-1 flex items-center bg-inherit hover:bg-inherit hover:px-4"
          aria-label={navlist ? "Close navigation" : "Open navigation"}
        >
            <i className={`fa-solid ${navlist ? "fa-angle-up" : "fa-angle-down"} text-[#105F4E]`}></i>
        </button>

        {navlist && (
          <div className="absolute left-0 w-28 mt-1 bg-white shadow-lg p-4 z-10 rounded-md">
            <ul>
              {nav.map((item, index) => (
                <li key={index} className="mb-2 last:mb-0">
                  <Link
                    to={item.path}
                    className="text-[1.12rem] hover:text-blue-500 transition-colors"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
              <li className="mb-2 last:mb-0">
                <button
                  onClick={handleLogout}
                  className="text-[1.12rem] hover:text-blue-500 transition-colors w-full text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;