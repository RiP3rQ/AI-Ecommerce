import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Legal Agreement",
  description:
    "Read our terms and conditions for using our website and services. Understand your rights and responsibilities.",
  keywords:
    "terms conditions, legal agreement, terms of service, user agreement, website terms",
};

export default function TermsConditionsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Terms & Conditions
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Please read these terms and conditions carefully before using our
          website and services.
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
            1. Acceptance of Terms
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            By accessing and using {process.env.SITE_NAME || "our website"}{" "}
            ("we", "us", or "our"), you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to abide
            by the above, please do not use this service.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            These terms apply to all visitors, users, and others who access or
            use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Use License
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Permission is granted to temporarily download one copy of the
            materials on our website for personal, non-commercial transitory
            viewing only. This is the grant of a license, not a transfer of
            title, and under this license you may not:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Modify or copy the materials</li>
            <li>
              Use the materials for any commercial purpose or for any public
              display
            </li>
            <li>
              Attempt to decompile or reverse engineer any software contained on
              our website
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
          </ul>
          <p className="text-neutral-700 dark:text-neutral-300">
            This license shall automatically terminate if you violate any of
            these restrictions and may be terminated by us at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. User Accounts
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.1 Account Creation
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            To access certain features of our service, you may be required to
            create an account. You must provide accurate, complete, and current
            information during the registration process and keep your account
            information updated.
          </p>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.2 Account Security
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You are responsible for:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Safeguarding your password and account information</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>
              Ensuring you log out from your account at the end of each session
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.3 Account Termination
          </h3>
          <p className="text-neutral-700 dark:text-neutral-300">
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Products and Services
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            4.1 Product Information
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We strive to provide accurate product descriptions and pricing
            information. However, we do not warrant that product descriptions or
            other content on our website are accurate, complete, reliable,
            current, or error-free.
          </p>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            4.2 Pricing and Payment
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            All prices are subject to change without notice. Payment terms are
            as specified during the checkout process. We accept major credit
            cards and other payment methods as indicated on our website.
          </p>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            4.3 Order Acceptance
          </h3>
          <p className="text-neutral-700 dark:text-neutral-300">
            Your receipt of an electronic or other form of order confirmation
            does not signify our acceptance of your order. We reserve the right
            to refuse or cancel any order for any reason, including but not
            limited to product availability, errors in product information, or
            payment issues.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Shipping and Delivery
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Shipping and delivery terms are detailed in our{" "}
            <Link
              href="/shipping"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
            >
              Shipping Information
            </Link>{" "}
            page. Delivery times are estimates only and we are not liable for
            delays caused by factors beyond our control.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Returns and Refunds
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Our returns and refunds policy is detailed in our{" "}
            <Link
              href="/returns-policy"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
            >
              Returns Policy
            </Link>{" "}
            page. Please review this policy carefully before making a purchase.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            7. User Conduct
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You agree not to use our service:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              For any unlawful purpose or to solicit others to perform unlawful
              acts
            </li>
            <li>
              To violate any international, federal, provincial, or state
              regulations, rules, laws, or local ordinances
            </li>
            <li>
              To infringe upon or violate our intellectual property rights or
              the intellectual property rights of others
            </li>
            <li>
              To harass, abuse, insult, harm, defame, slander, disparage,
              intimidate, or discriminate
            </li>
            <li>To submit false or misleading information</li>
            <li>
              To upload or transmit viruses or any other type of malicious code
            </li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            <li>
              To interfere with or circumvent the security features of the
              service
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            8. Intellectual Property Rights
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            The service and its original content, features, and functionality
            are and will remain the exclusive property of{" "}
            {process.env.SITE_NAME || "our company"} and its licensors. The
            service is protected by copyright, trademark, and other laws.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            You may not duplicate, copy, or reuse any portion of the HTML/CSS,
            JavaScript, or visual design elements without express written
            permission from us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            9. Disclaimer
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            The information on this website is provided on an 'as is' basis. To
            the fullest extent permitted by law, we:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              Exclude all representations and warranties relating to this
              website and its contents
            </li>
            <li>
              Exclude all liability for damages arising out of or in connection
              with your use of this website
            </li>
            <li>
              Do not guarantee that the service will be uninterrupted or
              error-free
            </li>
            <li>
              Do not guarantee that the results that may be obtained from the
              use of the service will be accurate or reliable
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            10. Limitation of Liability
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            In no event shall {process.env.SITE_NAME || "our company"}, nor its
            directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>Your use or inability to use the service</li>
            <li>
              Any unauthorized access to or use of our servers and/or any
              personal information stored therein
            </li>
            <li>
              Any interruption or cessation of transmission to or from the
              service
            </li>
            <li>
              Any bugs, viruses, trojan horses, or the like that may be
              transmitted to or through our service
            </li>
            <li>
              Any errors or omissions in any content or for any loss or damage
              incurred as a result of the use of any content
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            11. Indemnification
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            You agree to defend, indemnify, and hold harmless{" "}
            {process.env.SITE_NAME || "our company"} and its licensee and
            licensors, and their employees, contractors, agents, officers and
            directors, from and against any and all claims, damages,
            obligations, losses, liabilities, costs or debt, and expenses
            (including but not limited to attorney's fees), resulting from or
            arising out of a) your use and access of the service, by you or any
            person using your account and password, or b) a breach of these
            Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            12. Termination
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            Upon termination, your right to use the service will cease
            immediately. If you wish to terminate your account, you may simply
            discontinue using the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            13. Governing Law
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            These Terms shall be interpreted and governed by the laws of [Your
            Country/State], without regard to its conflict of law provisions.
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            If any provision of these Terms is held to be invalid or
            unenforceable by a court, the remaining provisions of these Terms
            will remain in effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            14. Changes to Terms
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will try to
            provide at least 30 days notice prior to any new terms taking
            effect.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            What constitutes a material change will be determined at our sole
            discretion. By continuing to access or use our service after those
            revisions become effective, you agree to be bound by the revised
            terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            15. Contact Information
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you have any questions about these Terms & Conditions, please
            contact us:
          </p>
          <div className="rounded-lg bg-neutral-50 p-6 dark:bg-neutral-800">
            <p className="mb-2 text-neutral-700 dark:text-neutral-300">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:legal@yourcompany.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                legal@yourcompany.com
              </a>
            </p>
            <p className="mb-2 text-neutral-700 dark:text-neutral-300">
              <strong>Phone:</strong> [Your Phone Number]
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Address:</strong> [Your Company Address]
            </p>
          </div>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Important Notice
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            These terms and conditions were last updated on{" "}
            {new Date().toLocaleDateString("en-GB")}. By using our website, you
            acknowledge that you have read, understood, and agree to be bound by
            these terms.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
