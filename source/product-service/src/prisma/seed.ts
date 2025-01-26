import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productsData = [
    {
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop with RTX 3080',
      price: 1499.99,
      stock: 50,
      category: 'Electronics',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      price: 129.99,
      stock: 100,
      category: 'Accessories',
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life',
      price: 49.99,
      stock: 150,
      category: 'Accessories',
    },
    {
      name: '4K Monitor',
      description: '32-inch 4K HDR display for professional use',
      price: 699.99,
      stock: 30,
      category: 'Electronics',
    },
    {
      name: 'USB-C Hub',
      description: 'Multi-port USB-C hub with power delivery',
      price: 79.99,
      stock: 200,
      category: 'Accessories',
    },
    {
      name: 'Gaming Headset',
      description: '7.1 surround sound gaming headset with noise-cancelling mic',
      price: 159.99,
      stock: 75,
      category: 'Audio',
    },
    {
      name: 'Webcam',
      description: '1080p HD webcam with built-in microphone',
      price: 89.99,
      stock: 120,
      category: 'Electronics',
    },
    {
      name: 'External SSD',
      description: '1TB portable SSD with USB 3.2',
      price: 149.99,
      stock: 85,
      category: 'Storage',
    },
    {
      name: 'Graphics Card',
      description: 'NVIDIA RTX 3070 Gaming Graphics Card',
      price: 599.99,
      stock: 25,
      category: 'Components',
    },
    {
      name: 'RAM Kit',
      description: '32GB DDR4 3600MHz RAM kit (2x16GB)',
      price: 189.99,
      stock: 60,
      category: 'Components',
    },
  ];

  console.log('Starting seed...');

  // Clear existing products
  await prisma.product.deleteMany();

  // Insert new products
  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
