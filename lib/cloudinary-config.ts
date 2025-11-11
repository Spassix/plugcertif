// Configuration Cloudinary
export const CLOUDINARY_CONFIG = {
  cloudName: 'dg1cfd3ld',
  uploadPreset: 'ml_default', // Preset par défaut
  
  // Options d'upload pour différents types d'images
  uploadOptions: {
    logo: {
      folder: 'plugs-crtfs/logos',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    },
    background: {
      folder: 'plugs-crtfs/backgrounds',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    },
    plug: {
      folder: 'plugs-crtfs/plugs',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    },
    welcome: {
      folder: 'plugs-crtfs/bot',
      transformation: [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    }
  }
}

// Upload avec transformation automatique
export const uploadToCloudinaryWithOptions = async (
  file: File, 
  type: 'logo' | 'background' | 'plug' | 'welcome' = 'plug'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  
  // Ajouter les options selon le type
  const options = CLOUDINARY_CONFIG.uploadOptions[type];
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error:', errorText);
      
      // Si le preset n'existe pas, essayer sans preset
      if (errorText.includes('preset') || errorText.includes('unsigned')) {
        console.log('Retrying without preset...');
        return uploadWithoutPreset(file, type);
      }
      
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    // Essayer sans preset en cas d'erreur
    return uploadWithoutPreset(file, type);
  }
}

// Upload sans preset (non signé)
const uploadWithoutPreset = async (file: File, type: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', `plugs-crtfs/${type}s`);
  
  // Créer une signature côté client (pour test uniquement)
  const timestamp = Math.round(new Date().getTime() / 1000);
  formData.append('timestamp', timestamp.toString());
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed without preset');
  }

  const data = await response.json();
  return data.secure_url;
}