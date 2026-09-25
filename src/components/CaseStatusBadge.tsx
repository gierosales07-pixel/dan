import React from 'react';
import { CaseStatus } from '../types/trial';
import { Clock, Play, Pause, CheckCircle2, Archive } from 'lucide-react';

interface CaseStatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const getStatusConfig = (s: CaseStatus) => {
    switch (s) {
      case 'Pending':
        return {
          label: 'Pending',
          classes: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: Clock,
        };
      case 'Ongoing':
        return {
          label: 'Ongoing',
          classes: 'bg-sky-50 text-sky-800 border-sky-300',
          dot: 'bg-sky-500',
          icon: Play,
        };
      case 'Adjourned':
        return {
          label: 'Adjourned',
          classes: 'bg-purple-50 text-purple-800 border-purple-300',
          dot: 'bg-purple-500',
          icon: Pause,
        };
      case 'Decided':
        return {
          label: 'Decided',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          icon: CheckCircle2,
        };
      case 'Archived':
        return {
          label: 'Archived',
          classes: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-500',
          icon: Archive,
        };
      default:
        return {
          label: s,
          classes: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-xs px-3 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border whitespace-nowrap ${config.classes} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className={`${iconSizes} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
