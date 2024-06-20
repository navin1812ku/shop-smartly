const express = require('express');

const UserRouter = express.Router();
const UserService = require("../../services/user/UserService");
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');

// Register
UserRouter.post('/user/register', async (req, res) => {
    const user = req.body;
    console.log(user);
    const userDetails = await UserService.register(user);
    res.json(userDetails);
});

//Get user details
UserRouter.get('/user/details', verifyToken, verifyRole([`USER`]), async (req, res) => {
    const userId = req.details.id;
    const userDetails = await UserService.getUserDetails(userId);
    res.json(userDetails);
});

UserRouter.post('/user/profileUpdate', verifyToken, verifyRole([`USER`]), async (req, res) => {
    const userId = req.details.id;
    const profileDetails = req.body;
    const userDetails = await UserService.profileUpdate(userId, profileDetails);
    res.json(userDetails);
});

//User pasword change 
UserRouter.post('/user/canChangePasssword', verifyToken, verifyRole([`USER`]), async (req, res) => {
    const userId = req.details.id;
    const passwordDetails = req.body;
    const userDetails = await UserService.isUserCanChangePassword(userId, passwordDetails.oldPassword);
    res.json(userDetails);
});

//Check the user's old password matched or not
UserRouter.post('/user/changePassword', verifyToken, verifyRole([`USER`]), async (req, res) => {
    const userId = req.details.id;
    const passwordDetails = req.body;
    const userDetails = await UserService.changePassword(userId, passwordDetails.newPassword);
    res.json(userDetails);
});

//Check if user exists
UserRouter.get('/user/exists/:email', async (req, res) => {
    const { email } = req.params;
    const userDetails = await UserService.isUserExists(email);
    res.json(userDetails);
});

UserRouter.post('/user/codeCheck', async (req, res) => {
    const codeDetails = req.body;
    const response = await UserService.isCodeMatches(codeDetails);
    res.json(response);
});

//User forgot password 
UserRouter.post('/user/forgetPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    const userDetails = await UserService.forgetPassword(email, newPassword);
    res.json(userDetails);
});

UserRouter.get('/user/orders', verifyToken, verifyRole([`USER`]), async (req, res) => {
    const userId = req.details.id;
    const userDetails = await UserService.getUserOrders(userId);
    res.json(userDetails);
});

module.exports = UserRouter;
