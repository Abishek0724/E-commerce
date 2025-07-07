package com.guvi.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.guvi.backend.dto.PaymentVerificationRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.security.RazorpayConfig;
import com.guvi.backend.service.interf.OrderItemService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderItemService orderItemService;
    private final RazorpayConfig razorpayConfig;

    // ✅ 1. Razorpay Order Creation API
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam double amount) {
        try {
            System.out.println("Key: " + razorpayConfig.getKey());
            System.out.println("Secret: " + razorpayConfig.getSecret());

            RazorpayClient razorpay = new RazorpayClient(razorpayConfig.getKey(), razorpayConfig.getSecret());

            JSONObject options = new JSONObject();
            options.put("amount", (int) (amount * 100));
            options.put("currency", "INR");
            options.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 30));

            Order order = razorpay.orders.create(options);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("key", razorpayConfig.getKey());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // LOG TO CONSOLE
            return ResponseEntity.status(500).body("Razorpay order creation failed: " + e.getMessage());
        }
    }

    // ✅ 2. Razorpay Payment Verification API
    @PostMapping("/verify")
    public ResponseEntity<Response> verifyPayment(@RequestBody PaymentVerificationRequest request) throws Exception {
        String secret = razorpayConfig.getSecret();

        String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String generatedSignature = hmacSHA256(data, secret);

        // ✅ Correct usage of variable: request
        System.out.println("Order ID: " + request.getOrderId());
        System.out.println("Razorpay Order ID: " + request.getRazorpayOrderId());
        System.out.println("Payment ID: " + request.getRazorpayPaymentId());
        System.out.println("Signature: " + request.getRazorpaySignature());
        System.out.println("Generated Signature: " + generatedSignature);
        System.out.println("Received Signature: " + request.getRazorpaySignature());

        if (generatedSignature.equals(request.getRazorpaySignature())) {
            return ResponseEntity.ok(orderItemService.updateOrderStatusAfterPayment(request.getOrderId()));
        } else {
            return ResponseEntity.badRequest()
                    .body(Response.builder().status(400).message("Invalid signature").build());
        }
    }

    private String hmacSHA256(String data, String secret) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes("UTF-8"));

        // Convert the hash to hex (Razorpay expects hex signature)
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1)
                hexString.append('0');
            hexString.append(hex);
        }

        return hexString.toString();
    }

}
