class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createUser(email, hashedPassword) {
        return await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });
    }

    async findUserByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }
}

export default UserRepository;
