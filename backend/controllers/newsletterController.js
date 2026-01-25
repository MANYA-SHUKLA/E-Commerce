const Subscriber = require("../models/Subscriber");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isVerified) {
        return res.status(200).json({
          success: true,
          message: "This email is already subscribed.",
        });
      }

      // Don't fail the request if email sending fails (common in dev/misconfigured SMTP)
      try {
        await sendVerificationEmail(existingSubscriber, req);
      } catch (mailErr) {
        console.error("Failed to send verification email:", mailErr);
      }
      return res.status(200).json({
        success: true,
        message: "Verification email resent. Please check your inbox.",
      });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    const subscriber = new Subscriber({
      email,
      verificationToken,
      verificationTokenExpires,
    });

    await subscriber.save();

    // Don't fail the subscription if email sending fails; user is still stored and can re-try.
    try {
      await sendVerificationEmail(subscriber, req);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);
    }

    res.status(200).json({
      success: true,
      message: "Thank you for subscribing! Please check your email to confirm.",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

async function sendVerificationEmail(subscriber, req) {
  // Prefer a configured public BASE_URL, but fall back to request origin in local dev.
  const baseUrlFromReq = (req) => {
    const origin = req?.headers?.origin;
    if (origin) return origin;
    const host = req?.get?.("host");
    if (!host) return undefined;
    return `${req.protocol}://${host}`;
  };

  const baseUrl = process.env.BASE_URL || baseUrlFromReq(req);
  if (!baseUrl) {
    throw new Error("Missing BASE_URL (and couldn't infer request origin)");
  }

  const verificationUrl = `${baseUrl}/api/newsletter/verify?token=${subscriber.verificationToken}`;

  const mailOptions = {
    to: subscriber.email,
    subject: "Confirm your subscription to the CHLOTHZY newsletter",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000;">
      <h2 style="color: #000;">Confirm your subscription</h2>
      <p>Hello,</p>
      <p>Thank you for subscribing to the CHLOTHZY newsletter. Please confirm your subscription by clicking the link below:</p>
      <p style="margin: 20px 0;"><a href="${verificationUrl}" target="_blank">Confirm your subscription</a></p>
      <p>If you didn't subscribe or no longer wish to receive these emails, you can safely ignore this message.</p>
      <p style="margin-top: 30px;">Best regards,<br/><strong>manya shukla</strong><br/>✉️ shuklamanya99@gmail.com</p>
    </div>
  `,
  };

  await sendEmail(mailOptions);
}

exports.verify = async (req, res) => {
  try {
    const { token } = req.query;

    const subscriber = await Subscriber.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!subscriber) {
      return res.status(400).send(`
                <h1>Verification Failed</h1>
                <p>Invalid or expired verification token.</p>
            `);
    }

    subscriber.isVerified = true;
    subscriber.verificationToken = undefined;
    subscriber.verificationTokenExpires = undefined;
    await subscriber.save();

    res.send(`
            <h1>Email Verified</h1>
            <p>Thank you for subscribing to our newsletter!</p>
            <script>
                setTimeout(() => {
          window.location.href = '${process.env.CLIENT_URL || '/'}';
                }, 3000);
            </script>
        `);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send(`
            <h1>Error</h1>
            <p>There was an error verifying your email.</p>
        `);
  }
};
