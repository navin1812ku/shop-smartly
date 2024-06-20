const express = require('express');

const LoginRouter = express.Router();
const LoginService = require('../services/LoginService');


//login
LoginRouter.post('/login', async (req, res) => {
    const details = req.body;
    const loginDetails = await LoginService.login(details);
    res.json(loginDetails);
});


module.exports = LoginRouter;