// lib/local-upload.js
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function localUpload(fileBuffer, fileName, folder = 'uploads') {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', folder)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${fileName}`
    const filePath = path.join(uploadDir, uniqueName)

    // Write file
    fs.writeFileSync(filePath, fileBuffer)

    return {
      success: true,
      imageUrl: `/${folder}/${uniqueName}`,
      filePath: filePath
    }
  } catch (error) {
    console.error('Local upload error:', error)
    throw new Error('Failed to upload image locally')
  }
}