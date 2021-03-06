const express = require("express")
const router = express.Router()
const auth = require("../..//middleware/auth")
const User = require("../../models/User")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs")
const { check, validationResult } = require("express-validator")

//@route  GET api/auth
//@desc   Auth route
//@access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (e) {
    console.log(e.message)
    res.status(500).send("Server Error")
  }
})

//@route  GET api/auth
//@desc   Authenticate user and get token
//@access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] })

      const isMatch = await bcrypt.compare(password, user.password)

      const payload = {
        user: {
          id: user.id,
        },
      }

      if (!isMatch)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] })

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (e, token) => {
          if (e) throw e
          res.json({ token })
        }
      )
    } catch (e) {
      console.log(e.message)
      res.status(500).send("Server error")
    }
  }
)

module.exports = router
