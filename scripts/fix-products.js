const mongoose = require('mongoose');
require('dotenv').config();

// Modèle Product simplifié pour le script
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  videos: [{
    url: String,
    thumbnail: String
  }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  specifications: Map,
  socialNetworks: Map,
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  plugId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function fixProductsData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Récupérer tous les produits
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      console.log(`\nProcessing product: ${product.name || 'Unnamed'}`);
      
      let needsUpdate = false;
      const updateData = {};
      
      // Vérifier et corriger le nom
      if (!product.name || product.name === 'Produit sans nom') {
        const description = product.description || '';
        const lines = description.split('\n');
        const firstLine = lines[0]?.trim();
        
        if (firstLine && firstLine.length > 0 && firstLine.length < 100) {
          updateData.name = firstLine;
          needsUpdate = true;
          console.log(`  - Will update name to: ${firstLine}`);
        }
      }
      
      // Vérifier et corriger le prix
      if (product.price === 0 || !product.price) {
        const description = product.description || '';
        const priceMatch = description.match(/(\d+)\s*€/);
        if (priceMatch) {
          updateData.price = parseInt(priceMatch[1]);
          needsUpdate = true;
          console.log(`  - Will update price to: ${priceMatch[1]}€`);
        }
      }
      
      // Ajouter les champs manquants
      if (!product.videos) {
        updateData.videos = [];
        needsUpdate = true;
      }
      if (product.likes === undefined) {
        updateData.likes = 0;
        needsUpdate = true;
      }
      if (product.views === undefined) {
        updateData.views = 0;
        needsUpdate = true;
      }
      if (!product.socialNetworks) {
        updateData.socialNetworks = new Map();
        needsUpdate = true;
      }
      if (product.inStock === undefined) {
        updateData.inStock = true;
        needsUpdate = true;
      }
      if (product.featured === undefined) {
        updateData.featured = false;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, { $set: updateData });
        console.log(`  - Updated product ${product._id}`);
      } else {
        console.log(`  - No updates needed for product ${product._id}`);
      }
    }
    
    console.log('\n✅ All products processed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Exécuter le script
fixProductsData();