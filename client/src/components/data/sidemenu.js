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
            { title: 'Items', path: '/admin/additems' },
            { title: 'Our Touch', path: '/admin/addourtouch' },
            { title: 'Testimonial', path: '/admin/addtestimonial' },
            { title: 'Contactus', path: '/admin/contactushistory' }
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