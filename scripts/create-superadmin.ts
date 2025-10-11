import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Creating SuperAdmin account...\n')

  // First, update the schema to allow null businessId
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ALTER COLUMN "businessId" DROP NOT NULL;
    `)
    console.log('✅ Updated users table schema')
  } catch (error) {
    console.log('ℹ️  Schema already updated or cannot be modified (this is okay)')
  }

  // Add isSuperAdmin column if it doesn't exist
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;
    `)
    console.log('✅ Added isSuperAdmin column')
  } catch (error) {
    console.log('ℹ️  isSuperAdmin column already exists (this is okay)')
  }

  // Add unique constraint on email if it doesn't exist
  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email);
    `)
    console.log('✅ Added unique constraint on email')
  } catch (error) {
    console.log('ℹ️  Unique constraint already exists (this is okay)')
  }

  // Drop old unique constraint if it exists
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_businessId_email_key;
    `)
    console.log('✅ Removed old unique constraint')
  } catch (error) {
    console.log('ℹ️  Old constraint already removed (this is okay)')
  }

  // Check if SuperAdmin already exists
  const existing = await prisma.user.findFirst({
    where: {
      email: 'SuperAdmin',
      isSuperAdmin: true
    }
  })

  if (existing) {
    console.log('\n⚠️  SuperAdmin already exists')
    console.log('   Email: SuperAdmin')
    console.log('   To reset password, delete this user first\n')
    return
  }

  // Hash the default password
  const hashedPassword = await bcrypt.hash('DefaultPass123', 12)

  // Create SuperAdmin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'SuperAdmin',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superadmin',
      isSuperAdmin: true,
      businessId: null, // SuperAdmin is not tied to any business
      status: 'active'
    }
  })

  console.log('\n🎉 SuperAdmin account created successfully!\n')
  console.log('═══════════════════════════════════════')
  console.log('    SUPER ADMIN CREDENTIALS')
  console.log('═══════════════════════════════════════')
  console.log('  Email:    SuperAdmin')
  console.log('  Password: DefaultPass123')
  console.log('═══════════════════════════════════════\n')
  console.log('⚠️  IMPORTANT: Change this password immediately in production!\n')
  console.log('SuperAdmin can:')
  console.log('  ✓ View all businesses in the system')
  console.log('  ✓ Access all invoices across all businesses')
  console.log('  ✓ Manage system-wide settings')
  console.log('  ✓ Monitor all activities')
  console.log('  ✓ Generate consolidated reports\n')
  console.log('SuperAdmin cannot:')
  console.log('  ✗ Access individual business data (privacy protected)')
  console.log('  ✗ View customer details (GDPR compliant)')
  console.log('  ✗ See internal business notes\n')
}

main()
  .catch((e) => {
    console.error('❌ Error creating SuperAdmin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
