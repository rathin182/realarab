import React from 'react';
import { Language } from '../../types';
import { TEAM } from '../../data/websiteContent';
import { ShieldCheck } from 'lucide-react';

interface TeamSectionProps {
  language: Language;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  const groups = [
    {
      label: isAr ? 'رئاسة مجلس الإدارة والشركاء المؤسسون' : 'CHAIRMAN & CO-FOUNDERS · EXECUTIVE BOARD',
      note: isAr ? 'القيادة والرؤية الاستراتيجية' : 'Leadership & strategic direction',
      members: TEAM.slice(0, 2),
    },
    {
      label: isAr ? 'الإدارة التنفيذية وفريق العمل' : 'MANAGEMENT CADRE & APPOINTMENTS',
      note: isAr ? 'فريق الاستشارات والتنفيذ' : 'Advisory & delivery team',
      members: TEAM.slice(2),
    },
  ];

  return (
    <section id="team" className="border-t border-neutral-200 bg-[#FBFAF7] py-20 font-sans sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 block text-[10px] font-mono uppercase tracking-[0.24em] text-[#A98950]">
              {isAr ? 'القيادة والخبرات' : 'LEADERSHIP & EXPERTISE'}
            </span>
            <h2 className="font-serif text-4xl font-normal leading-tight text-[#0C3826] sm:text-6xl">
              {isAr ? 'القيادة والإدارة العقارية' : 'Leadership & Sovereign Management'}
            </h2>
          </div>
          <p className="max-w-md text-sm font-light leading-6 text-neutral-600">
            {isAr
              ? 'تعرّف على الشركاء المؤسسين وفريق الإدارة الذي يوجه الاستشارات العقارية والاستثمارات الخاصة.'
              : 'Meet the founding partners and management team guiding Najm Estates’ property advice and private investments.'}
          </p>
        </div>

        <div className="space-y-14">
          {groups.map((group, groupIndex) => (
            <section key={group.label} aria-labelledby={`team-group-${groupIndex}`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#DCD8CE] pb-3">
                <div>
                  <h3 id={`team-group-${groupIndex}`} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0C3826]">
                    {group.label}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">{group.note}</p>
                </div>
                <span className="font-mono text-[10px] tracking-[0.16em] text-neutral-400">
                  {groupIndex === 0 ? '01 — 02' : '03 — 04'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {group.members.map((member) => (
                  <article key={member.id} className="grid grid-cols-1 overflow-hidden border border-[#E2DED4] bg-white sm:grid-cols-[minmax(150px,0.72fr)_1.5fr]" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="relative min-h-[290px] overflow-hidden bg-[#E8E3D9] sm:min-h-full">
                      <img
                        src={member.image}
                        alt={isAr ? member.nameAr : member.name}
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071A13]/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 start-3 border border-white/45 bg-black/15 px-2.5 py-1.5 text-[8px] font-mono uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                        {member.experience}
                      </span>
                    </div>

                    <div className="flex flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-serif text-2xl leading-tight text-[#0C3826] sm:text-3xl">
                            {isAr ? member.nameAr : member.name}
                          </h4>
                          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#A98950]">
                            {isAr ? member.roleAr : member.role}
                          </p>
                        </div>
                        <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#A98950]" strokeWidth={1.5} aria-label="Licensed advisor" />
                      </div>

                      <div className="mt-5 border-y border-neutral-100 py-4">
                        <span className="mb-1 block text-[8px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                          {isAr ? 'مجال الخبرة' : 'AREA OF EXPERTISE'}
                        </span>
                        <p className="text-xs leading-5 text-neutral-700">
                          {isAr ? member.specialtyAr : member.specialty}
                        </p>
                      </div>

                      <p className="mt-4 flex-1 font-serif text-[15px] italic leading-6 text-neutral-600">
                        “{isAr ? member.personalMessageAr : member.personalMessage}”
                      </p>

                      <div className="mt-5 border-t border-neutral-100 pt-3">
                        <span className="block text-[8px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                          {isAr ? 'ترخيص الهيئة العامة للعقار' : 'REGA BROKERAGE LICENSE'}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] text-[#0C3826]">{member.license}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};
