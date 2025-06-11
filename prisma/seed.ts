import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'T-shirts',
        description: 'Comfortable and stylish t-shirts for everyday wear',
        image: '/images/categories/tshirts.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jeans',
        description: 'Classic and modern jeans for all occasions',
        image: '/images/categories/jeans.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Shoes',
        description: 'Trendy and comfortable footwear for every style',
        image: '/images/categories/shoes.jpg',
      },
    }),
  ])

  // Use available images for all products
  const productImages = [
    '/images/pexels-photo-6775345.jpeg',
    '/images/479545765_1229815639150726_7744305546491941198_n.jpg',
  ]

  // Create products
  const products = await Promise.all([
    // T-shirts
    prisma.product.create({
      data: {
        name: 'Classic White T-shirt',
        description: 'A timeless white t-shirt made from 100% cotton. Perfect for everyday wear.',
        price: 24.99,
        images: [productImages[0]],
        stock: 100,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Graphic Print T-shirt',
        description: 'Stylish t-shirt with a unique graphic print. Made from soft, breathable fabric.',
        price: 29.99,
        images: [productImages[1]],
        stock: 75,
        categoryId: categories[0].id,
      },
    }),
    // Jeans
    prisma.product.create({
      data: {
        name: 'Slim Fit Blue Jeans',
        description: 'Modern slim fit jeans in classic blue. Perfect for casual and semi-formal occasions.',
        price: 59.99,
        images: [productImages[0]],
        stock: 50,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Black Skinny Jeans',
        description: 'Versatile black skinny jeans. Stretchy and comfortable for all-day wear.',
        price: 54.99,
        images: [productImages[1]],
        stock: 60,
        categoryId: categories[1].id,
      },
    }),
    // Shoes
    prisma.product.create({
      data: {
        name: 'Classic White Sneakers',
        description: 'Timeless white sneakers with a comfortable fit. Perfect for casual outfits.',
        price: 79.99,
        images: [productImages[0]],
        stock: 40,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Leather Boots',
        description: 'Stylish leather boots with a modern design. Great for both casual and formal wear.',
        price: 129.99,
        images: [productImages[1]],
        stock: 30,
        categoryId: categories[2].id,
      },
    }),
  ])

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 