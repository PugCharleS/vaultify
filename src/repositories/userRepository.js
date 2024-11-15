import knex from '../db/knex.js';

class UserRepository {
    async createUser(email, hashedPassword) {
        const [user] = await knex('users').insert({
            email,
            password: hashedPassword,
            created_at: knex.fn.now(),
        }).returning(['id', 'email']);
        return user;
    }

    async findUserByEmail(email) {
        const user = await knex('users')
            .where({ email })
            .first();
        return user;
    }
}

export default new UserRepository();
