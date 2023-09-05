const express=require("express");
require("dotenv").config();
const stripe=require("stripe")(process.env.SECRET_KEY);

function paymentCont(){

const checkout_session=async (req,res)=>{
    try {
        let customers = await stripe.customers.create({
          email: "test@testgmail123.com",
          name: "Arjun Test4",
          phone: "+919876543210",
          shipping: {
            name: "Arjun Test4",
            address: {
              city: "Chennai",
              state: "Tamilnadu",
              country: "India",
            },
          },
          metadata: {
            customer_id: "Test89102020302390239isjijld",
          },
        });
    
        let session = await stripe.checkout.sessions.create({
          customer: customers.id, // Set the customer ID
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: req.body.items[0].name,
                },
                unit_amount: 2000,
              },
              quantity: req.body.items[0].quantity,
            },
          ],
          mode: "payment",
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
        });
    
        res.status(200).json({ url: session.url });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
      }
}

const checkout_subscription=async (request,response)=>{
  try {
      let customers = await stripe.customers.create({
        email: "test@testgmail123.com",
        name: "Arjun Test4",
        phone: "+919876543210",
        shipping: {
          name: "Arjun Test4",
          address: {
            city: "Chennai",
            state: "Tamilnadu",
            country: "India",
          },
        },
        metadata: {
          customer_id: "Test89102020302390239isjijld",
        },
      });
  
      let session = await stripe.checkout.sessions.create({
        customer: customers.id,
        payment_method_types: ["card"],
        line_items: [
          {
            price:"price_1NhDlDSDcZkcWgSRWpW9F90s",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
  
      response.status(200).json({ url: session.url });
    } catch (err) {
      console.log(err);
      response.status(500).json({ error: "Something went wrong" });
    }
}

const subscriptionDetails=async (request,response)=>{
  try{
    let subscription=await stripe.subscriptions.list({
      customer:"cus_OUD0xyTbbhPhLM"
    })

    response.status(200).json(subscription);
  }
  catch(err){
    console.log(err);
  }
}

const webhook=async (request,response)=>{
    try {
        const sig = request.headers["stripe-signature"];
        const endpointSecret = process.env.WEBHOOK_SECRET;
    
        // Verify the webhook event
        const event = stripe.webhooks.constructEvent(
          request.rawBody, // Use the raw body
          sig,
          endpointSecret
        );

        console.log(event);
    
        // Handle the event
        switch (event.type) {
          case "checkout.session.completed":
            console.log(event);
            console.log("next");
            const sessionId = event.data.object.id;
    
            const customerId = event.data.object.customer;
    
            // Fetch the customer to access metadata
            const customer = await stripe.customers.retrieve(customerId);
    
            console.log(customer)
            console.log(`Payment for session ${sessionId} has been completed.`);
            // Implement your logic, such as order fulfillment or sending a confirmation email
            break;
    
          // Handle other event types here if needed
    
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
    
        // Acknowledge receipt of the event
        response.send();
      } catch (err) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
      }
}

const getsubscriptions=async (request,response)=>{
  try{
    let subscriptions = await stripe.prices.list({
      apiKey:process.env.SECRET_KEY
    });

    response.send(subscriptions);
  }
  catch(err){
    console.log(err);
  }
}

return {checkout_session, webhook, getsubscriptions, checkout_subscription, subscriptionDetails};

}

module.exports=paymentCont;