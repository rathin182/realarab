import React from 'react';
import { Language, TeamMember } from '../../types';
import { X, ShieldCheck, Mail } from 'lucide-react';

interface TeamDossierModalProps {
  member: TeamMember | null;
  onClose: () => void;
  language: Language;
}

export const TeamDossierModal: React.FC<TeamDossierModalProps> = ({ member, onClose, language }) => {
  const isAr = language === 'ar';

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-6 border-b border-neutral-200 pb-6 mb-6">
          <div className="w-24 h-28 sm:w-28 sm:h-36 overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
            <img
              src={member.image}
              alt={member.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter grayscale contrast-110"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#A98950] uppercase tracking-widest block">
              {member.license}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#0C3826] font-normal">
              {isAr ? member.nameAr : member.name}
            </h3>
            <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">
              {isAr ? member.roleAr : member.role}
            </p>
            <p className="text-xs text-neutral-400">{member.experience}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-light">
          <div className="p-4 bg-neutral-50 border-l-2 border-[#0C3826]">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono block mb-1">
              EXECUTIVE COMMITMENT
            </span>
            <p className="font-serif text-base italic text-[#0C3826] leading-snug">
              "{isAr ? member.personalMessageAr : member.personalMessage}"
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono block mb-1">
              CORE ADVISORY FOCUS
            </span>
            <p className="text-sm text-neutral-800">
              {isAr ? member.specialtyAr : member.specialty}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <a
            href={`mailto:${member.email}`}
            className="w-full py-3 bg-[#0C3826] hover:bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>{member.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
