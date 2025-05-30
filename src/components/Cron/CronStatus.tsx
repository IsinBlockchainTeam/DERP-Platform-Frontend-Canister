import React from 'react';
import { useTranslation } from 'react-i18next';

interface CronStatusProps {
  isValid: boolean;
  description: string;
}

export const CronStatus: React.FC<CronStatusProps> = ({ isValid, description }) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'cron' });

  return (
    <div className={`text-xs p-2 rounded border transition-all duration-300 ease-in-out ${
      isValid 
        ? 'text-gray-500 bg-blue-50 border-blue-200' 
        : 'text-red-600 bg-red-50 border-red-200 shadow-sm'
    }`}>
      {!isValid && (
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-medium">{t('errors.invalidExpression')}</span>
        </div>
      )}
      <div className={isValid ? '' : 'ml-4.5'}>
        {description}
      </div>
    </div>
  );
}; 