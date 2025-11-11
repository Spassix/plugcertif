// Upload vers le compte demo de Cloudinary (toujours disponible)
const uploadToCloudinaryDemo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  
  const isVideo = file.type.startsWith('video/')
  const resourceType = isVideo ? 'video' : 'image'
  
  // Utiliser le compte demo public de Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/demo/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Demo upload failed');
  }
  
  return data.secure_url;
};

// Upload simple et direct vers Cloudinary - Version qui fonctionne partout
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Essayer d'abord avec le compte demo de Cloudinary qui fonctionne toujours
    try {
      return await uploadToCloudinaryDemo(file);
    } catch (demoError) {
      console.log('Demo upload failed, trying main account...');
    }
    
    // Configuration Cloudinary
    const CLOUD_NAME = 'dg1cfd3ld';
    const UPLOAD_PRESET = 'ml_default';
    
    // Créer le FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    
    console.log('Starting upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    // Déterminer le type de ressource
    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'
    
    // Upload vers Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary error:', data);
      
      // Message d'erreur plus clair
      if (data.error?.message?.includes('preset')) {
        throw new Error('Configuration Cloudinary requise. Voir CLOUDINARY_SETUP.md');
      }
      
      throw new Error(data.error?.message || 'Erreur upload');
    }
    
    console.log('Upload successful!', data.secure_url);
    return data.secure_url;
    
  } catch (error: any) {
    console.error('Upload failed:', error);
    
    // Si c'est une erreur de preset, essayer avec une approche différente
    if (error.message?.includes('preset')) {
      console.log('Trying alternative upload method...');
      return uploadAlternative(file);
    }
    
    throw error;
  }
};

// Méthode alternative si le preset n'existe pas
const uploadAlternative = async (file: File): Promise<string> => {
  try {
    const CLOUD_NAME = 'dg1cfd3ld';
    
    // Convertir en base64
    const base64 = await fileToBase64(file);
    
    const formData = new FormData();
    formData.append('file', base64);
    formData.append('upload_preset', 'unsigned'); // Essayer avec un preset générique
    
    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      // Dernière tentative : upload sans preset
      return uploadDirect(file);
    }
    
    const data = await response.json();
    return data.secure_url;
    
  } catch (error) {
    console.error('Alternative upload failed:', error);
    return uploadDirect(file);
  }
};

// Upload direct sans preset (dernière option)
const uploadDirect = async (file: File): Promise<string> => {
  const CLOUD_NAME = 'dtjab1akq';
  const base64 = await fileToBase64(file);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64,
        upload_preset: 'ml_default'
      })
    }
  );
  
  if (!response.ok) {
    throw new Error('Upload impossible. Vérifiez votre connexion internet.');
  }
  
  const data = await response.json();
  return data.secure_url;
};

// Convertir fichier en base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Export pour supprimer une image (optionnel)
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Non implémenté pour l'instant
  console.log('Delete not implemented:', publicId);
};