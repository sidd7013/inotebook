const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');



//create a user using : POST "/api/auth/createuser" . No login required.
router.post('/createuser', [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
        //If there are errors, return bad request and the errors
        try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() })
                }
                //Check whether the user with same email exists already
                let user = await User.findOne({ email: req.body.email });

                if (user) {
                        return res.status(400).json({ error: "sorry a user with this email already exists" });
                }
                //Create a new user
                user = await User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password

                })
                res.json(user);

        } catch (error) {
                console.error(error.messae);
                res.status(500).send("some error occured");

        }

})


module.exports = router