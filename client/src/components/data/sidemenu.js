export const sidemenu = [
    {
        title: 'Dashboard',
        path: '/admin',
        submenu: []
    },
    {
        title: 'Master Data',
        submenu: [
            { title: 'Blog', path: '/admin/addblog' },
            { title: 'Employee', path: '/admin/addemployee' },
            { title: 'Categorie', path: '/admin/addcategories' },
            { title: 'Testimonial', path: '/admin/addtestimonial' },
            { title: 'Contactus', path: '/admin/contactushistory' },
            { title: 'Orders', path: '/admin/orders'},
            { title: 'Payment', path: '/admin/payment'},
            { title: 'Currency', path: '/admin/currency'}
        ]
    },
    {
        title: 'Security',
        submenu: [
            { title: 'User', path: '/admin/addusers' },
            { title: 'Role', path: '/admin/addroles' }
        ]
    }
];