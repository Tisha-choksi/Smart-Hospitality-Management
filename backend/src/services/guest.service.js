const { prisma } = require('../index');

class GuestService {
    static async getGuests() {
        return prisma.user.findMany({
            where: { role: 'GUEST' },
        });
    }

    static async getGuestById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    static async updateGuest(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
}

module.exports = { GuestService };