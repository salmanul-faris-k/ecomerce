import React from "react";
import Ourspace from "../../components/shopingview/Ourspace";

export default function FAQ() {
  const faqs = [
    {
      question: "Who are you?",
      answer:
      "At GRAZIE, we are a homegrown clothing store based in Kochi, dedicated to celebrating Indian textiles through elegant Kurtas, timeless Sarees, stylish Blouses, and quality Running Materials.Rooted in tradition and designed for modern living, we offer thoughtfully curated fashion that blends comfort, craftsmanship, and everyday beauty."
    },
   
    {
      question: "Do you retail through physical stores?",
      answer: (
        <>
          <p>Yes, visit us at:</p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>Elamakkara -Kochi-682026</li>
            
          </ul>
        </>
      ),
    },
    
    {
      question: "How soon will my order reach me?",
      answer:
        "Our made-to-order pieces take 10–14 working days to create. Add 3–4 days for domestic shipping, 5–6 days for international.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-16 text-gray-900 font-sans mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
        FAQ
      </h2>

      <div className="space-y-12">
        {faqs.map((faq, i) => (
          <div key={i}>
            <h3 className="text-md sm:text-md font-semibold mb-3">{faq.question}</h3>
            <div className="text-sm sm:text-sm leading-relaxed text-gray-700">{faq.answer}</div>
          </div>
        ))}
      </div>
      <Ourspace/>
    </div>
  );
}
