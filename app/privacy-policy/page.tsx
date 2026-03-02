import Link from 'next/link'
import Image from 'next/image'
import { Shield, ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Privacy Policy — Erovoutika',
  description: 'How Erovoutika collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ── Top nav bar ── */}
      <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/[0.07] bg-white/95 dark:bg-[#050A14]/95 backdrop-blur-md">
        <div className="container mx-auto px-6 max-w-6xl h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
            <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:text-orange-500 transition-colors">
              Back to Home
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white dark:bg-[#050A14] text-gray-700 dark:text-slate-300">

        {/* Header band */}
        <div className="bg-gray-900 dark:bg-[#030712] border-b border-gray-800 dark:border-white/[0.06]">
          <div className="container mx-auto px-6 py-14 max-w-4xl">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-500/80 mb-1">Legal</p>
                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Last updated: March 2, 2026</p>
          </div>
        </div>

        {/* Body */}
        <div className="container mx-auto px-6 py-14 max-w-4xl space-y-10">

          <Section title="1. Introduction">
            <p>
              Erovoutika Electronics Robotics and Automation (<strong>"Erovoutika," "we," "our,"</strong> or{' '}
              <strong>"us"</strong>) is committed to protecting the privacy of our clients, website visitors,
              training participants, and business partners. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your personal information when you visit{' '}
              <a href="https://erovoutika.ph" className="text-orange-500 hover:underline">erovoutika.ph</a> or
              any of our sub-domains, use our services, or interact with us on social media.
            </p>
            <p className="mt-3">
              By accessing our website or engaging our services, you consent to the practices described in this
              policy. If you do not agree, please discontinue use of our platforms.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p className="mb-3">We may collect the following categories of personal information:</p>
            <SubList items={[
              { label: 'Identity & Contact Data', detail: 'Full name, email address, phone number, company or institution name, and position/title.' },
              { label: 'Inquiry & Form Data', detail: 'Messages submitted through our contact form, training registration forms, or internship applications.' },
              { label: 'Usage Data', detail: 'IP address, browser type, pages visited, referring URLs, and time on page — collected automatically via cookies and analytics.' },
              { label: 'Communications', detail: 'Emails, messages, or social media interactions you send to us.' },
              { label: 'Training & Certification Records', detail: 'Names, assessment scores, and credentials of participants in CPD-accredited programs.' },
            ]} />
          </Section>

          <Section title="3. How We Use Your Information">
            <p className="mb-3">We use the information we collect to:</p>
            <BulletList items={[
              'Respond to inquiries and provide requested services or quotes',
              'Process registrations for training, workshops, and events (including Robolution)',
              'Issue CPD certificates and maintain accreditation records as required by the Philippine Regulatory Commission',
              'Send relevant updates, news, and promotional information (you may opt out at any time)',
              'Improve our website, services, and customer experience',
              'Comply with applicable Philippine laws, including the Data Privacy Act of 2012 (Republic Act 10173)',
              'Prevent fraud and ensure the security of our systems',
            ]} />
          </Section>

          <Section title="4. Legal Basis for Processing (Data Privacy Act of 2012)">
            <p className="mb-3">
              Under Republic Act 10173 and its Implementing Rules, we process your personal data on the following bases:
            </p>
            <SubList items={[
              { label: 'Consent', detail: 'When you submit a contact form, register for an event, or subscribe to updates.' },
              { label: 'Contractual Necessity', detail: 'To fulfill obligations when you engage our automation, robotics, or training services.' },
              { label: 'Legitimate Interest', detail: 'To operate and improve our business and maintain security.' },
              { label: 'Legal Obligation', detail: 'To comply with CPD accreditation requirements and other applicable regulations.' },
            ]} />
          </Section>

          <Section title="5. Sharing Your Information">
            <p className="mb-3">
              We do <strong>not sell</strong> your personal data. We may share it only in the following circumstances:
            </p>
            <SubList items={[
              { label: 'Service Providers', detail: 'Trusted vendors (cloud hosting, email delivery, payment processors) under strict confidentiality agreements.' },
              { label: 'Partner Institutions', detail: 'Academic and industry partners, only when necessary to deliver joint programs or events.' },
              { label: 'Regulatory Bodies', detail: 'Government agencies (PRC, CHED, DepEd) when required by law or CPD accreditation rules.' },
              { label: 'Legal Requirements', detail: 'When disclosure is required by a court order or applicable Philippine law.' },
            ]} />
          </Section>

          <Section title="6. Cookies and Tracking Technologies">
            <p>
              Our website uses cookies to enhance your browsing experience, analyze traffic, and understand how
              visitors interact with our content. You may disable cookies in your browser settings, though some
              site features may not function properly. We use Google Analytics for aggregated, anonymized traffic
              analysis only.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain personal data only for as long as necessary to fulfill the purposes outlined here or as
              required by Philippine law. Training and certification records may be retained for up to{' '}
              <strong>10 years</strong> per CPD accreditation requirements. Contact form submissions are retained
              for up to <strong>2 years</strong>. You may request deletion at any time (see Section 9).
            </p>
          </Section>

          <Section title="8. Data Security">
            <p>
              Erovoutika implements appropriate technical and organizational measures — including HTTPS encryption,
              access controls, and regular security reviews — to protect your data against unauthorized access,
              alteration, or disclosure. No method of internet transmission is 100% secure, but we strive to
              use commercially acceptable means of protection.
            </p>
          </Section>

          <Section title="9. Your Rights Under the Data Privacy Act">
            <p className="mb-3">As a data subject under Philippine law, you have the right to:</p>
            <SubList items={[
              { label: 'Access', detail: 'Request a copy of the personal data we hold about you.' },
              { label: 'Correction', detail: 'Request correction of inaccurate or incomplete data.' },
              { label: 'Erasure / Blocking', detail: 'Request deletion when data is no longer necessary or consent is withdrawn.' },
              { label: 'Portability', detail: 'Receive your data in a structured, machine-readable format.' },
              { label: 'Object', detail: 'Object to processing based on legitimate interest or for direct marketing.' },
              { label: 'Complaint', detail: 'Lodge a complaint with the National Privacy Commission at privacy.gov.ph.' },
            ]} />
            <p className="mt-4">
              To exercise any right, contact us at{' '}
              <a href="mailto:info@erovoutika.ph" className="text-orange-500 hover:underline">info@erovoutika.ph</a>.
            </p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>
              Our website may link to third-party sites including partner institutions, Facebook, LinkedIn, and
              our shop at shop.erovoutika.ph. We are not responsible for their privacy practices. Please review
              their policies before submitting personal information.
            </p>
          </Section>

          <Section title="11. Children's Privacy">
            <p>
              Our services are not directed to children under 18. We do not knowingly collect data from minors.
              If you believe a minor has provided us personal data, contact us immediately.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this policy periodically. Changes will be posted on this page with a revised
              "Last updated" date. Continued use of our website after changes are posted constitutes acceptance.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <p>For questions or requests regarding this Privacy Policy:</p>
            <div className="mt-4 p-5 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] text-sm space-y-1.5">
              <p className="font-semibold text-gray-900 dark:text-slate-200">Erovoutika Electronics Robotics and Automation</p>
              <p>Unit 703, PARC HOUSE II, Epifanio de los Santos Avenue</p>
              <p>Makati City, 1212 Metro Manila, Philippines</p>
              <p className="pt-1">
                Email:{' '}
                <a href="mailto:info@erovoutika.ph" className="text-orange-500 hover:underline">info@erovoutika.ph</a>
              </p>
              <p>
                Phone:{' '}
                <a href="tel:+639061497307" className="text-orange-500 hover:underline">+63 906 149 7307</a>
              </p>
            </div>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-gray-600 dark:text-slate-400 space-y-2">{children}</div>
    </section>
  )
}

function SubList({ items }: { items: { label: string; detail: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map(({ label, detail }) => (
        <li key={label} className="flex gap-2.5 text-sm leading-relaxed">
          <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <span><strong className="text-gray-800 dark:text-slate-300">{label}:</strong> {detail}</span>
        </li>
      ))}
    </ul>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-1.5 text-sm leading-relaxed">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}