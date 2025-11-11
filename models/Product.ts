import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  videos: [{
    url: String,
    thumbnail: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  socialNetworks: {
    type: Map,
    of: String
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // Lien avec un plug pour les badges
  plugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plug'
  }
}, {
  timestamps: true
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product