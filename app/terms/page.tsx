import Link from 'next/link'
import Image from 'next/image'
import { FileText, ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Terms of Service — Erovoutika',
  description: 'Terms governing your use of Erovoutika services and website.',
}

export default function TermsPage() {
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
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-500/80 mb-1">Legal</p>
                <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Last updated: March 2, 2026</p>
          </div>
        </div>

        {/* Body */}
        <div className="container mx-auto px-6 py-14 max-w-4xl space-y-10">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using the website of Erovoutika Electronics Robotics and Automation
              (<strong>"Erovoutika," "we," "our,"</strong> or <strong>"us"</strong>) at{' '}
              <a href="https://erovoutika.ph" className="text-orange-500 hover:underline">erovoutika.ph</a> — or
              any associated sub-domains, products, training programs, or services — you agree to be bound by
              these Terms of Service. If you do not accept these terms, please discontinue use immediately.
            </p>
            <p>
              These terms apply to all visitors, clients, training participants, interns, and business partners.
            </p>
          </Section>

          <Section title="2. Services Offered">
            <p>Erovoutika provides the following services, among others:</p>
            <BulletList items={[
              'Training and CPD-accredited certification programs in electronics, robotics, and automation',
              'Custom automation and PLC-based industrial solutions',
              'Robotics design, prototyping, and deployment',
              'Research and development in emerging technologies',
              'Cybersecurity consulting and solutions',
              'Blockchain technology integration',
              'Internship programs for engineering students',
              'Events including Robolution (national robotics competition)',
            ]} />
            <p>
              Service scope, pricing, and deliverables for each engagement are defined in separate written agreements,
              purchase orders, or enrollment confirmations.
            </p>
          </Section>

          <Section title="3. Website Use">
            <p>You agree to use this website only for lawful purposes and in a way that does not:</p>
            <BulletList items={[
              'Violate any applicable Philippine or international law or regulation',
              'Infringe the intellectual property rights of Erovoutika or any third party',
              'Introduce malware, viruses, or any harmful code to our systems',
              'Attempt to gain unauthorized access to any part of the website or its servers',
              'Misrepresent your identity or affiliation when submitting inquiries or forms',
              'Scrape, harvest, or systematically collect content from this website without prior written consent',
            ]} />
          </Section>

          <Section title="4. Intellectual Property">
            <p>
              All content on this website — including text, logos, images, graphics, video, training materials,
              curriculum, and software — is the exclusive intellectual property of Erovoutika or its licensors,
              and is protected under Philippine and international copyright and trademark laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, publicly display, or create derivative works from any
              content without prior written permission from Erovoutika. Limited personal, non-commercial use
              is permitted provided you retain all copyright notices.
            </p>
            <p>
              The Erovoutika name, logo, EIRA, and Robolution marks are trademarks of Erovoutika. Unauthorized
              use is strictly prohibited.
            </p>
          </Section>

          <Section title="5. Training Programs and Certifications">
            <SubList items={[
              { label: 'Enrollment', detail: 'Registration is confirmed only upon receipt of full payment or an official purchase order from a partner institution.' },
              { label: 'Attendance', detail: 'Participants must meet minimum attendance requirements (as stated in each program) to be eligible for certificates.' },
              { label: 'CPD Credits', detail: 'CPD units are issued in accordance with PRC accreditation No. ECE-2022-014. Erovoutika is not liable for PRC processing delays.' },
              { label: 'Cancellations & Refunds', detail: 'Cancellations made 5+ business days before the training date are eligible for a full refund or transfer. Cancellations within 5 business days are non-refundable but may be rescheduled once.' },
              { label: 'Program Changes', detail: 'Erovoutika reserves the right to modify training schedules, content, or venue. Registered participants will be notified at least 3 business days in advance.' },
            ]} />
          </Section>

          <Section title="6. Automation & Robotics Projects">
            <SubList items={[
              { label: 'Scope of Work', detail: 'Project specifications, timelines, and costs are governed by a separate signed contract or proposal document.' },
              { label: 'Client Obligations', detail: 'Clients must provide accurate technical requirements, timely access to facilities, and designated points of contact.' },
              { label: 'Acceptance Testing', detail: 'Systems are delivered after meeting agreed acceptance criteria. Clients have 15 calendar days to raise defects post-delivery.' },
              { label: 'Warranty', detail: 'Unless otherwise specified, Erovoutika provides a 90-day warranty on delivered systems covering manufacturing defects, excluding damage from misuse or unauthorized modifications.' },
              { label: 'Confidentiality', detail: 'Both parties agree to maintain confidentiality of proprietary technical information exchanged during project engagements.' },
            ]} />
          </Section>

          <Section title="7. Payment Terms">
            <p>Unless otherwise stated in a separate agreement:</p>
            <BulletList items={[
              'Invoices are payable within 15 calendar days of issuance',
              'Late payments are subject to a 2% monthly interest charge',
              'Erovoutika reserves the right to suspend services for overdue accounts',
              'All prices are in Philippine Peso (PHP) and exclusive of applicable taxes unless stated otherwise',
            ]} />
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by Philippine law, Erovoutika shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of our website,
              services, or training programs — including but not limited to loss of profits, data, or business
              opportunities.
            </p>
            <p>
              Our total liability for any claim related to our services shall not exceed the amount paid by you
              for the specific service giving rise to the claim.
            </p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>
              The website and its content are provided on an <strong>"as is" and "as available"</strong> basis.
              Erovoutika makes no warranties, express or implied, including merchantability, fitness for a
              particular purpose, or non-infringement. We do not warrant that the website will be uninterrupted,
              error-free, or free of viruses or other harmful components.
            </p>
          </Section>

          <Section title="10. Internship Program">
            <p>
              Erovoutika's internship program is offered to qualified engineering and technology students in
              coordination with their academic institution. Interns are subject to a separate Memorandum of
              Agreement (MOA) between Erovoutika and the school. Interns are not considered employees and are
              not entitled to compensation unless explicitly stated. Erovoutika may end an internship early
              for cause (misconduct, unsatisfactory performance, or breach of confidentiality).
            </p>
          </Section>

          <Section title="11. Robolution Event">
            <p>
              Participation in Robolution (Erovoutika's national robotics competition) is subject to separate
              event-specific rules and regulations published prior to each edition. By registering, participants
              agree to those rules in addition to these Terms. Erovoutika reserves the right to disqualify
              teams for rule violations, unsportsmanlike conduct, or safety concerns.
            </p>
          </Section>

          <Section title="12. Governing Law & Dispute Resolution">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of
              the Philippines. Any dispute arising from these Terms or your use of our services shall first be
              subject to good-faith negotiation. If unresolved within 30 days, disputes shall be submitted
              to the appropriate courts of Makati City, Metro Manila, Philippines, which shall have exclusive
              jurisdiction.
            </p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              Erovoutika reserves the right to modify these Terms at any time. Updated Terms will be posted
              on this page with a revised "Last updated" date. Continued use of our website or services after
              changes are posted constitutes acceptance of the revised Terms. We recommend reviewing this page
              periodically.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <p>For questions or concerns about these Terms:</p>
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