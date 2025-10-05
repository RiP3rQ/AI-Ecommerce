import type { Metadata } from "next";
import Link from "next/link";
import {
  RotateCcw,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy",
  description:
    "Learn about our hassle-free returns and refunds policy. Easy returns within 30 days with free return shipping.",
  keywords:
    "returns policy, refunds, return shipping, 30 day returns, money back guarantee",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Returns & Refunds Policy
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          We're committed to your satisfaction. If you're not completely happy
          with your purchase, we'll make it right.
        </p>
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <RotateCcw className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            30-Day Returns
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Return any item within 30 days of delivery for a full refund.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <Truck className="mx-auto mb-4 h-12 w-12 text-green-600 dark:text-green-400" />
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Free Return Shipping
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            We cover the cost of return shipping for defective items.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <CreditCard className="mx-auto mb-4 h-12 w-12 text-purple-600 dark:text-purple-400" />
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Quick Refunds
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Refunds processed within 5-7 business days after receipt.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Return Eligibility
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            1.1 Time Frame
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You have <strong>30 calendar days</strong> from the date of delivery
            to initiate a return. For seasonal items or special promotions, the
            return window may be shorter and will be clearly stated at the time
            of purchase.
          </p>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            1.2 Condition Requirements
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Items must be returned in their original condition:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Unused and in original packaging</li>
            <li>All tags and labels attached</li>
            <li>Free from damage, stains, or wear</li>
            <li>Includes all original accessories and documentation</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            1.3 Non-Returnable Items
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            The following items cannot be returned:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Custom or personalized items</li>
            <li>Perishable goods or consumables</li>
            <li>Digital products or downloadable content</li>
            <li>Items marked as "final sale"</li>
            <li>Gift cards or vouchers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. How to Return an Item
          </h2>

          <div className="mb-6 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
              <Clock className="h-5 w-5" />
              Step-by-Step Process
            </h3>
            <ol className="ml-6 list-decimal space-y-2 text-blue-800 dark:text-blue-200">
              <li>
                Contact our customer service team within 30 days of delivery
              </li>
              <li>Receive a return authorization number (RAN)</li>
              <li>Package the item securely in its original packaging</li>
              <li>Include the RAN and order number on the package</li>
              <li>
                Ship the package using the provided return label (if applicable)
              </li>
              <li>Receive confirmation once we process your return</li>
            </ol>
          </div>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            2.1 Return Methods
          </h3>
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <h4 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
                Prepaid Return Label
              </h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                For defective items or our error, we provide a prepaid return
                shipping label.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <h4 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
                Customer Pays Return
              </h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                For change of mind returns, customers are responsible for return
                shipping costs.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Refund Process
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.1 Refund Timeline
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Once we receive and inspect your returned item:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Approval:</strong> 1-2 business days for inspection
            </li>
            <li>
              <strong>Processing:</strong> 3-5 business days for refund
              processing
            </li>
            <li>
              <strong>Bank Transfer:</strong> 2-5 business days (depending on
              your bank)
            </li>
            <li>
              <strong>Total Time:</strong> 5-14 business days from receipt
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.2 Refund Methods
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Refunds are processed using the original payment method:
          </p>
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Credit/Debit Cards
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Processed within 5-7 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  PayPal
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Processed within 1-3 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Bank Transfer
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Processed within 3-5 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="mt-1 h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Gift Cards
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Not eligible for cash refunds
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Exchanges
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We offer exchanges for the same item in a different size, color, or
            variant, subject to availability. Exchanges follow the same return
            process as refunds, but you won't be charged for the new item until
            the exchange is processed.
          </p>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-green-800 dark:text-green-200">
              <strong>Exchange Benefit:</strong> If exchanging for a more
              expensive item, you'll only pay the difference. For less expensive
              items, we'll refund the difference.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Damaged or Defective Items
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you receive a damaged or defective item, we're committed to
            making it right immediately. For damaged items received upon
            delivery:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              Contact us within 48 hours of delivery with photos of the damage
            </li>
            <li>We'll arrange free return shipping and send a replacement</li>
            <li>If the item is out of stock, you'll receive a full refund</li>
            <li>Processing time: 3-5 business days for replacements</li>
          </ul>
          <p className="text-neutral-700 dark:text-neutral-300">
            For items that become defective after use, our warranty policy
            applies (see product-specific warranty information).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Return Shipping Costs
          </h2>

          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Return Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Shipping Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Who Pays
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white dark:bg-neutral-900 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    Our Error
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Free
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    We pay
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    Damaged/Defective
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Free
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    We pay
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    Wrong Item Sent
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Free
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    We pay
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    Change of Mind
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Customer pays
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-600 dark:text-orange-400">
                    You pay
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            7. International Returns
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            For international orders, return policies may vary by country due to
            customs regulations and shipping restrictions. International
            customers are responsible for return shipping costs unless the
            return is due to our error or a defective item.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            Please contact our customer service team for country-specific return
            instructions and any applicable customs duties or taxes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            8. Contact Us for Returns
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Ready to start your return? We're here to help make the process as
            smooth as possible.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                Start Your Return
              </h3>
              <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                Contact our returns team to get started. Have your order number
                ready.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> returns@yourcompany.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (234) 567-8900
                </p>
                <p>
                  <strong>Hours:</strong> Mon-Fri 9AM-6PM EST
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                Return Address
              </h3>
              <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                Ship your return to this address. Include your Return
                Authorization Number.
              </p>
              <address className="not-italic text-sm text-neutral-600 dark:text-neutral-400">
                Returns Department
                <br />
                {process.env.SITE_NAME || "Your Company"}
                <br />
                123 Return Street
                <br />
                Warehouse City, ST 12345
                <br />
                United States
              </address>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            9. Important Notes
          </h2>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              This policy applies only to purchases made directly from our
              website
            </li>
            <li>
              Third-party marketplace purchases may have different return
              policies
            </li>
            <li>
              We reserve the right to refuse returns that don't meet our policy
              requirements
            </li>
            <li>Customs duties and taxes are non-refundable</li>
            <li>Promotional discounts may be adjusted for returns</li>
          </ul>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Need Help with a Return?
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Our customer service team is ready to assist you with any questions
            about returns or exchanges.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
