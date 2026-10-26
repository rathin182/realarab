import type { Metadata } from 'next';
import { ArrowUpRight, Check, Globe2, Landmark, MapPinned, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Saudi Property Buying Guide | Najm Estates KSA',
  description: 'A practical guide to Saudi property ownership, registration, financing and costs for Saudi nationals, resident expatriates and international buyers.',
};

const buyerPaths = [
  {
    id: '01', title: 'Saudi nationals', subtitle: 'Domestic purchase & registration', icon: Landmark,
    summary: 'Saudi citizens generally follow the domestic title transfer and registration process. Financing and housing support remain subject to the lender and programme rules.',
    steps: ['Verify the electronic title deed, boundaries, permitted use, mortgages and restrictions.', 'Confirm the seller’s identity and authority, including any power of attorney.', 'Arrange payment or finance and coordinate any mortgage release.', 'Complete conveyance through the appropriate Ministry of Justice or Real Estate Registry service.', 'Keep official evidence that the ownership record has been updated.'],
  },
  {
    id: '02', title: 'Expatriate residents', subtitle: 'Iqama-based eligibility', icon: ShieldCheck,
    summary: 'A foreign resident may apply under the non-Saudi ownership framework. An Iqama is not blanket permission: eligibility depends on the buyer, property and location.',
    steps: ['Confirm valid residence status and the applicable buyer category.', 'Check whether the property is in an approved zone or may qualify under the one-home personal-residence route.', 'Apply through the Saudi Properties portal and complete identity and eligibility checks.', 'Obtain mortgage approval separately from a SAMA-licensed lender, if needed.', 'Complete the required registration in the Real Estate Registry.'],
  },
  {
    id: '03', title: 'International buyers', subtitle: 'Non-resident ownership', icon: Globe2,
    summary: 'Eligible overseas buyers may apply without first relocating. The exact ownership right and property eligibility depend on the designated zone and applicable regulations.',
    steps: ['Verify the exact property, zone, permitted right and any ownership cap.', 'Start the digital identity process through the relevant Saudi mission or embassy.', 'Prepare passport, address, contact, identity and bank documentation required for the application.', 'Apply through Saudi Properties and follow the approved banking and payment route.', 'Register the acquired right and retain transfer records, approvals and receipts.'],
  },
];

const comparison = [
  ['Primary identity', 'Saudi national ID', 'Valid Iqama and verification', 'Passport and required digital identity'],
  ['Ownership route', 'Domestic rules and property-specific requirements', 'Non-Saudi rules; qualifying one-home exception may apply outside zones', 'Designated geographic zones; no equivalent general one-home exception'],
  ['Makkah & Madinah', 'Domestic ownership rules', 'Non-Saudi individual ownership limited to Muslims and designated zones', 'Non-Saudi individual ownership limited to Muslims and designated zones'],
  ['Mortgage', 'Lender approval required', 'Lender approval and expatriate eligibility required', 'Do not assume financing is available; confirm with lender'],
  ['Housing support', 'May qualify under programme rules', 'Do not assume citizen benefits apply', 'Do not assume citizen benefits apply'],
  ['Application channel', 'Applicable conveyance and registration service', 'Saudi Properties portal', 'Saudi mission / embassy digital identity, then Saudi Properties'],
  ['RETT', 'Generally 5%, subject to exceptions', 'Generally 5%, subject to exceptions', 'Generally 5%, subject to exceptions'],
  ['Additional ownership fee', 'Not applicable merely due to Saudi nationality', 'May apply under non-Saudi rules', 'May apply under non-Saudi rules'],
];

const sources = [
  ['REGA · Foreign ownership guidance', 'https://rega.gov.sa/en/rega-services/platforms/non-saudi-real-estate-ownership-in-saudi-arabia/'],
  ['Saudi Properties · Eligibility and applications', 'https://saudiproperties.rega.gov.sa/'],
  ['SAMA · Real estate finance rules', 'https://rulebook.sama.gov.sa/en/real-estate-finance'],
  ['SAMA · Non-resident account requirements', 'https://rulebook.sama.gov.sa/en/update-account-opening-rules-adding-bank-account-opening-requirements-non-residents-covered'],
  ['Ministry of Justice · Real estate conveyance', 'https://www.moj.gov.sa/English/eServices/pages/6afcae8e-0030-41d3-926e-8e270e96c635.aspx'],
  ['ZATCA · Real Estate Transaction Tax guidance', 'https://zatca.gov.sa/en/HelpCenter/guidelines/Documents/Detailed-Guideline-for-RETT-In-accordance-with-provision-of-RETT-Law-and-its-Implementing-Regulations.pdf'],
  ['Umm Al-Qura · Non-Saudi ownership law', 'https://www.uqn.gov.sa/details?p=27293'],
  ['Umm Al-Qura · Implementing regulations', 'https://www.uqn.gov.sa/decisions-and-regulations/4001281'],
  ['Sakani · Housing support', 'https://sakani.sa/'],
  ['Saudi Premium Residency', 'https://pr.gov.sa/'],
];

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#A98950]">{children}</span>;
}

export default function KnowledgePage() {
  return (
    <main className="min-h-screen bg-white text-[#141A17]">
      <section className="border-b border-neutral-200 bg-[#F7F6F1] px-5 pb-16 pt-16 sm:px-8 sm:pb-20 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <SectionKicker>Saudi Arabia · Buyer knowledge · 2026</SectionKicker>
          <h1 className="max-w-5xl font-serif text-5xl font-light leading-[0.98] text-[#0C3826] sm:text-7xl lg:text-8xl">A clear guide to buying property in Saudi Arabia.</h1>
          <p className="mt-7 max-w-3xl text-base font-light leading-7 text-neutral-600 sm:text-lg">Three buyer journeys. One essential distinction: legal permission to own does not guarantee a mortgage, residency status, or eligibility for every property.</p>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">Research updated 23 October 2026</p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <SectionKicker>Choose your pathway</SectionKicker>
            <h2 className="font-serif text-3xl font-light text-[#0C3826] sm:text-5xl">Different buyers. Different checks.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {buyerPaths.map(({ id, title, subtitle, icon: Icon, summary, steps }) => (
              <article key={id} className="flex flex-col border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-[#A98950]">{id}</span>
                  <Icon className="h-5 w-5 text-[#0C3826]" />
                </div>
                <h3 className="font-serif text-2xl text-[#0C3826]">{title}</h3>
                <p className="mt-1 text-xs font-mono uppercase tracking-wider text-neutral-400">{subtitle}</p>
                <p className="mt-5 min-h-20 text-sm font-light leading-6 text-neutral-600">{summary}</p>
                <ol className="mt-6 space-y-4 border-t border-neutral-100 pt-6">
                  {steps.map((step, index) => <li key={step} className="flex gap-3 text-sm font-light leading-5 text-neutral-700"><span className="mt-0.5 font-mono text-[10px] text-[#A98950]">0{index + 1}</span><span>{step}</span></li>)}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0C3826] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionKicker>2026 non-Saudi framework</SectionKicker>
            <h2 className="font-serif text-3xl font-light leading-tight sm:text-4xl">Ownership is possible. Eligibility is specific.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Designated zones', 'Non-Saudi ownership and other real rights are governed by approved areas, property rights, ownership caps and any time limits. Check the exact property on the official portal.'],
              ['Resident’s one-home route', 'A legally resident non-Saudi individual may qualify to own one property for personal residence outside designated zones, excluding Makkah and Madinah, subject to the regulations.'],
              ['Makkah and Madinah', 'Non-Saudi individual ownership is limited to Muslims and remains subject to designated-zone rules.'],
              ['Registration matters', 'Non-Saudi ownership becomes valid through registration in the Real Estate Registry under the applicable rules.'],
            ].map(([title, body]) => <div key={title} className="border border-white/20 p-5"><h3 className="font-serif text-xl">{title}</h3><p className="mt-2 text-sm font-light leading-6 text-white/75">{body}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl"><SectionKicker>At a glance</SectionKicker><h2 className="font-serif text-3xl font-light text-[#0C3826] sm:text-5xl">Compare the buyer journeys.</h2></div>
          <div className="overflow-x-auto border border-neutral-200">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead><tr className="bg-[#F7F6F1] text-[10px] uppercase tracking-wider text-neutral-500"><th className="p-4 font-mono">Topic</th><th className="p-4 font-mono">Saudi national</th><th className="p-4 font-mono">Expat resident</th><th className="p-4 font-mono">International non-resident</th></tr></thead>
              <tbody>{comparison.map(([topic, ...values]) => <tr key={topic} className="border-t border-neutral-200 align-top"><th className="bg-neutral-50/70 p-4 text-xs font-medium text-[#0C3826]">{topic}</th>{values.map((value, index) => <td key={index} className="p-4 font-light leading-5 text-neutral-600">{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-[#F7F6F1] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <SectionKicker>Financing & purchase costs</SectionKicker>
            <h2 className="font-serif text-3xl font-light text-[#0C3826] sm:text-4xl">Separate ownership rules from lending decisions.</h2>
            <p className="mt-5 text-sm font-light leading-6 text-neutral-600">Saudi citizens and resident expatriates may seek finance from SAMA-licensed lenders. Approval depends on the buyer, income, liabilities, property valuation and lender product. There is no single salary or deposit that guarantees approval. Non-residents should obtain explicit lender confirmation and must follow applicable identity and account requirements.</p>
            <div className="mt-6 flex items-start gap-3 border-l-2 border-[#A98950] pl-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0C3826]" /><p className="text-sm font-light leading-6 text-neutral-700">Property ownership does not itself grant a visa, right to reside, or additional immigration privileges. Premium Residency has a separate framework.</p></div>
          </div>
          <div className="space-y-5">
            <div className="border border-neutral-200 bg-white p-6"><h3 className="font-serif text-xl text-[#0C3826]">Real Estate Transaction Tax (RETT)</h3><p className="mt-2 text-sm font-light leading-6 text-neutral-600">Generally 5% of transaction value, subject to statutory exemptions and special rules. Eligible Saudi first-home buyers may receive state coverage on qualifying purchase value up to SAR 1 million, subject to conditions.</p></div>
            <div className="border border-neutral-200 bg-white p-6"><h3 className="font-serif text-xl text-[#0C3826]">Additional non-Saudi disposition fee</h3><p className="mt-2 text-sm font-light leading-6 text-neutral-600">The law allows a fee up to 5%; the actual rate and exemptions depend on the regulations, right type, purpose and area. The statutory maximum is not automatically charged on every purchase.</p></div>
            <div className="border border-neutral-200 bg-white p-6"><h3 className="font-serif text-xl text-[#0C3826]">Budget beyond tax</h3><p className="mt-2 text-sm font-light leading-6 text-neutral-600">Check brokerage, valuation, finance, registration and other transaction charges separately. Confirm who pays each item in the transaction documents.</p></div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><SectionKicker>Before you commit</SectionKicker><h2 className="font-serif text-3xl font-light text-[#0C3826] sm:text-4xl">A due-diligence checklist for every buyer.</h2></div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['Verify title, boundaries, permitted use, mortgages and restrictions.', 'Confirm seller identity and authority to sell.', 'Check the exact property’s eligibility for your buyer category.', 'Confirm registered ownership type; do not assume every eligible right is freehold.', 'Get written lender approval for both buyer and property before relying on finance.', 'Agree payment milestones, refund conditions and responsibility for costs.', 'Use traceable, approved payment routes and keep bank records and receipts.', 'Review resale, transfer, inheritance and exit rules.', 'Make approvals conditions of the agreement where appropriate.', 'Have a Saudi-qualified lawyer review the contract before a substantial payment.'].map((item) => <li key={item} className="flex gap-3 border-b border-neutral-200 py-3 text-sm font-light leading-5 text-neutral-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A98950]" />{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-[#F7F6F1] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8"><SectionKicker>Official references</SectionKicker><h2 className="font-serif text-3xl font-light text-[#0C3826] sm:text-4xl">Start with the government source.</h2></div>
          <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{sources.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-neutral-200 py-4 text-sm text-neutral-700 transition-colors hover:text-[#0C3826]"><span>{label}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-[#A98950] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>)}</div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-t border-neutral-200 pt-8 sm:flex-row sm:items-end">
          <div className="max-w-3xl"><p className="text-sm font-light leading-6 text-neutral-500">This guide is informational and reflects the supplied research brief as of 23 October 2026. It is not legal advice. Rules, geographic eligibility, fees and registration requirements may change; verify the current position with REGA and the competent authorities, and seek Saudi legal advice for a live transaction.</p></div>
        </div>
      </section>
    </main>
  );
}
