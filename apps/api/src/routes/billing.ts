import { Hono } from "hono";
import { db, tenants } from "@chat-ncert/db";
import { eq } from "drizzle-orm";

const billingRouter = new Hono();

// Create subscription order (stub)
billingRouter.post("/subscribe", async (c) => {
  try {
    const { tenantId, plan } = await c.req.json();

    if (!tenantId || !plan) {
      return c.json({ error: { code: "BAD_REQUEST", message: "Missing tenantId or plan" } }, 400);
    }

    // Generate a mock checkout session or Razorpay order ID
    const orderId = `rzp_order_${Date.now()}`;
    return c.json({
      success: true,
      orderId,
      amount: plan === "starter" ? 99900 : 499900, // in paise (INR)
      currency: "INR",
    });
  } catch (err: any) {
    return c.json({ error: { code: "BAD_REQUEST", message: err.message } }, 400);
  }
});

// Razorpay Webhook to update tenant planTier
billingRouter.post("/razorpay/webhook", async (c) => {
  try {
    const body: any = await c.req.json();
    const event = body.event;

    // In production, verify Razorpay webhook signature here
    // using the webhook secret.

    if (event === "subscription.charged" || event === "payment.captured") {
      const tenantId = body.payload?.payment?.entity?.notes?.tenantId;
      const plan = body.payload?.payment?.entity?.notes?.planTier || "starter";

      if (tenantId) {
        await db.update(tenants).set({ planTier: plan }).where(eq(tenants.id, tenantId));

        console.log(`[Billing] Upgraded tenant ${tenantId} to plan ${plan}`);
      }
    }

    return c.json({ received: true });
  } catch (err: any) {
    return c.json({ error: { code: "WEBHOOK_ERROR", message: err.message } }, 500);
  }
});

export default billingRouter;
