import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateInvoiceNumber(prefix: string, number: number): string {
  return `${prefix}-${number.toString().padStart(5, '0')}`
}

export function generatePaymentNumber(number: number): string {
  return `PAY-${number.toString().padStart(5, '0')}`
}
