const twilio = require("twilio");

const client = twilio(

  process.env.TWILIO_SID,

  process.env.TWILIO_AUTH_TOKEN

);

const sendWhatsAppMessage = async (

  phone,
  message

) => {

  try {

    await client.messages.create({

      from: "whatsapp:+14155238886",

      to: `whatsapp:+91${phone}`,

      body: message,

    });

    console.log("WhatsApp Sent");

  } catch (error) {

    console.log(error.message);

  }

};

module.exports = sendWhatsAppMessage;