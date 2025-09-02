import React from "react";
import Ourspace from "../../components/shopingview/Ourspace";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-black font-poppins text-xs leading-relaxed sm:text-sm sm:leading-relaxed mt-10">
      <h1 className="text-xl sm:text-2xl font-semibold mb-5 text-center uppercase tracking-wide">
        Privacy Policy
      </h1>

      <p className="mb-5">
        Welcome to <strong>Grazie</strong>, your destination for timeless women’s clothing — sarees,
        kurtas, running material, and blouses — handcrafted with care and rooted in tradition.
        We value your privacy and are committed to protecting the personal information you share with us.
      </p>

      <h2 className="text-base font-semibold mt-8 mb-2">Information We Collect</h2>
      <p className="mb-3">
        When you browse or shop with us, we collect basic information to enhance your shopping experience:
      </p>
      <ul className="list-disc list-inside mb-5 space-y-1">
        <li>Name, email, phone, and shipping address</li>
        <li>Order details and payment method</li>
        <li>IP address, browser type, device info</li>
        <li>Support or subscription communications</li>
      </ul>

      <p className="mb-5">
        All payments are securely processed by third-party gateways. We do not store card details.
      </p>

      <h2 className="text-base font-semibold mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-5 space-y-1">
        <li>To fulfill and ship your orders</li>
        <li>To communicate order updates</li>
        <li>To improve our services and experience</li>
        <li>To send offers if you opt in</li>
      </ul>

      <p className="mb-5">
        We do <strong>not</strong> sell or share your personal data for marketing.
      </p>

      <h2 className="text-base font-semibold mt-8 mb-2">Cookies</h2>
      <p className="mb-5">
        Cookies help us understand your preferences and improve your visit. You may disable them in browser settings.
      </p>

      <h2 className="text-base font-semibold mt-8 mb-2">Third-Party Services</h2>
      <p className="mb-5">
        We may share limited data with delivery services and payment processors — only for fulfilling your orders. These services use their own privacy safeguards.
      </p>

      <h2 className="text-base font-semibold mt-8 mb-2">Your Rights</h2>
      <ul className="list-disc list-inside mb-5 space-y-1">
        <li>Access or update your personal info</li>
        <li>Request data deletion (if legally allowed)</li>
        <li>Unsubscribe from marketing emails anytime</li>
      </ul>
      <p className="mb-5">
        Contact us for any data concerns: <strong>grazieconnect@gmail.com</strong>
      </p>

     <h2 className="text-base font-semibold mt-8 mb-2">Order, Refund & Exchange Policy</h2>
<ul className="list-disc list-inside mb-5 space-y-1">
  <li><strong>No cancellations</strong> are accepted once an order has been placed.</li>
  <li><strong>No refunds</strong> will be issued — please review all product details before purchasing.</li>
  <li><strong>Exchange is applicable only</strong> if the product is received in a damaged condition, 
      with an uncut <strong>courier box opening video</strong> provided as proof.</li>
</ul>

<p className="text-sm text-gray-600 italic">
  Note: Exchanges will be processed only after verification of the courier box opening video. 
  Claims without valid proof will not be accepted.
</p>

      <p className="mb-5">
        Need help with sizing or fabric details? Reach out before placing your order.
      </p>

      <h2 className="text-base font-semibold mt-8 mb-2">Contact Us</h2>
      <p>
        <strong>Grazie</strong><br />
        Elamakkara, Kochi – 682026, Kerala, India<br />
        📧 <strong>grazieconnect@gmail.com</strong>
      </p>
      <Ourspace/>
    </div>
  );
}
