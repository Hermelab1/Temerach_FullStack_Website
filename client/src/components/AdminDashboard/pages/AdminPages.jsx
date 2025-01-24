import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard'; 
import BlogAdd from '../BlogAdd';
import EmployeeAdd from '../EmployeeAdd';
import CategoriesAdd from '../CategoriesAdd';
import ItemAdd from '../ItemAdd';
import OurTouchAdd from '../OurTouchAdd';
import TestimonialAdd from '../TestimonialAdd';
import ContactUsHistory from '../ContactUsHistory';
import UserAdd from '../UserAdd';
import RoleAdd from '../RoleAdd';

const AdminPages = () => {
    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/addblog" element={<BlogAdd />} />
            <Route path="/admin/addemployee" element={<EmployeeAdd />} />
            <Route path="/admin/addcategories" element={<CategoriesAdd />} />
            <Route path="/admin/additems" element={<ItemAdd />} />
            <Route path="/admin/addourtouch" element={<OurTouchAdd />} />
            <Route path="/admin/addtestimonial" element={<TestimonialAdd />} />
            <Route path="/admin/contactushistory" element={<ContactUsHistory />} />
            <Route path="/admin/addusers" element={<UserAdd />} />
            <Route path="/admin/addroles" element={<RoleAdd />} />
        </Routes>
    );
};

export default AdminPages;