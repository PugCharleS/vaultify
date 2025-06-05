class BaseRepository {
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.model = prisma[modelName];
    }

    async create(data, select) {
        return await this.model.create({ data, select });
    }

    async findUnique(where, select) {
        return await this.model.findUnique({ where, select });
    }

    async findFirst(where) {
        return await this.model.findFirst({ where });
    }

    async findMany(where, select) {
        return await this.model.findMany({ where, select });
    }

    async update(where, data, select) {
        return await this.model.update({ where, data, select });
    }

    async updateMany(where, data) {
        return await this.model.updateMany({ where, data });
    }

    async delete(where) {
        return await this.model.delete({ where });
    }

    async deleteMany(where) {
        return await this.model.deleteMany({ where });
    }
}

export default BaseRepository;
