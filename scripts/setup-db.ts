import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up multi-tenant invoice system...\n')

  // Create demo business 1
  console.log('📦 Creating demo business: Acme Corporation')
  const business1 = await prisma.business.create({
    data: {
      name: 'Acme Corporation',
      email: 'info@acme.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      taxId: '12-3456789',
      website: 'https://acme.com',
      currency: 'USD',
      plan: 'business',
    }
  })

  // Create business settings
  await prisma.businessSettings.create({
    data: {
      businessId: business1.id,
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1001,
      paymentTermsDays: 30,
      invoiceTerms: 'Payment is due within 30 days. Late payments may incur fees.',
      invoiceNotes: 'Thank you for your business!',
    }
  })

  // Create admin user for business 1
  const hashedPassword = await bcrypt.hash('password123', 12)
  const admin1 = await prisma.user.create({
    data: {
      businessId: business1.id,
      email: 'admin@acme.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
    }
  })

  console.log('✅ Business 1 created')
  console.log(`   - Business ID: ${business1.id}`)
  console.log(`   - Admin User: ${admin1.email} / password123\n`)

  // Create customers for business 1
  console.log('👥 Creating customers...')
  const customer1 = await prisma.customer.create({
    data: {
      businessId: business1.id,
      customerCode: 'CUST-001',
      name: 'Tech Solutions Inc',
      email: 'contact@techsolutions.com',
      company: 'Tech Solutions Inc',
      phone: '+1 (555) 987-6543',
      address: '456 Tech Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    }
  })

  const customer2 = await prisma.customer.create({
    data: {
      businessId: business1.id,
      customerCode: 'CUST-002',
      name: 'Global Services LLC',
      email: 'info@globalservices.com',
      company: 'Global Services LLC',
      phone: '+1 (555) 456-7890',
      address: '789 Global Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    }
  })

  console.log(`✅ Created ${2} customers\n`)

  // Create products for business 1
  console.log('🛍️  Creating products...')
  const product1 = await prisma.product.create({
    data: {
      businessId: business1.id,
      sku: 'PROD-001',
      name: 'Web Development - Basic Package',
      description: 'Basic website development package including 5 pages',
      category: 'Services',
      price: 3000,
      cost: 1500,
      taxRate: 8.5,
      type: 'service',
    }
  })

  const product2 = await prisma.product.create({
    data: {
      businessId: business1.id,
      sku: 'PROD-002',
      name: 'SEO Optimization',
      description: 'Complete SEO optimization service',
      category: 'Services',
      price: 1500,
      cost: 700,
      taxRate: 8.5,
      type: 'service',
    }
  })

  const product3 = await prisma.product.create({
    data: {
      businessId: business1.id,
      sku: 'PROD-003',
      name: 'Logo Design',
      description: 'Professional logo design with 3 revisions',
      category: 'Design',
      price: 500,
      cost: 200,
      taxRate: 8.5,
      type: 'service',
    }
  })

  console.log(`✅ Created ${3} products\n`)

  // Create demo business 2
  console.log('📦 Creating demo business: Tech Innovations')
  const business2 = await prisma.business.create({
    data: {
      name: 'Tech Innovations',
      email: 'hello@techinnovations.com',
      phone: '+1 (555) 234-5678',
      address: '999 Innovation Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      website: 'https://techinnovations.com',
      currency: 'USD',
      plan: 'starter',
    }
  })

  await prisma.businessSettings.create({
    data: {
      businessId: business2.id,
      invoicePrefix: 'TI',
      nextInvoiceNumber: 5000,
      paymentTermsDays: 15,
    }
  })

  const admin2 = await prisma.user.create({
    data: {
      businessId: business2.id,
      email: 'admin@techinnovations.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'admin',
    }
  })

  console.log('✅ Business 2 created')
  console.log(`   - Business ID: ${business2.id}`)
  console.log(`   - Admin User: ${admin2.email} / password123\n`)

  console.log('🎉 Setup complete!\n')
  console.log('Login credentials:')
  console.log('  Business 1: admin@acme.com / password123')
  console.log('  Business 2: admin@techinnovations.com / password123\n')
  console.log('Start the dev server:')
  console.log('  npm run dev\n')
  console.log('Then navigate to:')
  console.log('  http://localhost:9002/admin/invoices')
  console.log('  http://localhost:9002/invoices\n')
}

main()
  .catch((e) => {
    console.error('Error setting up database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
