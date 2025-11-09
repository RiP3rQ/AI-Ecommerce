import type { Metadata } from "next";
import { Link } from "react-transition-progress/next";

export const metadata: Metadata = {
  title: "Cookies Policy | GDPR Compliant",
  description:
    "Learn about how we use cookies and similar technologies to enhance your browsing experience while respecting your privacy rights.",
  keywords: "cookies policy, GDPR, privacy, tracking, consent, cookie settings",
};

export default function CookiesPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Cookies Policy
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          This policy explains how we use cookies and similar technologies to
          improve your experience on our website.
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
            1. What Are Cookies?
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Cookies are small text files that are stored on your device when you
            visit our website. They help us provide you with a better browsing
            experience by remembering your preferences and understanding how you
            use our site.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300">
            Similar technologies include web beacons, pixels, and local storage
            that serve similar purposes to cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. How We Use Cookies
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We use cookies for several purposes:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Essential Cookies:</strong> Required for the website to
              function properly
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors use our website
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences and
              settings
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant
              advertisements
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Types of Cookies We Use
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.1 Essential Cookies
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            These cookies are necessary for our website to function and cannot
            be disabled. They include:
          </p>
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Cookie Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white dark:bg-neutral-900 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    session_id
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Maintains user session
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Session
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    csrf_token
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Security protection
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Session
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    cart_items
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Shopping cart functionality
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    30 days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.2 Analytics Cookies
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            These cookies help us understand how visitors interact with our
            website:
          </p>
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Cookies
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white dark:bg-neutral-900 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    Google Analytics
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    _ga, _gid, _gat
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Website analytics
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            3.3 Functional Cookies
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            These cookies remember your preferences:
          </p>
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Cookie Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white dark:bg-neutral-900 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    theme_preference
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Remembers dark/light mode
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    1 year
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                    language
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Preferred language
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    1 year
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Third-Party Cookies
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Some cookies are set by third-party services that appear on our
            pages. We have no control over these cookies, and they are subject
            to the respective third party's privacy policy:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Payment Processors:</strong> For secure payment processing
            </li>
            <li>
              <strong>Social Media:</strong> For social sharing buttons
            </li>
            <li>
              <strong>Analytics Services:</strong> For website performance
              monitoring
            </li>
            <li>
              <strong>Customer Support:</strong> For live chat functionality
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Cookie Consent
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            When you first visit our website, you will see a cookie banner
            asking for your consent to use non-essential cookies. You can:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Accept All:</strong> Allow all cookies
            </li>
            <li>
              <strong>Reject All:</strong> Only essential cookies will be used
            </li>
            <li>
              <strong>Customize:</strong> Choose which categories of cookies to
              allow
            </li>
          </ul>
          <p className="text-neutral-700 dark:text-neutral-300">
            You can change your cookie preferences at any time by clicking the
            "Cookie Settings" link in our website footer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Managing Cookies
          </h2>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            6.1 Browser Settings
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You can control cookies through your browser settings:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Chrome:</strong> Settings → Privacy and security → Cookies
              and other site data
            </li>
            <li>
              <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
              and Site Data
            </li>
            <li>
              <strong>Safari:</strong> Preferences → Privacy → Manage Website
              Data
            </li>
            <li>
              <strong>Edge:</strong> Settings → Cookies and site permissions
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-neutral-800 dark:text-neutral-200">
            6.2 Opt-Out Tools
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You can opt out of interest-based advertising through:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <a
                href="https://optout.aboutads.info/"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Digital Advertising Alliance
              </a>
            </li>
            <li>
              <a
                href="https://www.youronlinechoices.com/"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Your Online Choices
              </a>
            </li>
            <li>
              <a
                href="https://www.networkadvertising.org/choices/"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Network Advertising Initiative
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            7. Impact of Disabling Cookies
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you disable cookies, some features of our website may not
            function properly:
          </p>
          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>You may need to log in again for each visit</li>
            <li>Your shopping cart may not persist between sessions</li>
            <li>Some forms may not remember your preferences</li>
            <li>Analytics data will not be collected</li>
            <li>Personalized recommendations may not be available</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            8. Updates to This Policy
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We may update this Cookies Policy from time to time to reflect
            changes in our practices or for legal reasons. We will notify you of
            any material changes and update the "Last updated" date at the top
            of this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            9. Contact Us
          </h2>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you have any questions about our use of cookies or this policy,
            please contact us:
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
              <strong>Phone:</strong> [Your Phone Number]
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Address:</strong> [Your Company Address]
            </p>
          </div>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Cookie Settings
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            You can manage your cookie preferences at any time. Click the button
            below to open our cookie consent manager.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
              Manage Cookie Settings
            </button>
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
