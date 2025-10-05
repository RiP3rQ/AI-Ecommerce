import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Monitor,
  Keyboard,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement | WCAG Compliance",
  description:
    "Our commitment to digital accessibility. Learn about our WCAG 2.1 AA compliance, accessibility features, and how we ensure our website is usable by everyone.",
  keywords:
    "accessibility statement, WCAG, web accessibility, inclusive design, disability access, screen readers",
};

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Accessibility Statement
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Our commitment to making our website accessible to everyone,
          regardless of ability or disability.
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

      {/* Overview */}
      <div className="mb-12 rounded-lg border border-neutral-200 bg-gradient-to-r from-green-50 to-blue-50 p-8 dark:border-neutral-700 dark:from-green-900/20 dark:to-blue-900/20">
        <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Our Accessibility Commitment
        </h2>
        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
          We are committed to ensuring digital accessibility for people with
          disabilities. We are continually improving the user experience for
          everyone and applying the relevant accessibility standards.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              WCAG 2.1 AA
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Compliant
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Screen Readers
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Supported
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Keyboard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Keyboard Navigation
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Full Support
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Compliance Status
          </h2>

          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  WCAG 2.1 Level AA Compliant
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Our website conforms to Web Content Accessibility Guidelines
                  (WCAG) 2.1 Level AA standards. This means we've implemented
                  accessibility features that make our content more accessible
                  to people with disabilities.
                </p>
              </div>
            </div>
          </div>

          <p className="text-neutral-700 dark:text-neutral-300">
            WCAG 2.1 AA is an internationally recognized standard for web
            accessibility, developed by the World Wide Web Consortium (W3C).
            Level AA represents a high level of accessibility that addresses the
            needs of most users with disabilities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Accessibility Features
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Visual Accessibility
                </h3>
              </div>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>• High contrast color schemes</li>
                <li>• Resizable text (up to 200%)</li>
                <li>• Dark mode support</li>
                <li>• Clear focus indicators</li>
                <li>• Alt text for all images</li>
                <li>• Consistent navigation</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <Keyboard className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Keyboard Navigation
                </h3>
              </div>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>• Full keyboard navigation</li>
                <li>• Logical tab order</li>
                <li>• Skip links to main content</li>
                <li>• Keyboard shortcuts</li>
                <li>• Form navigation</li>
                <li>• Menu navigation</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <Monitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Screen Reader Support
                </h3>
              </div>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>• Semantic HTML structure</li>
                <li>• ARIA labels and descriptions</li>
                <li>• Screen reader announcements</li>
                <li>• Proper heading hierarchy</li>
                <li>• Form labels and instructions</li>
                <li>• Error message announcements</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Cognitive Accessibility
                </h3>
              </div>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>• Clear, simple language</li>
                <li>• Consistent layout and design</li>
                <li>• Progress indicators</li>
                <li>• Error prevention and recovery</li>
                <li>• Search functionality</li>
                <li>• FAQ and help sections</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Assistive Technologies
          </h2>

          <p className="mb-6 text-neutral-700 dark:text-neutral-300">
            Our website is designed to work with the following assistive
            technologies:
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                Screen Readers (NVDA, JAWS, VoiceOver)
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                Braille Displays
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                Screen Magnifiers
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                Speech Recognition Software
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                Alternative Input Devices
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-900 dark:text-neutral-100">
                Switch Controls
              </span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Browser and Device Support
          </h2>

          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Browser
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Minimum Version
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Accessibility Support
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white dark:bg-neutral-900 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Chrome
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    90+
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    Full Support
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Firefox
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    88+
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    Full Support
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Safari
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    14+
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    Full Support
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-800">
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Edge
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    90+
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    Full Support
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-neutral-700 dark:text-neutral-300">
            Our website is optimized for desktop and mobile devices. All
            accessibility features are available across device types.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Known Limitations
          </h2>

          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Areas for Improvement
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                  While we strive for full accessibility, some third-party
                  content and legacy materials may have limitations.
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200">
                  <li>Some PDF documents may not be fully accessible</li>
                  <li>
                    Third-party embedded content may have varying accessibility
                    levels
                  </li>
                  <li>
                    Some complex interactive elements may require additional
                    testing
                  </li>
                  <li>
                    Video content may require additional captions in some cases
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-neutral-700 dark:text-neutral-300">
            We are actively working to address these limitations and welcome
            feedback from users about accessibility issues they encounter.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Feedback and Contact
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We welcome feedback on the accessibility of our website. If you
            encounter any accessibility barriers or have suggestions for
            improvement, please contact us:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                Report Accessibility Issues
              </h3>
              <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <p>
                  <strong>Email:</strong> accessibility@yourcompany.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (234) 567-8900
                </p>
                <p>
                  <strong>Response Time:</strong> Within 2 business days
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                What to Include
              </h3>
              <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                <li>• Page URL where issue occurs</li>
                <li>• Description of the problem</li>
                <li>• Assistive technology used</li>
                <li>• Browser and device information</li>
                <li>• Suggested solutions (if any)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            7. Accessibility Evaluation
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Our website undergoes regular accessibility evaluations:
          </p>

          <ul className="mb-4 ml-6 list-disc text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Automated Testing:</strong> Regular scans using
              accessibility testing tools
            </li>
            <li>
              <strong>Manual Testing:</strong> Expert review by accessibility
              specialists
            </li>
            <li>
              <strong>User Testing:</strong> Feedback from users with
              disabilities
            </li>
            <li>
              <strong>Third-Party Audits:</strong> Annual comprehensive
              accessibility audits
            </li>
            <li>
              <strong>Continuous Monitoring:</strong> Ongoing accessibility
              monitoring and improvements
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            8. Legal Compliance
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Our commitment to accessibility is guided by international standards
            and legal requirements:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                European Standards
              </h4>
              <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                <li>• EN 301 549 (EU Web Accessibility)</li>
                <li>• WCAG 2.1 Level AA</li>
                <li>• European Accessibility Act</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                International Standards
              </h4>
              <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                <li>• ISO 14289-1 (PDF Accessibility)</li>
                <li>• Section 508 (US Government)</li>
                <li>• AODA (Ontario, Canada)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            9. Updates and Improvements
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            We regularly update this accessibility statement to reflect
            improvements and changes to our website. This statement was last
            reviewed and updated on{" "}
            {new Date().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>

          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
              Recent Improvements
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• Enhanced keyboard navigation throughout the site</li>
              <li>• Improved screen reader compatibility</li>
              <li>• Added high contrast mode options</li>
              <li>• Implemented skip links for main content</li>
              <li>• Enhanced form accessibility with better labels</li>
              <li>• Added focus management for modal dialogs</li>
            </ul>
          </div>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Need Accessibility Support?
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            If you need assistance accessing any part of our website or have
            questions about our accessibility features, please don't hesitate to
            contact us.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Contact Accessibility Team
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
