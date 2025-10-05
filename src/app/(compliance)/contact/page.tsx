import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description:
    "Get in touch with our customer service team. Find contact information, business hours, and send us a message.",
  keywords:
    "contact us, customer service, support, help, email, phone, address",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Contact Us
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          We're here to help! Get in touch with our team for any questions or
          support you need.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Get in Touch
            </h2>
            <p className="mb-6 text-neutral-700 dark:text-neutral-300">
              Have a question about our products, need help with an order, or
              want to provide feedback? We'd love to hear from you. Choose the
              contact method that works best for you.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Email Support
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Get help via email
                </p>
                <a
                  href="mailto:support@yourcompany.com"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  support@yourcompany.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Phone Support
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Speak directly with our team
                </p>
                <a
                  href="tel:+1234567890"
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  +1 (234) 567-8900
                </a>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Mon-Fri: 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Visit Us
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Our physical address
                </p>
                <address className="not-italic text-neutral-700 dark:text-neutral-300">
                  123 Business Street
                  <br />
                  Suite 456
                  <br />
                  City, State 12345
                  <br />
                  Country
                </address>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Business Hours
                </h3>
                <div className="text-neutral-700 dark:text-neutral-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Live Chat
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Chat with us online
                </p>
                <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 underline">
                  Start Live Chat
                </button>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Available during business hours
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
              Response Times
            </h3>
            <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <p>
                <strong>Email:</strong> Within 24 hours
              </p>
              <p>
                <strong>Phone:</strong> Immediate (during business hours)
              </p>
              <p>
                <strong>Live Chat:</strong> Immediate (during business hours)
              </p>
              <p>
                <strong>Mail:</strong> 3-5 business days
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Send us a Message
            </h2>
            <p className="mb-6 text-neutral-700 dark:text-neutral-300">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="+1 (234) 567-8900"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              >
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="product">Product Information</option>
                <option value="returns">Returns & Refunds</option>
                <option value="shipping">Shipping Information</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="orderNumber"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Order Number (if applicable)
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="ORD-123456"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="Please describe your inquiry in detail..."
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                name="privacy"
                required
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:ring-blue-400"
              />
              <label
                htmlFor="privacy"
                className="text-sm text-neutral-700 dark:text-neutral-300"
              >
                I agree to the processing of my personal data according to the{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                >
                  Privacy Policy
                </Link>{" "}
                and consent to receive responses to my inquiry. *
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-neutral-900 px-4 py-3 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Send Message
            </button>
          </form>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Privacy Notice:</strong> We only use the information you
              provide to respond to your inquiry and improve our services. See
              our{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-blue-600 dark:hover:text-blue-300"
              >
                Privacy Policy
              </Link>{" "}
              for more details.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
              How long does it take to receive a response?
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              We typically respond to emails within 24 hours during business
              days. Phone calls are answered immediately during business hours.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
              Do you offer international support?
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Yes, we provide support in multiple languages and can assist
              customers worldwide through email and our website.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
              Can I track my order?
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Yes, you'll receive a tracking number via email once your order
              ships. You can also check your order status in your account.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
              How do I return an item?
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Please review our{" "}
              <Link
                href="/returns-policy"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Returns Policy
              </Link>{" "}
              for detailed instructions on how to return items.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center rounded-md bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            View All FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
