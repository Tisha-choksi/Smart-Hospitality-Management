const { prisma } = require('../config/database');

class BookingService {
  static async createBooking(data) {
    return prisma.booking.create({ data });
  }

  static async getBookings() {
    return prisma.booking.findMany();
  }
}

module.exports = { BookingService };