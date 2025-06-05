let prisma;
if (process.env.NODE_ENV === 'test') {
    prisma = {};
} else {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
}

export default prisma;
