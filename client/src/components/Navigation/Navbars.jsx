import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../asset/img/Logo/Logos.png';
import { nav } from '../data/nav'; 

const Header = () => {
    const [navlist, setNavList] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    // Check if current path matches admin paths
    const isInAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

    // If the user is on an admin path, return null (which means render nothing)
    if (isInAdminPath) {
        return null; 
    }
    return (
        <header className="bg-white lg:h-[8vh] md:h-[7vh] h-[8vh] shadow-custom absolute w-full top-0 z-[999] opacity-80 flex items-center justify-center text-center">
            <div className="flex w-full justify-between md:px-12 px-4">
                <div className="lg:w-[13%] md:w-[25%] w-[45%] md:py-2 py-1">
                    <img 
                        src={logo} 
                        alt="Temerachi Coffee" 
                        onClick={() => navigate("/")}
                    />
                </div>
                <div className={`lg:flex hidden xl:gap-16 lg:gap-8 md:py-2 py-1`}>
                    {nav.map((item, index) => (
                        <Link 
                            key={index}
                            to={item.path}
                            className="transition-transform text-xl text-teal-900 hover:underline hover:underline-offset-8"
                        >
                            {item.text}
                        </Link>
                    ))}
                </div>
                <div className="social-media hidden lg:flex py-2">
                    <div className="links flex gap-5">
                        <a href="https://www.facebook.com/Temerachixoffeeexport?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-facebook rounded-full text-[#105f4e] text-[1.7rem] hover:text-[#296558] transition duration-150"></i>
                        </a>
                        <a href="https://www.instagram.com/temerachicoffee?igsh=OTA3aGFocjFmbTVp" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-instagram rounded-full text-[#105f4e] text-[1.7rem] hover:text-[#296558] transition duration-150"></i>
                        </a>
                    </div>
                </div>
                <div className={`toggle flex lg:hidden`}>
                    <button 
                        onClick={() => setNavList(!navlist)}
                        className="px-[8px] py-[2px]"
                    >
                        <i className="text-white">{navlist ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}</i>
                    </button>
                </div>
                {navlist && (
                    <div className="small text-justify lg:hidden w-full bg-[#0b785f] absolute top-[8vh] md:top-[7vh] left-0 p-6">
                        <ul>
                            {nav.map((item, index) => (
                                <li key={index} className="mb-2">
                                    <Link
                                        to={item.path}
                                        className="text-white text-[1.12rem]">{item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;