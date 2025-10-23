const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Conexão com banco de dados OK!')
    
    // Testa se as tabelas existem
    const userCount = await prisma.user.count()
    const calcCount = await prisma.calculation.count()
    
    console.log(`📊 Usuários no banco: ${userCount}`)
    console.log(`📊 Cálculos no banco: ${calcCount}`)
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()