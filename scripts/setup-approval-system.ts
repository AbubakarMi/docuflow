import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Setting up approval system and SuperAdmin...\n')

  try {
    // Add username column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
    `)
    console.log('✅ Added username column to users')

    // Add business approval columns
    await prisma.$executeRawUnsafe(`
      ALTER TABLE businesses ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE businesses ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE businesses ADD COLUMN IF NOT EXISTS "approvedBy" TEXT;
    `)
    console.log('✅ Added approval columns to businesses')

    // Delete old SuperAdmin if exists
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'SuperAdmin' },
          { email: 'abubakarmi131@gmail.com' },
          { username: 'SuperAdmin' }
        ]
      }
    })
    console.log('✅ Cleaned up old SuperAdmin accounts')

    // Create new SuperAdmin with specific credentials
    const hashedPassword = await bcrypt.hash('DefaultPass123', 12)

    const superAdmin = await prisma.user.create({
      data: {
        username: 'SuperAdmin',
        email: 'abubakarmi131@gmail.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'superadmin',
        isSuperAdmin: true,
        businessId: null,
        status: 'active'
      }
    })

    console.log('\n🎉 SuperAdmin account created successfully!\n')
    console.log('═══════════════════════════════════════════')
    console.log('         SUPER ADMIN CREDENTIALS')
    console.log('═══════════════════════════════════════════')
    console.log('  Username: SuperAdmin')
    console.log('  Email:    abubakarmi131@gmail.com')
    console.log('  Password: DefaultPass123')
    console.log('═══════════════════════════════════════════\n')

    console.log('SuperAdmin Capabilities:')
    console.log('  ✓ Approve/reject business registrations')
    console.log('  ✓ Manage all users in the system')
    console.log('  ✓ View all businesses')
    console.log('  ✓ Upload and manage templates')
    console.log('  ✓ System-wide analytics')
    console.log('  ✓ Business status management\n')

    console.log('Login Options:')
    console.log('  • Username: SuperAdmin')
    console.log('  • Email: abubakarmi131@gmail.com\n')

    // Auto-approve existing businesses
    const existingBusinesses = await prisma.business.findMany({
      where: { approved: false }
    })

    if (existingBusinesses.length > 0) {
      await prisma.business.updateMany({
        where: { approved: false },
        data: {
          approved: true,
          approvedAt: new Date(),
          approvedBy: superAdmin.id
        }
      })
      console.log(`✅ Auto-approved ${existingBusinesses.length} existing business(es)\n`)
    }

    console.log('⚠️  IMPORTANT:')
    console.log('  - New businesses will require approval')
    console.log('  - SuperAdmin will receive approval requests')
    console.log('  - Users can login with username OR email\n')

  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('ℹ️  Columns already exist - updating SuperAdmin...')
    } else {
      throw error
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
