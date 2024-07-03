const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const viewedEpisodeSchema = new mongoose.Schema({
  animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
  episodeNumber: { type: Number, required: true },
  viewedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true,  trim:true, lowercase: true,
  validate: { validator(value){
  if (!validator.isEmail(value)){
  throw new Error ('Invaild Email')}}}},
  password: { type: String, required: true },
  bio: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ senderId: mongoose.Schema.Types.ObjectId, receiverId: mongoose.Schema.Types.ObjectId, content: String, sentAt: { type: Date, default: Date.now } }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
  viewingHistory: [viewedEpisodeSchema],
  tokens:[{ token:{ type:String,required: true}}],
  avatar:{ type:Buffer},
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

userSchema.methods.generateAuthToken = async function (){
  const user = this
  const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}


// userSchema.statics.findByCredentials = async (email,password)=>{
//   const user = await User.findOne({ email })
//   if (!user) {
//   throw new Error('Unable to login')
//   }
//   const isMatch = await bcrypt.compare(password, user.password)
//   if (!isMatch) {
//   throw new Error('Unable to login')
//   }
//   return user

// }

// Hash plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this
  // console.log(user._id)
  if (user.isModified('password')) {
  user.password = await bcrypt.hash(user.password, 8)
  }
  next()
 })

module.exports = mongoose.model('User', userSchema);