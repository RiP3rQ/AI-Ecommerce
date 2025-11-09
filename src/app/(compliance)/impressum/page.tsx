import type { Metadata } from "next";
import { Link } from "react-transition-progress/next";
import { Building, Mail, Phone, Globe, User, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Impressum | Legal Information",
  description:
    "Legal information and company details as required by German and Austrian law (TMG and ECG). Official company registration and contact information.",
  keywords:
    "impressum, legal information, company details, TMG, ECG, German law, Austrian law",
};

export default function ImpressumPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Impressum
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Angaben gemäß § 5 TMG / ECG - Gesetzliche Anbieterkennzeichnung
        </p>
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
          Legal information according to § 5 TMG / ECG - Provider identification
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Angaben zum Unternehmen
            </h2>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Firmenname / Company Name
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {process.env.SITE_NAME || "Your Company Name"} GmbH
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Rechtsform / Legal Form
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Gesellschaft mit beschränkter Haftung (GmbH)
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Handelsregister / Commercial Register
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Amtsgericht [City]
                  <br />
                  HRB [Number]
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Umsatzsteuer-ID / VAT Number
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  DE [VAT Number]
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Anschrift / Address
            </h2>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Geschäftssitz / Registered Office
            </h3>
            <address className="not-italic text-neutral-700 dark:text-neutral-300">
              {process.env.SITE_NAME || "Your Company Name"} GmbH
              <br />
              [Street Name] [Number]
              <br />
              [Postal Code] [City]
              <br />
              Deutschland / Germany
            </address>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    E-Mail:
                  </span>
                  <a
                    href="mailto:info@yourcompany.com"
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    info@yourcompany.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    Telefon / Phone:
                  </span>
                  <a
                    href="tel:+491234567890"
                    className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  >
                    +49 123 4567890
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    Website:
                  </span>
                  <a
                    href="https://yourcompany.com"
                    className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                  >
                    www.yourcompany.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Vertretungsberechtigte Personen
            </h2>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Geschäftsführung / Management
            </h3>
            <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Johann Schmidt (Geschäftsführer / CEO)</li>
              <li>Maria Müller (Geschäftsführerin / COO)</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Aufsichtsbehörde / Supervisory Authority
          </h2>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>
                Zuständige Aufsichtsbehörde für das Handelsgewerbe:
              </strong>
              <br />
              Gewerbeaufsichtsamt [City]
              <br />
              [Address]
              <br />
              [Postal Code] [City]
              <br />
              Deutschland / Germany
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Berufsrechtliche Regelungen
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Berufshaftpflichtversicherung / Professional Liability Insurance
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Versicherungsschutz besteht bei der [Insurance Company Name]
                <br />
                Geltungsbereich: Deutschland / Germany
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Zuständige Kammer / Professional Chamber
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Industrie- und Handelskammer [City]
                <br />
                [Address]
                <br />
                [Postal Code] [City]
                <br />
                Deutschland / Germany
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Berufsrechtliche Regelungen / Professional Regulations
              </h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                <li>Handelsgesetzbuch (HGB)</li>
                <li>Telemediengesetz (TMG)</li>
                <li>Datenschutz-Grundverordnung (DSGVO/GDPR)</li>
                <li>Verbraucherschutzgesetze</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Streitschlichtung / Dispute Resolution
          </h2>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Europäische Online-Streitbeilegung (OS)
            </h3>
            <p className="mb-3 text-neutral-700 dark:text-neutral-300">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              Sie finden diese unter:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Verbraucherstreitbeilegung / Consumer Dispute Resolution
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Haftung für Inhalte / Liability for Content
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Haftung für Links / Liability for Links
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>

          <p className="text-neutral-700 dark:text-neutral-300">
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
            mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
            inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
            Bekanntwerden von Rechtsverletzungen werden wir derartige Links
            umgehend entfernen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Urheberrecht / Copyright
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>

          <p className="text-neutral-700 dark:text-neutral-300">
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
            Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
            Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
            gekennzeichnet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Datenschutz / Data Protection
          </h2>

          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe
            personenbezogener Daten möglich. Soweit auf unseren Seiten
            personenbezogene Daten (beispielsweise Name, Anschrift oder
            E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets
            auf freiwilliger Basis.
          </p>

          <p className="text-neutral-700 dark:text-neutral-300">
            Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an
            Dritte weitergegeben. Wir weisen darauf hin, dass die
            Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail)
            Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten
            vor dem Zugriff durch Dritte ist nicht möglich.
          </p>

          <div className="mt-4">
            <Link
              href="/privacy-policy"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
            >
              → Zur Datenschutzerklärung / To Privacy Policy
            </Link>
          </div>
        </section>

        <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Kontakt / Contact
          </h3>
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Bei Fragen zu diesem Impressum oder unserem Angebot können Sie uns
            jederzeit kontaktieren.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Kontakt aufnehmen
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Zur Startseite
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-500">
          <p>
            Dieses Impressum wurde zuletzt aktualisiert am{" "}
            {new Date().toLocaleDateString("de-DE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
