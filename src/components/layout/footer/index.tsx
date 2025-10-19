import Link from "next/link";

import { LogoSquare } from "@/components/logo";

const { COMPANY_NAME, SITE_NAME } = process.env;

const footerLinks = [
  {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Cookies Policy", href: "/cookies-policy" },
      { title: "Terms & Conditions", href: "/terms-conditions" },
      { title: "Returns & Refunds", href: "/returns-policy" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { title: "Shipping Info", href: "/shipping" },
      { title: "Accessibility", href: "/accessibility" },
      { title: "Impressum", href: "/impressum" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2025 + (currentYear > 2025 ? `-${currentYear}` : "");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link className="text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="md" />
            <span className="sr-only">{SITE_NAME}</span>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-1 lg:justify-between">
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 underline-offset-4 hover:underline"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p className="text-center md:text-left">
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""}{" "}
            All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p className="md:ml-auto">
            <a
              href="https://riperq.pro/"
              className="text-black hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Created by RiP3rQ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
