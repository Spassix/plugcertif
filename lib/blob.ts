import { put, del, list, head } from '@vercel/blob'
import { NextRequest } from 'next/server'

// Upload un fichier vers Vercel Blob
export async function uploadToBlob(file: File | Buffer, filename: string): Promise<string> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN must be set')
    }

    let buffer: Buffer
    let contentType: string

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      contentType = file.type
    } else {
      buffer = file
      contentType = 'application/octet-stream'
    }

    // Upload vers Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return blob.url
  } catch (error) {
    console.error('Blob upload error:', error)
    throw error
  }
}

// Supprimer un fichier de Vercel Blob
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN must be set')
    }

    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error('Blob delete error:', error)
    throw error
  }
}

// Lister les fichiers
export async function listBlobs(prefix?: string): Promise<any[]> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN must be set')
    }

    const { blobs } = await list({
      prefix,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return blobs
  } catch (error) {
    console.error('Blob list error:', error)
    return []
  }
}

// Obtenir les informations d'un fichier
export async function getBlobInfo(url: string): Promise<any | null> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN must be set')
    }

    const blob = await head(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return blob
  } catch (error) {
    console.error('Blob head error:', error)
    return null
  }
}

// Helper pour générer un nom de fichier unique
export function generateBlobFilename(originalName: string, folder: string = 'uploads'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || 'bin'
  return `${folder}/${timestamp}-${random}.${extension}`
}

