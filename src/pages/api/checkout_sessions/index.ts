import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { cart } = req.body;

    try {
      const product = await stripe.products.create({
        name: "Support Kawaii Keeper",
      });
      const line_item_promises: Stripe.Checkout.SessionCreateParams.LineItem[] =
        cart.forEach(async (item: any) => {
          const price = await stripe.prices.create({
            unit_amount: item.price * 100,
            currency: "usd",
            product: product.id,
            currency_options: {
              eur: { unit_amount: item.price * 92 },
              jpy: { unit_amount: item.price * 13000 },
              inr: { unit_amount: item.price * 8000 },
            },
          });
          return {
            price: price.id,
            quantity: item.quantity ?? 1,
          };
        });

      const line_items = await Promise.all(line_item_promises);
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/${req.body.currentUrl ?? ""}`,
        payment_intent_data: {
          metadata: {
            discordId: req.body.discordId,
          },
        },
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
