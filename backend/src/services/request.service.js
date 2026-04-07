const { prisma } = require('../config/database');

class RequestService {
    static async createRequest(data) {
        return prisma.serviceRequest.create({ data });
    }

    static async getRequests() {
        return prisma.serviceRequest.findMany();
    }
}

module.exports = { RequestService };