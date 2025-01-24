import React, { useState } from 'react';
import Sidemenus from '../menus/Sidemenus';
import Navbars from '../menus/AdminNav';
import Footer from '../menus/Footer';
import AdminPages from '../pages/AdminPages';

const MainPage = () => {
    const [selectedMenuText, setSelectedMenuText] = useState('');

    const handleMenuSelect = (menuText) => {
        setSelectedMenuText(menuText);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-row flex-grow">
                <Sidemenus onMenuSelect={handleMenuSelect} />
                <div className="flex flex-col w-full">
                    <Navbars selectedMenuText={selectedMenuText} />
                    <div className="adminpage flex-grow pt-[70px] overflow-auto border-8 border-gray-300">
                        <AdminPages />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default MainPage;