const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
  const { zone, responsable } = req.query;
  if (zone) {
    try {
      const notifications = await prisma.fs_notification.findMany({
        where: { zone_id: parseInt(zone), isSubscribed: true },
      });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
  return res.status(400).json({ error: "Bad request" });
};
exports.addOrUpdateNotification = async (req, res) => {
  const { zone, responsable, isSubscribed } = req.body;
  if (zone && responsable) {
    try {
      const notification = await prisma.fs_notification.findFirst({
        where: { zone_id: zone, responsable_id: responsable },
      });
      if (notification) {
        await prisma.fs_notification.update({
          where: { id: notification.id },
          data: {
            zone_id: zone,
            responsable_id: responsable,
            isSubscribed: isSubscribed,
          },
        });
      } else {
        await prisma.fs_notification.create({
          data: {
            responsable_id: responsable,
            zone_id: zone,
            isSubscribed: isSubscribed,
          },
        });
      }
      const notifications = await prisma.fs_notification.findMany({
        where: { zone_id: parseInt(zone), isSubscribed: true },
      });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
  return res.status(400).json({ error: "Bad request" });
};
