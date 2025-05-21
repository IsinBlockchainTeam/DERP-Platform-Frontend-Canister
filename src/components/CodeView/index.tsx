import React from 'react';

interface CodeViewProps {
  code: any;
  className?: string;
}

/**
 * CodeView component for displaying formatted code/JSON content
 */
const CodeView: React.FC<CodeViewProps> = ({ code, className = '' }) => {
  return (
    <div className={`max-w-4xl w-full flex-1 overflow-auto bg-stone-600 text-stone-100 p-4 rounded-md ${className}`}>
      <div className="h-full">
        <pre className='h-full'>
          <code>
            {typeof code === 'object' ? JSON.stringify(code, null, 2) : code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeView; 