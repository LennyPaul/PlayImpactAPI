const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(express.json());


// Remplacez <your_connection_string> par votre chaîne de connexion MongoDB
mongoose.connect('mongodb+srv://lenpaul7:test@lenny.oega4dq.mongodb.net/?retryWrites=true&w=majority&appName=Lenny', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  exp: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Middleware de vérification du token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401); // Unauthorized if no token provided
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      console.log('JWT error:', err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user;
    next();
  });
};

app.post('/change-username', authenticateToken, async (req, res) => {
  const { newUsername } = req.body;
  const userId = req.user.userId;

  try {
    // Vérifiez si le nouveau nom d'utilisateur est déjà pris
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    // Trouvez l'utilisateur par ID et mettez à jour le nom d'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send('User not found');
    }

    user.username = newUsername;
    await user.save();
    res.status(200).send('Username updated');
  } catch (error) {
    res.status(500).send('Error updating username');
  }
});


// Route pour attribuer de l'expérience à un compte
app.post('/add-exp', authenticateToken, async (req, res) => {
  const { exp } = req.body;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send('User not found');
    }

    user.exp += exp;
    await user.save();
    res.status(200).send('Experience added');
  } catch (error) {
    res.status(500).send('Error adding experience');
  }
});

// Route pour récupérer l'expérience d'un compte
app.get('/get-exp', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send('User not found');
    }

    res.status(200).json({ exp: user.exp });
  } catch (error) {
    res.status(500).send('Error fetching experience');
  }
});

// Route pour récupérer l'expérience de tous les utilisateurs
app.get('/get-all-exp', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, 'username exp');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error fetching users experience');
  }
});

app.get('/users-by-exp', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().sort({ exp: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});