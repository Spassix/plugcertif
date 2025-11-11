import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plug'
  },
  hasBeenCountedAsReferral: {
    type: Boolean,
    default: false
  },
  lastLikeAt: Date,
  likedPlugs: [{
    plugId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plug'
    },
    likedAt: Date
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

export default mongoose.models.User || mongoose.model('User', userSchema)