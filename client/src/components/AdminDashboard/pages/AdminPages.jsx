import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard'; 
import BlogAdd from '../BlogAdd';
import EmployeeAdd from '../EmployeeAdd';
import CategoriesAdd from '../CategoriesAdd';
import TestimonialAdd from '../TestimonialAdd';
import ContactUsHistory from '../ContactUsHistory';
import UOMAdd from '../UOMAdd';
import { ItemManagement } from '../ItemAdd';
import Ordes from '../orderAdd';
import UserAdd from '../UserAdd';
import RoleAdd from '../RoleAdd';
import Payment from '../payment';
import Currency from '../Currency';
import PaymentConfiguration from '../paymentconfiguration';
import WithUsername from './WithUsername'; // Adjust the path if necessary

const AdminPages = ({ username }) => {
    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<Dashboard username={username} />} />
            <Route path="/admin/addblog" element={<WithUsername Component={BlogAdd} username={username} />} />
            <Route path="/admin/addemployee" element={<WithUsername Component={EmployeeAdd} username={username} />} />
            <Route path="/admin/addcategories" element={<WithUsername Component={CategoriesAdd} username={username} />} />
            <Route path="/admin/addtestimonial" element={<WithUsername Component={TestimonialAdd} username={username} />} />
            <Route path="/admin/contactushistory" element={<WithUsername Component={ContactUsHistory} username={username} />} />
            <Route path="/admin/additem" element={<WithUsername Component={ItemManagement} username={username} />} />
            <Route path="/admin/adduom" element={<WithUsername Component={UOMAdd} username={username} />} />
            <Route path="/admin/orders" element={<WithUsername Component={Ordes} username={username} />} />
            <Route path="/admin/payment" element={<WithUsername Component={Payment} username={username} />} />
            <Route path="/admin/currency" element={<WithUsername Component={Currency} username={username} />}/>
            <Route path='/admin/paymentconfiguration' element={<WithUsername Component={PaymentConfiguration} username={username}/>}/>
            <Route path="/admin/addusers" element={<WithUsername Component={UserAdd} username={username} />} />
            <Route path="/admin/addroles" element={<WithUsername Component={RoleAdd} username={username} />} />

        </Routes>
    );
};

export default AdminPages;