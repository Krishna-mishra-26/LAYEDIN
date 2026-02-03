import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-3 border-neutral-800 border-t-white rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ borderWidth: '3px' }}
      />
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl skeleton" />
        <div className="flex-1">
          <div className="h-5 w-32 skeleton mb-2" />
          <div className="h-4 w-48 skeleton mb-1" />
          <div className="h-4 w-24 skeleton" />
        </div>
      </div>
      <div className="h-6 w-28 skeleton mb-4 rounded-full" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-36 skeleton" />
        <div className="h-4 w-28 skeleton" />
        <div className="h-4 w-32 skeleton" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 skeleton rounded-lg" />
        <div className="h-6 w-20 skeleton rounded-lg" />
        <div className="h-6 w-14 skeleton rounded-lg" />
      </div>
      <div className="pt-4 border-t border-neutral-800 flex justify-between">
        <div className="flex gap-2">
          <div className="w-4 h-4 skeleton rounded" />
          <div className="w-4 h-4 skeleton rounded" />
          <div className="w-4 h-4 skeleton rounded" />
        </div>
        <div className="h-4 w-20 skeleton" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mb-4" />
        <p className="text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
