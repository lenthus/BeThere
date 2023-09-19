// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

router.post(
    '',
    validateSignup,
    async (req, res, next) => {
      const { email, firstName, lastName, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      const emailCheck = await User.findOne({where:{email:req.body.email}})
      if (emailCheck){
        return res.status(500).json({"message":"User already exists","errors":{"email": "User with that email already exists"}})
      }
      const usernameCheck = await User.findOne({where:{username:req.body.username}})
      if (usernameCheck){
        return res.status(500).json({
          "message": "User already exists",
          "errors": {
            "username": "User with that username already exists"
          }
        })
      }
      console.log(emailCheck)
      const user = await User.create({ email, firstName, lastName, username, hashedPassword });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;
