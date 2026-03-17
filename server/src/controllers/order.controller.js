import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import Stripe from "stripe";
import transporter from "../config/nodemailer.js";

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place order
const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, amount, address } = req.body;

    if (!product || product.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const order = await Order.create({
      user: userId,
      product, // already contains quantity + custom fields
      amount,
      address,
      paymentMethod: "COD",
    });

    const productData = await Product.find({
      _id: { $in: product.map((item) => item.productId) },
    });

const productRows = productData
  .map((item) => {
    const matchedProduct = product.find(
      (p) => p.productId.toString() === item._id.toString(),
    );

    return `
<tr>
<td colspan="2" style="padding: 15px; border-top: 1px solid #eeeeee">
<table width="100%">
<tr>
<td style="color: #111111; font-weight: bold">
${item.title}
</td>

<td align="right">Rs.${item.price}</td>
</tr>

<tr>
<td style="color: #666666; font-size: 13px">
Quantity: ${matchedProduct?.quantity || 0} 
</td>

<td
align="right"
style="
color: #999999;
font-size: 13px;
text-decoration: line-through;
"
>
MRP Rs.${item.mrp}
</td>
</tr>
</table>
</td>
</tr>
`;
  })
  .join("");
    // Clear cart
    await User.findByIdAndUpdate(userId, {
      $set: { cart: [] },
    });

    transporter.sendMail({
      from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Order Confirmation",
      html: `<body
  style="
    margin: 0;
    padding: 0;
    background: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background: #f4f6f8; padding: 20px 0"
  >
    <tr>
      <td align="center">
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            max-width: 600px;
          "
        >
          <!-- Header -->
          <tr>
            <td
              style="
                background: linear-gradient(135deg, #2563eb, #1e40af);
                padding: 30px;
                text-align: center;
              "
            >
              <a href="https://giftnest.vercel.app/">
                <img
                  src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
                  width="120"
                  alt="GiftNest Logo"
                  style="display: block; margin: auto; margin-bottom: 10px"
                />
              </a>

              <div
                style="
                  color: #ffffff;
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 0.5px;
                "
              >
                GiftNest
              </div>

              <div style="color: #e0e7ff; font-size: 13px; margin-top: 6px">
                Premium Gifts Delivered With Love 🎁
              </div>
            </td>
          </tr>

          <!-- Greeting -->

          <tr>
            <td
              style="
                padding: 30px;
                color: #333333;
                font-size: 15px;
                line-height: 1.6;
              "
            >
              <h2 style="margin-top: 0; color: #111111">Order Invoice</h2>

              <p>Hello <strong>${user.name}</strong>,</p>

              <p>
                Thank you for shopping with <strong>GiftNest</strong>. Your
                order has been placed successfully. Below are the details of
                your purchase.
              </p>

              <p style="margin-top: 20px">
                <strong>Order ID:</strong> ${order._id} <br />
                <strong>Order Date:</strong>
                ${new Date(order.createdAt).toLocaleString()} <br />
                <strong>Payment Method:</strong> ${order.paymentMethod}
              </p>
              
            </td>
          </tr>

          <!-- Order Summary -->

          <tr>
            <td style="padding: 0 30px 30px 30px">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border: 1px solid #eeeeee;
                  border-radius: 6px;
                  overflow: hidden;
                "
              >
                <tr style="background: #fafafa">
                  <td
                    style="padding: 15px; font-size: 16px; font-weight: bold"
                  >
                    Order Summary
                  </td>
                  <td
                    align="right"
                    style="padding: 15px; font-size: 16px; font-weight: bold"
                  >
                    Total: Rs.${amount}
                  </td>
                </tr>

                ${productRows}

                <tr>
                  <td
                    colspan="2"
                    style="padding: 15px; border-top: 1px solid #eeeeee"
                  >
                    <table width="100%" style="font-size: 14px">
                      <tr>
                        <td>Subtotal</td>
                        <td align="right">Rs.${amount}</td>
                      </tr>

                      <tr>
                        <td>Shipping</td>
                        <td align="right">
                          Rs.${amount >= 500 ? "0 (FREE)" : "50"}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding-top: 10px; font-weight: bold">
                          Total
                        </td>
                        <td
                          align="right"
                          style="padding-top: 10px; font-weight: bold"
                        >
                          Rs.${amount}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #888; margin-top: 10px">
                *Final amount may vary if order details are modified.
              </p>
            </td>
          </tr>

          <!-- Delivery Address -->

          <tr>
  <td style="padding: 0 30px 30px 30px">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="border: 1px solid #eeeeee; border-radius: 6px"
    >
      <tr style="background: #fafafa">
        <td style="padding: 15px; font-weight: bold">
          Delivery Address
        </td>

        <td align="right" style="padding: 15px; font-weight: bold">
          ${address.city}
        </td>
      </tr>

      <tr>
        <td
          colspan="2"
          style="
            padding: 15px;
            font-size: 14px;
            color: #555555;
            line-height: 1.6;
          "
        >
          <strong>${address.firstName} ${address.lastName}</strong><br/>

          ${address.street} <br/>

          ${address.city}, ${address.state} - ${address.zipcode} <br/>

          ${address.country} <br/><br/>

          Phone: ${address.phone} <br/>

          Email: ${address.email}
        </td>
      </tr>
    </table>
  </td>
</tr>

          <!-- CTA Button -->

          <tr>
            <td align="center" style="padding: 10px 30px 35px 30px">
              <a
                href="${process.env.BASE_URL}/invoice/${order._id}"
                style="
                  background: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 28px;
                  border-radius: 4px;
                  font-size: 15px;
                  font-weight: bold;
                  display: inline-block;
                "
              >
                Download Invoice (PDF)
              </a>
            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              style="background: #f8fafc; padding: 30px; text-align: center"
            >
              <div
                style="
                  font-size: 16px;
                  font-weight: bold;
                  color: #1f2937;
                  margin-bottom: 8px;
                "
              >
                GiftNest
              </div>

              <div
                style="
                  font-size: 13px;
                  color: #6b7280;
                  line-height: 1.6;
                  margin-bottom: 18px;
                "
              >
                Bringing smiles with thoughtful gifts.<br />
                Thank you for shopping with us.
              </div>

              <div
                style="font-size: 13px; color: #6b7280; margin-bottom: 20px"
              >
                Need help? Contact us anytime.<br />
                support@giftnest.com
              </div>

              <div style="font-size: 12px; color: #9ca3af; line-height: 1.6">
                This is an automated email from
                <strong>GiftNest</strong>.<br />
                Please do not reply to this message.

                <br /><br />

                © 2026 GiftNest. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// placing order using STRIPE
const placeOrderUsingStripe = asyncHandler(async (req, res) => {
  const { product, address } = req.body;
  const userId = req.user._id;
  const { origin } = req.headers;

  if (!product || product.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No products provided",
    });
  }

  let orderAmount = 0;
  const line_items = [];
  const cleanProducts = [];

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }


  //  Fetch all products in one query
  const productIds = product.map((item) => item.productId);
  const productsFromDB = await Product.find({
    _id: { $in: productIds },
  });

  for (const item of product) {
    const productData = productsFromDB.find(
      (p) => p._id.toString() === item.productId,
    );

    if (!productData || item.quantity <= 0) continue;

    const itemTotal = productData.price * item.quantity;
    orderAmount += itemTotal;

    cleanProducts.push({
      productId: productData._id,
      quantity: item.quantity,
      customeText: item.customeText || "",
      customeImage: item.customeImage || "",
    });

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: productData.title,
        },
        unit_amount: productData.price * 100,
      },
      quantity: item.quantity,
    });
  }

  if (cleanProducts.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid products found",
    });
  }

  const deliveryCharges = orderAmount > 500 ? 0 : 99;
  const totalAmount = orderAmount + deliveryCharges;

  if (deliveryCharges > 0) {
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });
  }

  const order = await Order.create({
    user: userId,
    product: cleanProducts,
    amount: totalAmount,
    address,
    isPaid: false,
    paymentMethod: "STRIPE",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    metadata: {
      orderId: order._id.toString(),
      userId: userId.toString(),
    },
    success_url: `${origin}/verify?success=true&orderId=${order._id}`,
    cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
  });

  if (!session) {
    return res.status(500).json({
      success: false,
    });
  }
  const productData = await Product.find({
    _id: { $in: product.map((item) => item.productId) },
  });

  const productRows = productData
    .map((item) => {
      const matchedProduct = product.find(
        (p) => p.productId.toString() === item._id.toString(),
      );

      return `
<tr>
<td colspan="2" style="padding: 15px; border-top: 1px solid #eeeeee">
<table width="100%">
<tr>
<td style="color: #111111; font-weight: bold">
${item.title}
</td>

<td align="right">Rs.${item.price}</td>
</tr>

<tr>
<td style="color: #666666; font-size: 13px">
Quantity: ${matchedProduct?.quantity || 0} 
</td>

<td
align="right"
style="
color: #999999;
font-size: 13px;
text-decoration: line-through;
"
>
MRP Rs.${item.mrp}
</td>
</tr>
</table>
</td>
</tr>
`;
    })
    .join("");
  // Clear cart

  transporter.sendMail({
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order Confirmation",
    html: `<body
  style="
    margin: 0;
    padding: 0;
    background: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background: #f4f6f8; padding: 20px 0"
  >
    <tr>
      <td align="center">
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            max-width: 600px;
          "
        >
          <!-- Header -->
          <tr>
            <td
              style="
                background: linear-gradient(135deg, #2563eb, #1e40af);
                padding: 30px;
                text-align: center;
              "
            >
              <a href="https://giftnest.vercel.app/">
                <img
                  src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
                  width="120"
                  alt="GiftNest Logo"
                  style="display: block; margin: auto; margin-bottom: 10px"
                />
              </a>

              <div
                style="
                  color: #ffffff;
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 0.5px;
                "
              >
                GiftNest
              </div>

              <div style="color: #e0e7ff; font-size: 13px; margin-top: 6px">
                Premium Gifts Delivered With Love 🎁
              </div>
            </td>
          </tr>

          <!-- Greeting -->

          <tr>
            <td
              style="
                padding: 30px;
                color: #333333;
                font-size: 15px;
                line-height: 1.6;
              "
            >
              <h2 style="margin-top: 0; color: #111111">Order Invoice</h2>

              <p>Hello <strong>${user.name}</strong>,</p>

              <p>
                Thank you for shopping with <strong>GiftNest</strong>. Your
                order has been placed successfully. Below are the details of
                your purchase.
              </p>

              <p style="margin-top: 20px">
                <strong>Order ID:</strong> ${order._id} <br />
                <strong>Order Date:</strong>
                ${new Date(order.createdAt).toLocaleString()} <br />
                <strong>Payment Method:</strong> ${order.paymentMethod}
              </p>
              
            </td>
          </tr>

          <!-- Order Summary -->

          <tr>
            <td style="padding: 0 30px 30px 30px">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border: 1px solid #eeeeee;
                  border-radius: 6px;
                  overflow: hidden;
                "
              >
                <tr style="background: #fafafa">
                  <td
                    style="padding: 15px; font-size: 16px; font-weight: bold"
                  >
                    Order Summary
                  </td>
                  <td
                    align="right"
                    style="padding: 15px; font-size: 16px; font-weight: bold"
                  >
                    Total: Rs.${amount}
                  </td>
                </tr>

                ${productRows}

                <tr>
                  <td
                    colspan="2"
                    style="padding: 15px; border-top: 1px solid #eeeeee"
                  >
                    <table width="100%" style="font-size: 14px">
                      <tr>
                        <td>Subtotal</td>
                        <td align="right">Rs.${amount}</td>
                      </tr>

                      <tr>
                        <td>Shipping</td>
                        <td align="right">
                          Rs.${amount >= 500 ? "0 (FREE)" : "50"}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding-top: 10px; font-weight: bold">
                          Total
                        </td>
                        <td
                          align="right"
                          style="padding-top: 10px; font-weight: bold"
                        >
                          Rs.${amount}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #888; margin-top: 10px">
                *Final amount may vary if order details are modified.
              </p>
            </td>
          </tr>

          <!-- Delivery Address -->

          <tr>
  <td style="padding: 0 30px 30px 30px">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="border: 1px solid #eeeeee; border-radius: 6px"
    >
      <tr style="background: #fafafa">
        <td style="padding: 15px; font-weight: bold">
          Delivery Address
        </td>

        <td align="right" style="padding: 15px; font-weight: bold">
          ${address.city}
        </td>
      </tr>

      <tr>
        <td
          colspan="2"
          style="
            padding: 15px;
            font-size: 14px;
            color: #555555;
            line-height: 1.6;
          "
        >
          <strong>${address.firstName} ${address.lastName}</strong><br/>

          ${address.street} <br/>

          ${address.city}, ${address.state} - ${address.zipcode} <br/>

          ${address.country} <br/><br/>

          Phone: ${address.phone} <br/>

          Email: ${address.email}
        </td>
      </tr>
    </table>
  </td>
</tr>

          <!-- CTA Button -->

          <tr>
            <td align="center" style="padding: 10px 30px 35px 30px">
              <a
                href="${process.env.BASE_URL}/invoice/${order._id}"
                style="
                  background: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 28px;
                  border-radius: 4px;
                  font-size: 15px;
                  font-weight: bold;
                  display: inline-block;
                "
              >
                Download Invoice (PDF)
              </a>
            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              style="background: #f8fafc; padding: 30px; text-align: center"
            >
              <div
                style="
                  font-size: 16px;
                  font-weight: bold;
                  color: #1f2937;
                  margin-bottom: 8px;
                "
              >
                GiftNest
              </div>

              <div
                style="
                  font-size: 13px;
                  color: #6b7280;
                  line-height: 1.6;
                  margin-bottom: 18px;
                "
              >
                Bringing smiles with thoughtful gifts.<br />
                Thank you for shopping with us.
              </div>

              <div
                style="font-size: 13px; color: #6b7280; margin-bottom: 20px"
              >
                Need help? Contact us anytime.<br />
                support@giftnest.com
              </div>

              <div style="font-size: 12px; color: #9ca3af; line-height: 1.6">
                This is an automated email from
                <strong>GiftNest</strong>.<br />
                Please do not reply to this message.

                <br /><br />

                © 2026 GiftNest. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`,
  });

  transporter.sendMail({
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: order.user.email,
    subject: "Order Confirmation",
    html: `<body
    style="
      margin: 0;
      padding: 0;
      background: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background: #f4f6f8; padding: 20px 0"
    >
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              max-width: 600px;
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background: linear-gradient(135deg, #2563eb, #1e40af);
                  padding: 30px;
                  text-align: center;
                "
              >
                 <a href="https://giftnest.vercel.app/">
                  <img
                    src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
                    width="120"
                    alt="GiftNest Logo"
                    style="display: block; margin: auto; margin-bottom: 10px"
                  />
                </a>

                <div
                  style="
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                  "
                >
                  GiftNest
                </div>

                <div style="color: #e0e7ff; font-size: 13px; margin-top: 6px">
                  Premium Gifts Delivered With Love 🎁
                </div>
              </td>
            </tr>

            <!-- Greeting -->

            <tr>
              <td
                style="
                  padding: 30px;
                  color: #333333;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                <h2 style="margin-top: 0; color: #111111">Order Invoice</h2>

                <p>Hello <strong>{{username}}</strong>,</p>

                <p>
                  Thank you for shopping with <strong>GiftNest</strong>. Your
                  order has been placed successfully. Below are the details of
                  your purchase.
                </p>

                <p style="margin-top: 20px">
                  <strong>Order ID:</strong> {{order_id}} <br />
                  <strong>Order Date:</strong> {{order_date}}
                </p>
              </td>
            </tr>

            <!-- Order Summary -->

            <tr>
              <td style="padding: 0 30px 30px 30px">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    border: 1px solid #eeeeee;
                    border-radius: 6px;
                    overflow: hidden;
                  "
                >
                  <tr style="background: #fafafa">
                    <td
                      style="padding: 15px; font-size: 16px; font-weight: bold"
                    >
                      Order Summary
                    </td>
                    <td
                      align="right"
                      style="padding: 15px; font-size: 16px; font-weight: bold"
                    >
                      Total: Rs.{{total_amount}}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colspan="2"
                      style="padding: 15px; border-top: 1px solid #eeeeee"
                    >
                      <table width="100%">
                        <tr>
                          <td style="color: #111111; font-weight: bold">
                            {{product_name}}
                          </td>

                          <td align="right">Rs.{{product_price}}</td>
                        </tr>

                        <tr>
                          <td style="color: #666666; font-size: 13px">
                            Quantity: {{quantity}} bottle
                          </td>

                          <td
                            align="right"
                            style="
                              color: #999999;
                              font-size: 13px;
                              text-decoration: line-through;
                            "
                          >
                            MRP Rs.{{mrp_price}}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      colspan="2"
                      style="padding: 15px; border-top: 1px solid #eeeeee"
                    >
                      <table width="100%" style="font-size: 14px">
                        <tr>
                          <td>Subtotal</td>
                          <td align="right">Rs.{{subtotal}}</td>
                        </tr>

                        <tr>
                          <td>Shipping</td>
                          <td align="right">Rs.{{shipping}}</td>
                        </tr>

                        <tr>
                          <td style="padding-top: 10px; font-weight: bold">
                            Total
                          </td>
                          <td
                            align="right"
                            style="padding-top: 10px; font-weight: bold"
                          >
                            Rs.{{total_amount}}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 12px; color: #888; margin-top: 10px">
                  *Final amount may vary if order details are modified.
                </p>
              </td>
            </tr>

            <!-- Delivery Address -->

            <tr>
              <td style="padding: 0 30px 30px 30px">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="border: 1px solid #eeeeee; border-radius: 6px"
                >
                  <tr style="background: #fafafa">
                    <td style="padding: 15px; font-weight: bold">
                      Delivery Address
                    </td>

                    <td align="right" style="padding: 15px; font-weight: bold">
                      {{city}}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colspan="2"
                      style="
                        padding: 15px;
                        font-size: 14px;
                        color: #555555;
                        line-height: 1.6;
                      "
                    >
                      <strong>{{customer_name}}</strong><br />

                      {{address_line1}} <br />
                      {{address_line2}} <br />
                      {{city}}, {{state}} - {{pincode}} <br /><br />

                      Phone: {{phone}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA Button -->

            <tr>
              <td align="center" style="padding: 10px 30px 35px 30px">
                <a
                  href="{{invoice_pdf_link}}"
                  style="
                    background: #2563eb;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 4px;
                    font-size: 15px;
                    font-weight: bold;
                    display: inline-block;
                  "
                >
                  Download Invoice (PDF)
                </a>
              </td>
            </tr>

            <!-- Divider -->

            <tr>
              <td style="border-top: 1px solid #eeeeee"></td>
            </tr>

            <!-- Footer Divider -->

            <tr>
              <td style="border-top: 1px solid #eeeeee"></td>
            </tr>

            <!-- Footer -->

            <tr>
              <td
                style="background: #f8fafc; padding: 30px; text-align: center"
              >
                <div
                  style="
                    font-size: 16px;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 8px;
                  "
                >
                  GiftNest
                </div>

                <div
                  style="
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.6;
                    margin-bottom: 18px;
                  "
                >
                  Bringing smiles with thoughtful gifts.<br />
                  Thank you for shopping with us.
                </div>

                <div
                  style="font-size: 13px; color: #6b7280; margin-bottom: 20px"
                >
                  Need help? Contact us anytime.<br />
                  support@giftnest.com
                </div>

                <!-- Divider -->

                <div
                  style="
                    border-top: 1px solid #e5e7eb;
                    margin: 20px auto;
                    width: 80%;
                  "
                ></div>

                <div style="font-size: 12px; color: #9ca3af; line-height: 1.6">
                  This is an automated email from
                  <strong>GiftNest</strong>.<br />
                  Please do not reply to this message.

                  <br /><br />

                  © 2026 GiftNest. All rights reserved.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`,
  });

  res.status(200).json({
    success: true,
    session_url: session.url,
  });
});

// get orders for logged in user
const getOrdersForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate({
      path: "product.productId",
      model: "Product",
      select: "title amount images price",
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    orders,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const orders = await Order.find()
      .populate("product.productId")
      .sort({ createdAt: -1 });

    const sellerOrders = orders
      .map((order) => {
        const sellerProducts = order.product.filter(
          (item) =>
            item.productId &&
            item.productId.seller.toString() === sellerId.toString(),
        );

        if (sellerProducts.length === 0) return null;

        return {
          ...order._doc,
          product: sellerProducts,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      totalOrders: sellerOrders.length,
      orders: sellerOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update order status from seller panel
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    // If delivered and COD → mark paid
    if (status === "Delivered" && order.paymentMethod === "COD") {
      order.isPaid = true;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get orders for admin
const getOrdersForAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "product.productId",
      populate: {
        path: "seller",
        model: "Seller",
        select: "store",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    orders,
  });
});

export {
  placeOrder,
  placeOrderUsingStripe,
  getOrdersForUser,
  getAllOrders,
  updateOrderStatus,
  getOrdersForAdmin,
};

uploadOnCloudinary();
