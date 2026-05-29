const cron = require("node-cron");

const Member = require("../models/member.models");

const sendWhatsAppMessage =
require("../utils/whatsapp");

cron.schedule("* * * * *", async () => {

  console.log("Running Membership Reminder");

  const today = new Date();

  today.setHours(0,0,0,0);

  // 3 Days Later
  const next3Days = new Date();

  next3Days.setDate(
    today.getDate() + 3
  );

  // Expiring Soon Members
  const expiringMembers =
  await Member.find({

    expiryDate: {
      $gte: today,
      $lte: next3Days,
    },

  });

  // Send Reminder
  for (const member of expiringMembers) {

    await sendWhatsAppMessage(

      member.phone,

      `Hello ${member.fullName},
Your gym membership will expire soon.
Please renew your plan.`

    );

  }

  // Expired Members
  const expiredMembers =
  await Member.find({

    expiryDate: {
      $lt: today,
    },

  });

  // Send Expired Message
  for (const member of expiredMembers) {

    await sendWhatsAppMessage(

      member.phone,

      `Hello ${member.fullName},
Your gym membership has expired.
Please renew your membership.`

    );

  }

});