import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Navbars from '../Navigation/Navbars';
import Home from '../Home/home'; 
import About from '../Ourstory/ourstorydetail';
import Events from '../gallarycompanents/events';
import Blog from '../blog/blog';
import Blogdetail from '../blog/blogdetail';
// import Blogsdetail from '../blog/blogsdetail';
import Contact from '../contact/contactusdetail'; 
import SampleOrder from '../OrderSample/sample';
import Orderd from '../OrderSample/orderd';
import PaymentMethod from '../OrderSample/payment';
import Login from '../AdminDashboard/Login';
import AdminPages from '../AdminDashboard/pages/MainPages'; // Adjust the import based on your actual path

const AppWithRouter = () => (
    <Router>
        <Navbars />
        <TransitionGroup>
            <CSSTransition classNames="fade" timeout={200}>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/ourStory" element={<About />} />
                        <Route path="/gallery" element={<Events />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blogdetail" element={<Blogdetail />} />
                        
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/sampleOrder" element={<SampleOrder />} />
                        <Route path="/orderd" element={<Orderd />} />
                        <Route path='/payment' element={<PaymentMethod/>}/>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={<AdminPages />} /> {/* This will handle all routes under '/' */}
                    </Routes>
                </div>
            </CSSTransition>
        </TransitionGroup>
    </Router>
);

export default AppWithRouter;