const { prisma } = require('../index');

class StaffService {
    static async getStaff() {
        return prisma.user.findMany({
            where: { role: { in: ['STAFF', 'ADMIN'] } },
        });
    }
}

module.exports = { StaffService };