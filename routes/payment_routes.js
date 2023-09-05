const express=require("express");
const paymentCont=require("../controllers/payments");

const router=express.Router();

router.post("/create-payment-intent",paymentCont().checkout_session)
router.post("/webhooks",paymentCont().webhook);
router.get("/getsubscriptions",paymentCont().getsubscriptions)
router.post("/create-payment-subscription",paymentCont().checkout_subscription)
router.get("/subscriptionDetails",paymentCont().subscriptionDetails)

module.exports=router;