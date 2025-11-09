import type { Metadata } from "next";
import { Link } from "react-transition-progress/next";
import { Truck, Clock, MapPin, Package, Shield, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information | Delivery Times & Costs",
  description:
    "Learn about our shipping options, delivery times, and costs. Free shipping on orders over $50 with fast and reliable delivery.",
  keywords:
    "shipping info, delivery times, shipping costs, free shipping, tracking, international shipping",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Shipping Information
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Fast, reliable shipping with transparent pricing. Get your order
          delivered quickly and safely.
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
          <Truck className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Free Shipping
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            On orders over $50. Standard delivery included.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <Clock className="mx-auto mb-4 h-12 w-12 text-green-600 dark:text-green-400" />
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Fast Delivery
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Express options available. 1-2 day delivery in most areas.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <Shield className="mx-auto mb-4 h-12 w-12 text-purple-600 dark:text-purple-400" />
          <h3 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Secure Packaging
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Eco-friendly materials with full insurance coverage.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Shipping Options & Rates
          </h2>

          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Delivery Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Tracking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white dark:bg-neutral-900 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Standard Shipping
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    5-7 business days
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    $4.99 (Free over $50)
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    ✓ Included
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Express Shipping
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    2-3 business days
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    $9.99
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    ✓ Included
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Overnight
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    1-2 business days
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    $19.99
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    ✓ Included
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    International
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    7-14 business days
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    $15.99+
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    ✓ Included
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-green-800 dark:text-green-200">
              <strong>Free Shipping Promotion:</strong> Enjoy free standard
              shipping on all orders over $50. No promo code required!
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Order Processing Time
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Before your order ships, it goes through our quality control
            process:
          </p>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Order Confirmation
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Immediate
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Processing
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                1-2 business days
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Shipping
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                As selected
              </p>
            </div>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            <strong>Note:</strong> Processing times may be longer during peak
            seasons or holidays. We'll notify you if there are any delays.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Delivery Information
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.1 Delivery Areas
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We currently ship to the following regions:
          </p>
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-700 dark:text-neutral-300">
                United States (all 50 states)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-neutral-700 dark:text-neutral-300">
                Canada & Mexico
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-neutral-700 dark:text-neutral-300">
                European Union countries
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-neutral-700 dark:text-neutral-300">
                United Kingdom
              </span>
            </div>
          </div>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.2 Delivery Attempts
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Our delivery partners will make up to 3 attempts to deliver your
            package. If delivery fails after 3 attempts:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>The package will be held at the local delivery facility</li>
            <li>You'll receive a notice with pickup instructions</li>
            <li>Packages are held for 7-10 days before being returned</li>
            <li>Return shipping fees may apply for re-delivery</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.3 Signature Requirements
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            For high-value orders over $500, a signature may be required upon
            delivery. You can specify delivery preferences during checkout.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Tracking Your Order
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Once your order ships, you'll receive:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>A shipping confirmation email with tracking number</li>
            <li>SMS updates for key delivery milestones</li>
            <li>Real-time tracking through our website</li>
            <li>Direct links to carrier tracking pages</li>
          </ul>

          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
              How to Track Your Order
            </h3>
            <ol className="ml-6 list-decimal space-y-2 text-blue-800 dark:text-blue-200">
              <li>Log in to your account</li>
              <li>Go to "Order History"</li>
              <li>Click "Track Package" next to your order</li>
              <li>Or use the tracking number from your email</li>
            </ol>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. International Shipping
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            5.1 Customs & Duties
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            International orders may be subject to:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Import duties and taxes</li>
            <li>Customs clearance fees</li>
            <li>VAT or GST in applicable countries</li>
            <li>Local handling fees</li>
          </ul>
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> Customers are responsible for all
              customs duties and taxes. We recommend checking with local customs
              authorities for current rates.
            </p>
          </div>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            5.2 Restricted Items
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Some items may be restricted or prohibited in certain countries. We
            cannot ship:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Hazardous materials</li>
            <li>Certain electronics (depending on regulations)</li>
            <li>Items requiring special licenses</li>
            <li>Perishable goods for long-distance shipping</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Shipping Insurance
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            All orders are automatically insured against loss or damage during
            transit. Our insurance coverage includes:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Full replacement value for lost packages</li>
            <li>Repair or replacement for damaged items</li>
            <li>Coverage for shipping delays over 30 days</li>
            <li>Dedicated claims processing team</li>
          </ul>
          <p className="text-neutral-700 dark:text-neutral-300">
            If your package arrives damaged or goes missing, contact us
            immediately for assistance with filing an insurance claim.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            7. Shipping Delays
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            While we strive for on-time delivery, delays can occur due to:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Peak season volume (holidays, sales)</li>
            <li>Weather conditions</li>
            <li>Carrier capacity issues</li>
            <li>Customs clearance for international orders</li>
            <li>Address verification issues</li>
          </ul>
          <p className="text-neutral-700 dark:text-neutral-300">
            We'll keep you informed of any delays and work with our carriers to
            expedite delivery when possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            8. Special Shipping Services
          </h2>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                White Glove Service
              </h3>
              <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                Professional delivery and setup for large or fragile items.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Available for select items • Additional fee applies
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                Saturday Delivery
              </h3>
              <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                Weekend delivery for urgent orders.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Express service only • Additional fee applies
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                Gift Packaging
              </h3>
              <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                Premium gift wrapping and messaging.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Free with qualifying orders • Optional service
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                Store Pickup
              </h3>
              <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                Pick up your order at a local store.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Free service • Available at select locations
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            9. Shipping Address Changes
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Address changes are possible before the order ships:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              Contact us immediately if you need to change your shipping address
            </li>
            <li>Changes are not possible once the order has shipped</li>
            <li>Address corrections may incur additional shipping fees</li>
            <li>
              International address changes may not be possible due to customs
            </li>
          </ul>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Questions About Shipping?
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Our shipping team is here to help with any questions about delivery
            times, costs, or tracking.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Contact Shipping Support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Shipping FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
