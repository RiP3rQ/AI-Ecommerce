import type { Metadata } from "next";
import { Link } from "react-transition-progress/next";

export const metadata: Metadata = {
  title: "Privacy Policy | GDPR Compliant",
  description:
    "Our comprehensive privacy policy explaining how we collect, use, and protect your personal data in compliance with GDPR regulations.",
  keywords:
    "privacy policy, GDPR, data protection, personal data, cookies, EU privacy",
};

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Privacy Policy
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal data.
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

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Introduction
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            This Privacy Policy describes how{" "}
            {process.env.SITE_NAME || "our website"} ("we", "us", or "our")
            collects, uses, and protects your personal information when you use
            our website and services. We are committed to protecting your
            privacy and complying with the General Data Protection Regulation
            (GDPR) and other applicable data protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Information We Collect
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            2.1 Personal Information
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We may collect the following personal information:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Name and contact information (email, phone number, address)</li>
            <li>Account credentials (username, password)</li>
            <li>
              Payment information (processed securely through third-party
              providers)
            </li>
            <li>Order history and preferences</li>
            <li>Communication records with our customer service</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            2.2 Automatically Collected Information
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            When you visit our website, we automatically collect:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referral sources</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. How We Use Your Information
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We use your personal information for the following purposes:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Processing and fulfilling your orders</li>
            <li>Providing customer support</li>
            <li>Sending important service updates and notifications</li>
            <li>Improving our website and services</li>
            <li>Marketing communications (with your consent)</li>
            <li>Legal compliance and fraud prevention</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Legal Basis for Processing
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Under GDPR, we process your data based on the following legal
            grounds:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Contract:</strong> To fulfill orders and provide services
            </li>
            <li>
              <strong>Legitimate Interest:</strong> To improve our services and
              communicate with you
            </li>
            <li>
              <strong>Consent:</strong> For marketing communications and
              non-essential cookies
            </li>
            <li>
              <strong>Legal Obligation:</strong> To comply with applicable laws
              and regulations
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Data Sharing and Third Parties
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We may share your information with:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Service Providers:</strong> Payment processors, shipping
              companies, and IT service providers
            </li>
            <li>
              <strong>Legal Authorities:</strong> When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Business Partners:</strong> For joint marketing activities
              (with your consent)
            </li>
          </ul>
          <p className="text-neutral-700 dark:text-neutral-300">
            We never sell your personal data to third parties for marketing
            purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Data Retention
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We retain your personal data only as long as necessary for the
            purposes outlined in this policy:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              Customer account data: Until account deletion or 7 years after
              last activity
            </li>
            <li>Order information: 7 years for tax and accounting purposes</li>
            <li>
              Marketing data: Until consent withdrawal or account deletion
            </li>
            <li>
              Legal claims: As required by applicable statutes of limitations
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            7. Your Rights Under GDPR
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You have the following rights regarding your personal data:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Access:</strong> Request a copy of your personal data
            </li>
            <li>
              <strong>Rectification:</strong> Correct inaccurate or incomplete
              data
            </li>
            <li>
              <strong>Erasure:</strong> Request deletion of your data ("right to
              be forgotten")
            </li>
            <li>
              <strong>Restriction:</strong> Limit how we process your data
            </li>
            <li>
              <strong>Portability:</strong> Receive your data in a structured
              format
            </li>
            <li>
              <strong>Objection:</strong> Object to processing based on
              legitimate interests
            </li>
            <li>
              <strong>Withdrawal:</strong> Withdraw consent for processing
              activities
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            8. Cookies and Tracking
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We use cookies and similar technologies to enhance your browsing
            experience. For detailed information about our cookie usage, please
            see our{" "}
            <Link
              href="/cookies-policy"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
            >
              Cookies Policy
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            9. Data Security
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration,
            disclosure, or destruction. These measures include:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure data storage and access controls</li>
            <li>Regular security audits and updates</li>
            <li>Employee training on data protection</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            10. International Data Transfers
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Your data may be transferred to and processed in countries outside
            the European Economic Area (EEA). When this occurs, we ensure
            appropriate safeguards are in place, such as:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              Standard contractual clauses approved by the European Commission
            </li>
            <li>Adequacy decisions by the European Commission</li>
            <li>Your explicit consent for specific transfers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            11. Contact Us
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you have any questions about this Privacy Policy or wish to
            exercise your rights, please contact our Data Protection Officer:
          </p>
          <div className="rounded-lg bg-neutral-50 p-6 dark:bg-neutral-800">
            <p className="mb-2 text-neutral-700 dark:text-neutral-300">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:privacy@yourcompany.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                privacy@yourcompany.com
              </a>
            </p>
            <p className="mb-2 text-neutral-700 dark:text-neutral-300">
              <strong>Address:</strong> [Your Company Address]
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Phone:</strong> [Your Phone Number]
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            12. Complaints
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you believe we have not complied with your data protection
            rights, you have the right to lodge a complaint with a supervisory
            authority. In the EU, you can contact your local data protection
            authority.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            13. Changes to This Policy
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new policy on this page
            and updating the "Last updated" date. Your continued use of our
            services after such changes constitutes acceptance of the updated
            policy.
          </p>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Need Help?
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you have any questions about our privacy practices or need
            assistance with your data rights, please don't hesitate to contact
            us.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Contact Us
            </Link>
            <Link
              href="/cookies-policy"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
