import React from 'react';
import { Language, TeamMember } from '../../types';
import { TEAM } from '../../data/websiteContent';
import { ArrowUpRight } from 'lucide-react';

interface TeamSectionProps {
  language: Language;
  onSelectMember: (member: TeamMember) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ language, onSelectMember }) => {
  const isAr = language === 'ar';

  return (
    <section id="team" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Exact Match to Image 9) */}
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#0C3826]">
            {isAr ? 'القيادة التنفيذية وإدارة الاستثمار' : 'Leadership & Sovereign Management'}
          </h2>
          <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase">
            THE ADVISORY TEAM
          </span>
        </div>

        {/* 2-Column or 4-Column Minimalist Editorial Team List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, idx) => (
            <div
              key={member.id}
              className="space-y-4 pb-6 border-b lg:border-b-0 lg:border-r last:border-r-0 border-neutral-200 lg:pr-6"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
                0{idx + 1} / {isAr ? member.roleAr : member.role}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#0C3826] font-normal">
                {isAr ? member.nameAr : member.name}
              </h3>

              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {isAr ? member.specialtyAr : member.specialty}
              </p>

              <button
                onClick={() => onSelectMember(member)}
                className="text-xs uppercase tracking-[0.16em] text-[#0C3826] hover:text-[#A98950] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer pt-2"
              >
                <span>{isAr ? 'ترتيب محادثة خاصة' : 'Arrange a conversation'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
