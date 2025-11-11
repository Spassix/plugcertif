import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  plugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plug',
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index composé pour recherche rapide
voteSchema.index({ userId: 1, plugId: 1 }, { unique: true })
voteSchema.index({ userId: 1, votedAt: -1 })

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema)