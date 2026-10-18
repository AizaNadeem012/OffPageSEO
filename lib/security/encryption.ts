import crypto from 'crypto'

// Use a secure fallback key for local development if ENCRYPTION_KEY is not defined in env
// In production, ENCRYPTION_KEY must be a 64-character hex string (32 bytes)
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'rankwave_offpage_seo_agent_secure_aes256_key_2026_dev_seed!'

function getKey(): Buffer {
  return crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest()
}

/**
 * Encrypt sensitive credentials (e.g. passwords, API tokens) using AES-256-GCM
 */
export function encryptCredential(plainText: string): string {
  if (!plainText) return ''
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv)
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')
  
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypt credentials securely on the server side
 */
export function decryptCredential(cipherPayload: string): string {
  if (!cipherPayload) return ''
  try {
    const parts = cipherPayload.split(':')
    if (parts.length !== 3) return cipherPayload // If not encrypted format, return as is safely
    
    const [ivHex, authTagHex, encryptedHex] = parts
    const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    return '••••••••'
  }
}

/**
 * Mask credential for safe UI display (e.g. "••••••••" or "ab•••12")
 */
export function maskCredential(val?: string): string {
  if (!val) return '—'
  return '••••••••'
}
