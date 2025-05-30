import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TabSwitcherProps } from './types';

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'cron' });

  return (
    <div className="flex rounded-md bg-gray-100 p-1">
      {(['guided', 'advanced'] as const).map(tab => (
        <button 
          key={tab}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            activeTab === tab 
              ? 'bg-white text-gray-700 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {t(`tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
}; 