import React from 'react';
import { Check } from 'lucide-react';

export type CustomizerStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface StepProgressProps {
  currentStep: CustomizerStep;
  onStepClick: (step: CustomizerStep) => void;
  isStepComplete: (step: CustomizerStep) => boolean;
}

const STEPS: Array<{ step: CustomizerStep; label: string; icon: string }> = [
  { step: 1, label: 'Size', icon: '📏' },
  { step: 2, label: 'Crust', icon: '🍞' },
  { step: 3, label: 'Sauce', icon: '🥫' },
  { step: 4, label: 'Cheese', icon: '🧀' },
  { step: 5, label: 'Toppings', icon: '🍄' },
  { step: 6, label: 'Extras', icon: '🥤' },
  { step: 7, label: 'Review', icon: '📋' },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onStepClick,
  isStepComplete,
}) => {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-2 sm:p-3 shadow-xs overflow-x-auto hide-scrollbar">
      <div className="flex items-center justify-between min-w-[560px] sm:min-w-0 sm:justify-around gap-1">
        {STEPS.map((s, idx) => {
          const isActive = currentStep === s.step;
          const completed = isStepComplete(s.step);

          return (
            <React.Fragment key={s.step}>
              {/* Step Button */}
              <button
                type="button"
                onClick={() => onStepClick(s.step)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-black text-white shadow-sm scale-105'
                    : completed
                    ? 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive
                      ? 'bg-white text-black'
                      : completed
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {completed && !isActive ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
                </div>
                <span>{s.label}</span>
              </button>

              {/* Connecting Divider */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 hidden sm:block ${
                    completed ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
