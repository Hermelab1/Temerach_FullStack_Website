import React, { useState, useEffect } from 'react';
import Sidemenus from '../menus/Sidemenus';
import Navbars from '../menus/AdminNav';
import Footer from '../menus/Footer';
import AdminPages from '../pages/AdminPages';
import io from 'socket.io-client';

const MainPage = () => {
  const [selectedMenuText, setSelectedMenuText] = useState('Dashboard');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const socket = io('http://localhost:4001'); // Ensure your backend URL is here

    socket.on('newOrder', (order) => {
      // Professional tip: Use a library like 'react-hot-toast' instead of alert()
      console.log("New Order Received:", order);
      alert(`New order received! ID: ${order.orderId}`);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Fixed width */}
      <Sidemenus onMenuSelect={setSelectedMenuText} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <Navbars selectedMenuText={selectedMenuText} />
        
        <main className="flex-grow overflow-y-auto p-4 mt-[8vh]">
          <div className="">
            <AdminPages username={username} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainPage;