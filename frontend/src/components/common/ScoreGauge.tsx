import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showGrade?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
  label = 'Match Score',
  showGrade = true,
}) => {
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColorClass = (val: number) => {
    if (val >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getGrade = (val: number) => {
    if (val >= 90) return { text: 'Excellent Match', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 80) return { text: 'Strong Match', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 65) return { text: 'Moderate Match', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (val >= 50) return { text: 'Needs Alignment', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { text: 'Low Alignment', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const grade = getGrade(normalizedScore);
  const colorClass = getColorClass(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            className="text-slate-100 stroke-slate-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {normalizedScore}
            <span className="text-lg font-semibold text-slate-400">%</span>
          </span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {showGrade && (
        <span
          className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${grade.bg}`}
        >
          {grade.text}
        </span>
      )}
    </div>
  );
};
