import React, { useState } from 'react';
import { Currency, Language } from '../../types';
import { formatCurrencyValue } from '../../lib/currency';
import { CURRENCY_RATES } from '../../data/websiteContent';

interface FinancialAtelierProps {
  currency: Currency;
  language: Language;
}

export const FinancialAtelierSection: React.FC<FinancialAtelierProps> = ({ currency, language }) => {
  const isAr = language === 'ar';

  const [acquisitionValueSAR, setAcquisitionValueSAR] = useState<number>(20000000);
  const [downPaymentTier, setDownPaymentTier] = useState<number>(0.20);
  const [grossYield, setGrossYield] = useState<number>(8.5);

  const rate = CURRENCY_RATES[currency].rate;

  const downPaymentAmountSAR = acquisitionValueSAR * downPaymentTier;
  const financedPrincipalSAR = acquisitionValueSAR - downPaymentAmountSAR;
  const rettTaxSAR = acquisitionValueSAR * 0.05;

  // Monthly Rent from gross yield
  const annualRentSAR = acquisitionValueSAR * (grossYield / 100);
  const monthlyRentSAR = annualRentSAR / 12;

  // Indicative SAMA Murabaha monthly installment (15 year term at 4.5% profit)
  const monthlyFinanceSAR = (financedPrincipalSAR * (1 + 0.045 * 15)) / (15 * 12);
  const netMonthlyFlowSAR = monthlyRentSAR - monthlyFinanceSAR;

  const convertedAcquisition = acquisitionValueSAR * rate;
  const convertedDownPayment = downPaymentAmountSAR * rate;
  const convertedFinanced = financedPrincipalSAR * rate;
  const convertedRettTax = rettTaxSAR * rate;
  const convertedMonthlyRent = monthlyRentSAR * rate;
  const convertedNetFlow = netMonthlyFlowSAR * rate;

  return (
    <section id="financial-atelier" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#0C3826]">
            {isAr ? 'نمذجة التمويل والاستثمار' : 'Investment & Sharia Modeling'}
          </h2>
          <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase">
            FINANCIAL ATELIER & MANAGEMENT
          </span>
        </div>

        {/* 2-Column Clean Layout (Direct Match to Image 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sliders & Controls */}
          <div className="lg:col-span-6 space-y-8">
            {/* Acquisition Value */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
                  {isAr ? 'قيمة الاستحواذ' : 'ACQUISITION VALUE'}
                </span>
                <span className="font-serif text-2xl text-[#0C3826] font-normal tabular-nums">
                  {formatCurrencyValue(convertedAcquisition, currency)}
                </span>
              </div>
              <input
                type="range"
                min={5000000}
                max={100000000}
                step={1000000}
                value={acquisitionValueSAR}
                onChange={(e) => setAcquisitionValueSAR(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 accent-[#0C3826] cursor-pointer"
              />
            </div>

            {/* Down Payment Tiers */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
                  {isAr ? `الدفعة الأولى · ${Math.round(downPaymentTier * 100)}%` : `DOWN PAYMENT · ${Math.round(downPaymentTier * 100)}%`}
                </span>
                <span className="font-mono text-xs text-neutral-600 tabular-nums">
                  {formatCurrencyValue(convertedDownPayment, currency)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0.10, 0.20, 0.30].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setDownPaymentTier(tier)}
                    className={`py-2 px-3 text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                      downPaymentTier === tier
                        ? 'border-neutral-900 bg-white text-neutral-900 font-semibold'
                        : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    {Math.round(tier * 100)}% {isAr ? 'دفعة' : 'tier'}
                  </button>
                ))}
              </div>
            </div>

            {/* Projected Gross Yield */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
                  {isAr ? `العائد الإجمالي المتوقع · ${grossYield.toFixed(1)}%` : `PROJECTED GROSS YIELD · ${grossYield.toFixed(1)}%`}
                </span>
                <span className="font-mono text-xs text-neutral-600 tabular-nums">
                  {grossYield.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={5.0}
                max={16.0}
                step={0.1}
                value={grossYield}
                onChange={(e) => setGrossYield(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 accent-[#0C3826] cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Numbers Breakdown (Exact Match to Image 8) */}
          <div className="lg:col-span-6 lg:pl-8 lg:border-l border-neutral-200 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block mb-1">
                {isAr ? 'الإيراد الإيجاري الشهري المتوقع' : 'ESTIMATED MONTHLY RENTAL REVENUE'}
              </span>
              <div className="font-serif text-4xl sm:text-5xl text-[#0C3826] font-normal tabular-nums">
                {formatCurrencyValue(convertedMonthlyRent, currency)}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs font-mono">
              <div className="flex justify-between items-center text-neutral-600">
                <span>{isAr ? 'الدفعة الأولى' : 'Down payment'}</span>
                <span className="text-neutral-900 font-semibold tabular-nums">
                  {formatCurrencyValue(convertedDownPayment, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>{isAr ? 'ضريبة التصرفات العقارية (5%)' : '5% RETT tax'}</span>
                <span className="text-neutral-900 font-semibold tabular-nums">
                  {formatCurrencyValue(convertedRettTax, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>{isAr ? 'أصل مبلغ التمويل' : 'Financed principal'}</span>
                <span className="text-neutral-900 font-semibold tabular-nums">
                  {formatCurrencyValue(convertedFinanced, currency)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block mb-1">
                {isAr ? 'صافي التدفق الشهري المتوقع' : 'NET MONTHLY CASHFLOW'}
              </span>
              <div className="font-serif text-2xl text-[#0C3826] font-normal tabular-nums">
                {convertedNetFlow >= 0 ? '+' : ''}
                {formatCurrencyValue(convertedNetFlow, currency)}
                <span className="text-xs font-mono text-neutral-400 ml-2">/mo</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-light leading-relaxed pt-2">
              Indicative scenario only. SAMA-compliant Murabaha amortization model. Cashflow excludes maintenance and vacancy reserves; not a formal banking commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
