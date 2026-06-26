import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, title = 'Error Loading Portfolio' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">{title}</h3>
          <p className="text-red-700 dark:text-red-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
