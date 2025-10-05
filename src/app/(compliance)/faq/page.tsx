import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions",
  description:
    "Find answers to common questions about our products, shipping, returns, and customer service. Get help with your orders and account.",
  keywords:
    "FAQ, frequently asked questions, help, support, customer service, orders, shipping, returns",
};

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Orders & Payment",
      icon: "💳",
      questions: [
        {
          question: "How do I place an order?",
          answer:
            "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information. Orders are confirmed immediately upon successful payment.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for international orders. All payments are processed securely through encrypted connections.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, we use industry-standard SSL encryption and PCI DSS compliant payment processors. We never store your full credit card information on our servers.",
        },
        {
          question: "Can I modify or cancel my order?",
          answer:
            "Orders can be modified or cancelled within 1 hour of placement. Contact us immediately with your order number. Once processing begins, we may not be able to make changes.",
        },
        {
          question: "Do you offer gift cards?",
          answer:
            "Yes, we offer digital gift cards in various denominations. Gift cards are delivered via email and can be redeemed at checkout. They never expire.",
        },
      ],
    },
    {
      title: "Shipping & Delivery",
      icon: "🚚",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 5-7 business days, Express 2-3 days, and Overnight 1-2 days. International shipping typically takes 7-14 business days. You'll receive tracking information once your order ships.",
        },
        {
          question: "Do you offer free shipping?",
          answer:
            "Yes! We offer free standard shipping on all orders over $50. Express and overnight shipping have additional fees. Free shipping applies to U.S. addresses only.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Absolutely! You'll receive a tracking number via email once your order ships. You can also track your order through your account dashboard or by contacting customer service.",
        },
        {
          question: "What if my package is delayed?",
          answer:
            "Shipping times are estimates. If your order is significantly delayed, contact us with your order number. We'll investigate and may offer expedited shipping or a refund if appropriate.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to many countries worldwide. International shipping rates and delivery times vary by destination. Additional customs duties may apply.",
        },
      ],
    },
    {
      title: "Returns & Refunds",
      icon: "↩️",
      questions: [
        {
          question: "What's your return policy?",
          answer:
            "We offer a 30-day return policy for most items. Items must be unused, in original packaging with tags attached. Return shipping costs may apply unless the item is defective.",
        },
        {
          question: "How do I return an item?",
          answer:
            "Contact our customer service team to get a return authorization number (RAN). Package the item securely and ship it to the provided address. Include the RAN on the package.",
        },
        {
          question: "When will I receive my refund?",
          answer:
            "Refunds are processed within 5-7 business days after we receive your return. The time for the funds to appear in your account depends on your bank or payment method.",
        },
        {
          question: "Can I exchange an item?",
          answer:
            "Yes, exchanges are available for different sizes, colors, or items of equal or lesser value. If exchanging for a more expensive item, you'll pay the difference.",
        },
        {
          question: "What items cannot be returned?",
          answer:
            "Custom or personalized items, perishable goods, opened software/digital products, and items marked as 'final sale' cannot be returned unless defective.",
        },
      ],
    },
    {
      title: "Products & Quality",
      icon: "⭐",
      questions: [
        {
          question: "Are your products authentic?",
          answer:
            "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers. We provide certificates of authenticity for high-value items.",
        },
        {
          question: "Do you offer warranties?",
          answer:
            "Most products come with manufacturer warranties. Check the product description for specific warranty information. We also offer our own satisfaction guarantee.",
        },
        {
          question: "Are products in stock?",
          answer:
            "Our website shows real-time inventory. If an item is out of stock, you can sign up for notifications or contact us about similar alternatives.",
        },
        {
          question: "Can I customize products?",
          answer:
            "Some products offer customization options. Check the product page for available customizations. Custom orders may have extended delivery times.",
        },
        {
          question: "Do you test products for quality?",
          answer:
            "Yes, all products undergo quality control checks before shipping. We also welcome customer feedback and continuously improve our product selection.",
        },
      ],
    },
    {
      title: "Account & Support",
      icon: "👤",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click 'Sign Up' in the top navigation. Provide your email and create a password. You'll receive a confirmation email to activate your account.",
        },
        {
          question: "I forgot my password. What should I do?",
          answer:
            "Click 'Forgot Password' on the login page. Enter your email address, and we'll send you a secure link to reset your password.",
        },
        {
          question: "How do I update my account information?",
          answer:
            "Log in to your account, go to 'Account Settings', and update your information. Changes are saved automatically.",
        },
        {
          question: "Can I save multiple addresses?",
          answer:
            "Yes, you can save multiple shipping and billing addresses in your account for faster checkout on future orders.",
        },
        {
          question: "How do I contact customer service?",
          answer:
            "You can reach us via email at support@yourcompany.com, phone at +1 (234) 567-8900, or through our contact form. We respond within 24 hours.",
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: "🔒",
      questions: [
        {
          question: "How do you protect my data?",
          answer:
            "We use SSL encryption, secure servers, and follow GDPR guidelines. Your personal information is never sold to third parties.",
        },
        {
          question: "What information do you collect?",
          answer:
            "We collect information you provide (name, email, address) and automatically collected data (IP address, browsing behavior) to improve our services.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes, you can request account deletion at any time. Contact our privacy team, and we'll remove your personal data within 30 days.",
        },
        {
          question: "Do you use cookies?",
          answer:
            "Yes, we use essential cookies for functionality and optional analytics cookies. You can manage your cookie preferences in your browser settings.",
        },
        {
          question: "Is my personal information shared?",
          answer:
            "We only share information with trusted partners for shipping and payment processing. We never sell your data to marketers.",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Find quick answers to common questions about our products and
          services.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="border-b border-neutral-200 p-6 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </h2>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {category.questions.map((faq, faqIndex) => (
                <details key={faqIndex} className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {faq.question}
                    </span>
                    <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help Section */}
      <div className="mt-12 rounded-lg border border-neutral-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center dark:border-neutral-700 dark:from-blue-900/20 dark:to-indigo-900/20">
        <HelpCircle className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Still Need Help?
        </h2>
        <p className="mb-6 text-neutral-700 dark:text-neutral-300">
          Can't find what you're looking for? Our customer service team is here
          to help with any questions or concerns.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Email
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              support@yourcompany.com
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              24h response
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Phone
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              +1 (234) 567-8900
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Mon-Fri 9AM-6PM
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Live Chat
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Available now
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Business hours
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Contact Form
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Get in touch
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Detailed inquiries
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Contact Us
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-3 text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="mt-12">
        <h2 className="mb-6 text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Popular Topics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/shipping"
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Shipping Info
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Delivery times, costs, and tracking
            </p>
          </Link>

          <Link
            href="/returns-policy"
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Returns & Refunds
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Easy returns and money back guarantee
            </p>
          </Link>

          <Link
            href="/privacy-policy"
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Privacy Policy
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              How we protect your data
            </p>
          </Link>

          <Link
            href="/about"
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              About Us
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Our story and mission
            </p>
          </Link>

          <Link
            href="/terms-conditions"
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Terms & Conditions
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Service terms and user agreement
            </p>
          </Link>

          <Link
            href="/cookies-policy"
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Cookies Policy
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Cookie usage and preferences
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
