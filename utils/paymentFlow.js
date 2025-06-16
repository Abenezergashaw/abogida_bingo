// utils/paymentFlow.js

const API_KEY = "11ec7a6c-20ef-48ff-b264-660a0ce27650";
const BASE_URL = "https://api.addispay.et/checkout-api/v1";

// Utility
function generateNonce() {
  return "nodePay" + Date.now();
}

async function startPaymentFlow({ phone_number, total_amount, merchant_name }) {
  const now = Date.now();
  const nonce = "nodePay" + now;
  const tx_ref = "nodePay" + now;

  console.log("Payment started:", phone_number);

  const payload = {
    data: {
      redirect_url: "https://addispay.et/",
      cancel_url: "",
      success_url: "",
      error_url: "",
      order_reason: "Node.js Integration Test",
      currency: "ETB",
      email: "test@gmail.com",
      first_name: "Abenezer",
      last_name: "Gashaw",
      nonce,
      order_detail: {
        amount: total_amount,
        description: "test payment",
      },
      phone_number,
      session_expired: "5000",
      total_amount,
      tx_ref,
    },
    message: "creating order from node server",
  };

  // 1. Create order
  const sessionRes = await fetch(`${BASE_URL}/create-order`, {
    method: "POST",
    headers: {
      Auth: `${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const sessionData = await sessionRes.json();
  if (!sessionRes.ok) throw new Error("Session creation failed");

  // 2. Initiate payment
  const paymentPayload = {
    uuid: sessionData.uuid,
    phone_number,
    encrypted_total_amount: total_amount.toString(),
    merchant_name,
    selected_service: "ussd",
    selected_bank: "telebirr",
  };

  const paymentRes = await fetch(`${BASE_URL}/payment/initiate-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Auth: `${API_KEY}`,
    },
    body: JSON.stringify(paymentPayload),
  });

  const paymentData = await paymentRes.json();
  if (!paymentRes.ok) throw new Error("Payment initiation failed");

  // 3. Check status
  const statusRes = await fetch(
    `${BASE_URL}/get-status?uuid=${sessionData.uuid}`,
    {
      headers: {
        Auth: `${API_KEY}`,
      },
    }
  );

  const statusData = await statusRes.json();
  if (!statusRes.ok) throw new Error("Status check failed");

  return {
    message: "Full payment flow completed",
    uuid: sessionData.uuid,
    checkout_url: sessionData.checkout_url + "/" + sessionData.uuid,
    payment_initiated: paymentData,
    payment_status: statusData,
  };
}

module.exports = startPaymentFlow;
