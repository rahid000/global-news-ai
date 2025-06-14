import type { PlausibilityStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

interface PlausibilityBadgeProps {
  status: PlausibilityStatus;
  reason?: string;
  isDetailed?: boolean;
}

export function PlausibilityBadge({ status, reason, isDetailed = false }: PlausibilityBadgeProps) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  let IconComponent = HelpCircle;
  let textClass = "text-muted-foreground";

  switch (status) {
    case 'AI Verified':
      variant = 'default'; // Use primary color for verified
      IconComponent = ShieldCheck;
      textClass = "text-primary-foreground"; // Or a specific green if primary is not green
      break;
    case 'Potentially Misleading':
      variant = 'destructive';
      IconComponent = ShieldAlert;
      textClass = "text-destructive-foreground"; // Or a specific yellow/orange
      break;
    case 'Uncertain/Needs More Info':
      variant = 'outline';
      IconComponent = ShieldQuestion;
      textClass = "text-foreground"; // Standard text color for outline
      break;
  }
  
  const badgeContent = (
    <Badge variant={variant} className={`flex items-center gap-1.5 text-xs ${textClass} ${variant === 'default' ? 'bg-primary' : ''} ${variant === 'destructive' ? 'bg-destructive' : ''}`}>
      <IconComponent className="h-3.5 w-3.5" />
      <span>{status}</span>
    </Badge>
  );

  if (isDetailed && reason) {
    return (
      <div className="space-y-1">
        {badgeContent}
        <p className="text-xs text-muted-foreground">{reason}</p>
      </div>
    );
  }

  return badgeContent;
}
