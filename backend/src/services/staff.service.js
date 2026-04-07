const { prisma } = require('../config/database');

class StaffService {
    static async getStaff() {
        return prisma.user.findMany({
            where: { role: { in: ['STAFF', 'ADMIN'] } },
        });
    }
}

module.exports = { StaffService };