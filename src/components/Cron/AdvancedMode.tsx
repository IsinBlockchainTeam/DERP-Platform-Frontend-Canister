import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AdvancedModeProps } from './types';

export const AdvancedMode: React.FC<AdvancedModeProps> = ({
  rawExpression,
  setRawExpression
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'cron' });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium min-w-16">{t('advanced.cronExpression')}</label>
        <input 
          type="text"
          className="input input-bordered input-sm font-mono flex-1"
          value={rawExpression}
          onChange={(e) => setRawExpression(e.target.value)}
          placeholder={t('advanced.placeholder')}
        />
      </div>
      
      {/* Format info */}
      <div className="text-xs text-gray-400 bg-base-50 border border-base-200 rounded p-2">
        <div><span className="font-medium">{t('advanced.formatInfo.format')}</span> {t('advanced.formatInfo.formatDescription')}</div>
        <div className="mt-1"><span className="font-medium">{t('advanced.formatInfo.examples')}</span></div>
        <div className="ml-2 mt-1 space-y-0.5">
          <div><code>0 0 8 * * *</code> - {t('advanced.formatInfo.example1')}</div>
          <div><code>0 30 9 ? * 1</code> - {t('advanced.formatInfo.example2')}</div>
        </div>
      </div>
    </div>
  );
}; 