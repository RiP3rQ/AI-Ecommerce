import type { Metadata } from "next";
import Link from "next/link";
import { Users, Award, Heart, Target, Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Our Story & Mission",
  description:
    "Learn about our company, mission, values, and commitment to providing exceptional products and customer service.",
  keywords: "about us, company story, mission, values, team, history",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-neutral-900 dark:text-neutral-100 md:text-5xl">
          About {process.env.SITE_NAME || "Our Company"}
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-neutral-600 dark:text-neutral-400 md:text-xl">
          We're passionate about delivering exceptional products and creating
          meaningful experiences for our customers. Our journey began with a
          simple idea and has grown into a commitment to quality, innovation,
          and customer satisfaction.
        </p>
      </div>

      {/* Story Section */}
      <section className="mb-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Our Story
            </h2>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
              <p>
                Founded in 2020, {process.env.SITE_NAME || "our company"}{" "}
                started as a small team with a big vision: to make high-quality
                products accessible to everyone while maintaining the highest
                standards of craftsmanship and customer service.
              </p>
              <p>
                What began as a passion project in a small workshop has grown
                into a thriving business that serves customers across Europe and
                beyond. We've stayed true to our roots while embracing
                innovation and sustainable practices that benefit both our
                customers and the environment.
              </p>
              <p>
                Every product we create tells a story of dedication, quality,
                and attention to detail. We believe that great products aren't
                just about functionality—they're about creating joy, solving
                problems, and enhancing everyday life.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              {/* Placeholder for company image */}
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto h-24 w-24 text-neutral-400 dark:text-neutral-600" />
                  <p className="mt-4 text-neutral-500 dark:text-neutral-500">
                    Company Image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Our Values
          </h2>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
            These core principles guide everything we do, from product
            development to customer interactions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Quality First
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We never compromise on quality. Every product undergoes rigorous
              testing to ensure it meets our high standards and exceeds customer
              expectations.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Customer Focus
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Our customers are at the heart of everything we do. We listen to
              feedback, anticipate needs, and strive to create exceptional
              experiences.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Innovation
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We embrace new ideas and technologies to improve our products and
              processes, always looking for better ways to serve our customers.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Sustainability
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We're committed to environmental responsibility, using sustainable
              materials and practices that minimize our ecological footprint.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Community
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We believe in giving back to our community and supporting causes
              that make a positive difference in people's lives.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Transparency
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We believe in open communication and being transparent about our
              processes, sourcing, and business practices.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Our Mission
            </h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              To empower people with high-quality, innovative products that
              enhance their daily lives while maintaining unwavering commitment
              to sustainability, ethical practices, and exceptional customer
              service.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-8 dark:from-green-900/20 dark:to-emerald-900/20">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Our Vision
            </h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              To be the leading provider of premium products that combine
              cutting-edge innovation with timeless craftsmanship, creating
              positive impact in the lives of our customers and communities
              worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Meet Our Team
          </h2>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
            Our diverse team brings together expertise from various fields,
            united by a passion for excellence and innovation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Team members would be added here - placeholder for now */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div className="flex h-full items-center justify-center">
                <Users className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
              </div>
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Jane Smith
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              CEO & Founder
            </p>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Passionate about creating innovative solutions that make a
              difference.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div className="flex h-full items-center justify-center">
                <Users className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
              </div>
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Mike Johnson
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Head of Product
            </p>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Expert in product development with 10+ years of industry
              experience.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div className="flex h-full items-center justify-center">
                <Users className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
              </div>
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Sarah Davis
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Customer Success Manager
            </p>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Dedicated to ensuring every customer has an exceptional
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="rounded-2xl bg-neutral-50 p-8 dark:bg-neutral-800">
          <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            By the Numbers
          </h2>
          <div className="grid gap-8 text-center md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                50K+
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                1000+
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Products Delivered
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                25+
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Countries Served
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                4.9/5
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Our Commitment
          </h2>
          <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
            We're committed to making a positive impact beyond our products.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Environmental Responsibility
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              We use sustainable materials, minimize packaging waste, and offset
              our carbon footprint through reforestation projects.
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>100% recycled packaging materials</li>
              <li>Carbon-neutral shipping</li>
              <li>Sustainable sourcing practices</li>
            </ul>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Community Support
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              We believe in giving back to the communities that support us
              through charitable donations and volunteer work.
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>5% of profits donated to charity</li>
              <li>Employee volunteer programs</li>
              <li>Local community partnerships</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white dark:from-blue-700 dark:to-purple-700">
          <h2 className="mb-4 text-2xl font-bold">Join Our Community</h2>
          <p className="mb-6 text-blue-100">
            Experience the difference that quality and care can make. Discover
            our products and become part of our growing family of satisfied
            customers.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-blue-600 hover:bg-blue-50"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-6 py-3 text-white hover:bg-white hover:text-blue-600"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
