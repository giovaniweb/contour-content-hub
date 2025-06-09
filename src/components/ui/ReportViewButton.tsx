
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, FileText, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface ReportViewButtonProps {
  session: DiagnosticSession;
  onClick: () => void;
  loading?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

const ReportViewButton: React.FC<ReportViewButtonProps> = ({
  session,
  onClick,
  loading = false,
  variant = 'default',
  className
}) => {
  const isCompleted = session.isCompleted;
  const isPaid = session.isPaidData || session.isCompleted;
  const isCompact = variant === 'compact';

  const getButtonConfig = () => {
    if (isPaid) {
      return {
        gradient: 'from-green-500 via-emerald-500 to-green-600',
        hoverGradient: 'from-green-400 via-emerald-400 to-green-500',
        glowColor: 'rgba(34, 197, 94, 0.4)',
        icon: FileText,
        text: 'Ver Relatório Premium',
        badge: <Shield className="h-3 w-3" />
      };
    }
    
    if (isCompleted) {
      return {
        gradient: 'from-blue-500 via-purple-500 to-blue-600',
        hoverGradient: 'from-blue-400 via-purple-400 to-blue-500',
        glowColor: 'rgba(59, 130, 246, 0.4)',
        icon: FileText,
        text: 'Ver Relatório',
        badge: <Sparkles className="h-3 w-3" />
      };
    }

    return {
      gradient: 'from-gray-500 via-slate-500 to-gray-600',
      hoverGradient: 'from-gray-400 via-slate-400 to-gray-500',
      glowColor: 'rgba(148, 163, 184, 0.4)',
      icon: Eye,
      text: 'Continuar',
      badge: null
    };
  };

  const config = getButtonConfig();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative group", className)}
    >
      <Button
        onClick={onClick}
        disabled={loading}
        size={isCompact ? "sm" : "default"}
        className={cn(
          "relative overflow-hidden border-0 text-white font-medium transition-all duration-300",
          `bg-gradient-to-r ${config.gradient}`,
          `hover:bg-gradient-to-r hover:${config.hoverGradient}`,
          "shadow-lg hover:shadow-xl",
          isCompact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          className
        )}
        style={{
          boxShadow: `0 4px 20px ${config.glowColor}`,
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={loading ? { x: ['100%', '-100%'] } : { x: '-100%' }}
          transition={{
            duration: loading ? 1.5 : 0.6,
            repeat: loading ? Infinity : 0,
            ease: "linear"
          }}
          whileHover={{ x: '100%' }}
        />

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              <config.icon className={cn("h-4 w-4", isCompact && "h-3 w-3")} />
              {!isCompact && config.text}
              {config.badge && (
                <span className="ml-1 opacity-80">
                  {config.badge}
                </span>
              )}
            </>
          )}
        </span>

        {/* Premium indicator */}
        {isPaid && (
          <motion.div
            className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default ReportViewButton;
