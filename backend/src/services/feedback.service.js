const { prisma } = require('../index');

class FeedbackService {
    static async createFeedback(data) {
        return prisma.feedback.create({ data });
    }

    static async getFeedback() {
        return prisma.feedback.findMany();
    }
}

module.exports = { FeedbackService };