exports.login = (req, res) => {
    const { email, password } = req.body;
    if (email === 'test@example.com' && password === 'password') {
      res.json({ message: 'Login successful!', userId: 1 });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  };
  