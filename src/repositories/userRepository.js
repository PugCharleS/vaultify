import BaseRepository from './baseRepository.js';

class UserRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, 'user');
    }

    async createUser(email, hashedPassword) {
        return await this.create(
            { email, password: hashedPassword },
            { id: true, email: true }
        );
    }

    async findUserByEmail(email) {
        return await this.findUnique({ email });
    }
}

export default UserRepository;
