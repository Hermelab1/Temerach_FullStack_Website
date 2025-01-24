const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/login'); // Ensure this path is correct
const blogRouter = require('./routes/blogs'); // Your blog routes1
const itemsRouter = require('./routes/item'); // Your item routes1
const employeeRouter = require('./routes/employee');
const ourtochRouter = require('./routes/ourtouch');
const testimonialRouter = require('./routes/testimonial');
const contactusRouter = require('./routes/contactus');



const { verifyToken, isAdmin, isUser } = require('./middleware/auth'); // Import middleware

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Use routers with base URLs
app.use('/api', loginRouter); // Login route should be public

app.use('/api/blogs', verifyToken, blogRouter); // Protect blog routes
app.use('/api/items', verifyToken, itemsRouter); // Protect item routes
app.use('/api/employee', verifyToken, employeeRouter); // Protect item routes
app.use('/api/ourtoch', verifyToken, ourtochRouter); // Protect item routes
app.use('/api/testimonial', verifyToken, testimonialRouter); // Protect item routes
app.use('/api/contactus',verifyToken, contactusRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});