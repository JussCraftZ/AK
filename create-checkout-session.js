import Stripe from "stripe";
import admin from "firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Initialize Firebase Admin once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { cart, email } = req.body;

    // ✅ Step 1: Create Firestore order
    const orderRef = await db.collection("orders").add({
      email,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Pending",
      createdAt: new Date().toISOString(),
    });

    // ✅ Step 2: Build Stripe line items
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // ✅ Step 3: Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success.html?orderId=${orderRef.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel.html`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    res.status(500).json({ error: "Checkout failed" });
  }
}
