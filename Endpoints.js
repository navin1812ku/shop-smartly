const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


const UserRouter = require('./routers/user/UserRouter.js');
const AdminRouter = require('./routers/admin/AdminRouter.js');
const LoginRouter = require('./routers/LoginRouter.js');
const BrowsingHistoryRouter = require('./routers/user/BrowsingHistoryRouter');
const AddressRouter = require('./routers/user/AddressRouter.js');
const OrderHistoryRouter = require('./routers/user/OrderHistoryRouter.js');
const WishListRouter = require('./routers/user/WishListRouter.js');
const ProductRouter = require('./routers/vendor/ProductRouter.js');
const OrderRouter = require('./routers/user/OrderRouter.js');
const VendorRouter = require('./routers/vendor/VendorRouter.js');
const CourierRouter = require('./routers/courier/CourierRouter.js');
const CartRouter = require('./routers/cart/CartRouter.js');


const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_ATLAS_URI)
    .then(() => {
        console.log("Database connected!");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(UserRouter);
app.use(AdminRouter);
app.use(LoginRouter);
app.use(BrowsingHistoryRouter);
app.use(OrderHistoryRouter);
app.use(AddressRouter);
app.use(WishListRouter);
app.use(ProductRouter);
app.use(OrderRouter);
app.use(VendorRouter);
app.use(CourierRouter);
app.use(CartRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
