const { prisma } = require('../config/database');

class FeedbackService {
    static async createFeedback(data) {
        return prisma.feedback.create({ data });
    }

    static async getFeedback() {
        return prisma.feedback.findMany();
    }
}

module.exports = { FeedbackService };