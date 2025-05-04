const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Harryisgoodboy12#";

//ROUTE 1  : create a user using : POST "/api/auth/createuser" . No login required.
router.post('/createuser', [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
        //If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });

        }
        try {
                //Check whether the user with same email exists already
                let user = await User.findOne({ email: req.body.email });
                if (user) {
                        return res.status(400).json({ error: "sorry a user with this email already exists" });
                }
                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(req.body.password, salt);
                //Create a new user
                user = await User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: secPass

                })
                const data = {
                        user: {
                                id: user.id
                        }
                }

                const authToken = jwt.sign(data, JWT_SECRET);

                res.json({ authToken });

        } catch (error) {
                console.error(error.messae);
                res.status(500).send("Internal error occured");

        }

})

//ROUTE 2: Authenticate a user using : POST "/api/auth/login" . No login required.
router.post('/login', [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank ').exists(),
], async (req, res) => {

        //If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                console.log("errors console");
                return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
                let user = await User.findOne({ email });
                if (!user) {
                        return res.status(400).json({ error: "Please try to login with correct credentials" });
                }
                const passwordCompare = await bcrypt.compare(password, user.password);
                console.log(passwordCompare)
                if (!passwordCompare) {
                        return res.status(400).json({ error: "Please try to login with correct credentials" });

                }

                const data = {
                        user: {
                                id: user.id
                        }
                }

                const authToken = jwt.sign(data, JWT_SECRET);
                res.json({ authToken });

        } catch (error) {
                console.error(error.messaege);
                res.status(500).send("Internal error occured");

        }

})

//ROUTE 3: Get logged in User Details using : POST "/api/auth/getuser". Login required.
router.post('/getuser',fetchuser, async (req, res) => {

        try {
                userId = req.user.id;
                const user = await User.findById(userId).select("-password");
                res.send(user)

        } catch (error) {
                console.error(error.messaege);
                res.status(500).send("Internal error occured");

        }
})

module.exports = router


