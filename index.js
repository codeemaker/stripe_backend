const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const cors = require("cors");
const mongoose=require("mongoose");
const paymentRoute = require("./routes/payment_routes");

const app = express();

app.use(cors());
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/api/webhooks")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

async function connectDb(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/payment");
        console.log("Mongodb connected successfully");
    }
    catch(err){
        console.log(err);
    }
}

connectDb();

app.use("/api",paymentRoute);

// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     let customers = await stripe.customers.create({
//       email: "test@testgmail123.com",
//       name: "Arjun Test4",
//       phone: "+919876543210",
//       shipping: {
//         name: "Arjun Test4",
//         address: {
//           city: "Chennai",
//           state: "Tamilnadu",
//           country: "India",
//         },
//       },
//       metadata: {
//         customer_id: "Test89102020302390239isjijld",
//       },
//     });

//     let session = await stripe.checkout.sessions.create({
//       customer: customers.id, // Set the customer ID
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: req.body.items[0].name,
//             },
//             unit_amount: 2000,
//           },
//           quantity: req.body.items[0].quantity,
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     });

//     res.status(200).json({ url: session.url });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// app.post("/api/webhooks", async (request, response) => {
//   try {
//     const sig = request.headers["stripe-signature"];
//     const endpointSecret = process.env.WEBHOOK_SECRET;

//     // Verify the webhook event
//     const event = stripe.webhooks.constructEvent(
//       request.rawBody, // Use the raw body
//       sig,
//       endpointSecret
//     );

//     // Handle the event
//     switch (event.type) {
//       case "checkout.session.completed":
//         console.log(event);
//         console.log("next");
//         const sessionId = event.data.object.id;

//         const customerId = event.data.object.customer;

//         // Fetch the customer to access metadata
//         const customer = await stripe.customers.retrieve(customerId);

//         console.log(customer)
//         console.log(`Payment for session ${sessionId} has been completed.`);
//         // Implement your logic, such as order fulfillment or sending a confirmation email
//         break;

//       // Handle other event types here if needed

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // Acknowledge receipt of the event
//     response.send();
//   } catch (err) {
//     console.log(err);
//     response.status(400).send(`Webhook Error: ${err.message}`);
//   }
// });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
