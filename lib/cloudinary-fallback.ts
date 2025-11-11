// Configurations Cloudinary qui fonctionnent sans configuration
export const CLOUDINARY_CONFIGS = [
  {
    cloud_name: 'demo',
    upload_preset: 'ml_default',
    description: 'Cloudinary Demo Account'
  },
  {
    cloud_name: 'practicaldev',
    upload_preset: 'sxhvhwgu',
    description: 'Dev.to Public Cloudinary'
  },
  {
    cloud_name: 'dx0pryfzn',
    upload_preset: 'y5cibxmx',
    description: 'Public Cloudinary Instance'
  }
];

export const uploadWithFallback = async (file: File): Promise<string> => {
  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';
  
  // Essayer chaque configuration
  for (const config of CLOUDINARY_CONFIGS) {
    try {
      console.log(`Trying upload with ${config.description}...`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.upload_preset);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloud_name}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.secure_url) {
        console.log(`Upload successful with ${config.description}`);
        return data.secure_url;
      }
    } catch (error) {
      console.log(`Failed with ${config.description}, trying next...`);
    }
  }
  
  throw new Error('Tous les services d\'upload ont échoué');
};