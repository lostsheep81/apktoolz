const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema first using mongoose.Schema
const UserSchemaDefinition = {
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Exclude password from query results by default
  },
  role: {
    type: String,
    enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a supported role'
    },
    default: 'user'
  },
  lastLogin: {
    type: Date
  }
};

// Add timestamps option to the schema definition object
const UserSchema = new mongoose.Schema(UserSchemaDefinition, { timestamps: true });

// Hash password before saving - Use .pre hook on the Schema instance
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    logger.error('Error hashing password:', error); // Log the error
    next(error); // Pass error to Mongoose
  }
});

// Method to verify password - Use .methods on the Schema instance
UserSchema.methods.verifyPassword = async function(candidatePassword) {
   // Ensure the user document's password field was included (if select: false is used)
   // You might need to explicitly select it in queries where comparison is needed.
   // e.g., User.findOne({ email }).select('+password')
  if (!this.password) {
     throw new Error("Password field not available for comparison. Ensure it's selected in the query.");
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
