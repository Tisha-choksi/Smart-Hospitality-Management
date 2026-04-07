class NotificationService {
  static async sendNotification(data) {
    console.log('Notification:', data);
    return true;
  }
}

module.exports = { NotificationService };