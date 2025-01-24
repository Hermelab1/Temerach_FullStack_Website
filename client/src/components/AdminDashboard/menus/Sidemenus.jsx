import React from 'react';
import { Link } from 'react-router-dom';
import { sidemenu } from '../../data/sidemenu'; // Adjust the path as necessary
import logo from '../../../asset/img/Logo/Logos.png';

const SubMenu = ({ submenu, onMenuSelect }) => {
    return (
        <ul>
            {submenu.map((item, index) => (
                <li key={index}>
                    {item.path ? (
                        <Link className='text-white font-Poppins p-6' to={item.path} onClick={() => onMenuSelect(item.title)}>
                            {item.title}
                        </Link>
                    ) : (
                        <span>{item.title}</span>
                    )}
                </li>
            ))}
        </ul>
    );
};

const SideMenu = ({ onMenuSelect }) => {
    return (
        <nav className="bg-cyan-950 text-white w-[18%] h-screen">
        <div className="w-full flex h-[8vh] p-4 justify-start items-center bg-white">
            <img src={logo} alt="Logo" className="h-[4vh] w-[65%]" />
        </div>
        <div className='p-4'> 
            <ul>
                {sidemenu.map((item, index) => (
                        <li key={index}>
                            {item.path ? (
                                <Link className='text-white font-Poppins' to={item.path} onClick={() => onMenuSelect(item.title)}>
                                    {item.title}
                                </Link>
                            ) : (
                                <span>{item.title}</span>
                            )}
                            {item.submenu.length > 0 && <SubMenu submenu={item.submenu} onMenuSelect={onMenuSelect} />}
                        </li>
                ))}
            </ul>
        </div>
        </nav>
    );
};

export default SideMenu;