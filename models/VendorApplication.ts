import mongoose from 'mongoose'

const vendorApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  telegramId: {
    type: Number,
    required: true
  },
  username: String,
  socialNetworks: {
    primary: [String],
    links: {
      type: Map,
      of: String
    },
    others: String
  },
  methods: {
    delivery: Boolean,
    shipping: Boolean,
    meetup: Boolean
  },
  deliveryZones: String,
  shippingZones: String,
  meetupZones: String,
  country: String,
  department: String,
  postalCode: String,
  photo: String,
  description: String,
  // Support pour l'ancienne structure (rétrocompatibilité)
  location: {
    country: String,
    department: String,
    postalCode: String
  },
  shopPhoto: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: String
})

const VendorApplication = mongoose.models.VendorApplication || 
  mongoose.model('VendorApplication', vendorApplicationSchema)

export default VendorApplication