import React from 'react';

interface ComplianceWrapperProps {
    unitPrice?: string | null;
    legalNotes?: string | null;
    className?: string;
}

/**
 * ComplianceWrapper - Renders Swiss/German specific legal data.
 * Fetches "Unit Price" (price per gram/unit) and required legal notes.
 * Designed for Mobile UI: clean, readable, high contrast.
 */
export function ComplianceWrapper({
    unitPrice,
    legalNotes,
    className = '',
}: ComplianceWrapperProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {/* Unit Price (Cena jednostkowa) */}
            {unitPrice && (
                <p className="text-[11px] font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                    Cena jednostkowa: <span className="text-black dark:text-white">{unitPrice}</span>
                </p>
            )}

            {/* Legal Note (VAT / Shipping info) */}
            <p className="text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
                {legalNotes || 'Zawiera podatek VAT (8.1%). Koszty wysyłki naliczane przy kasie.'}
            </p>

            {/* Extra Compliance Badge (Optional) */}
            <div className="mt-4 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    Swiss Legal Compliant
                </span>
            </div>
        </div>
    );
}
