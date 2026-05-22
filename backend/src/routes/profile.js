const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.put('/', async (req, res) => {
  try {
    const { name, email, password, currentPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required.' });
      const match = await user.comparePassword(currentPassword);
      if (!match) return res.status(401).json({ message: 'Current password is incorrect.' });
      user.password = password;
    }

    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
