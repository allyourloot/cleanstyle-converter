
import React from 'react';

interface DebugPanelProps {
  debugInfo: string | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-[200px]">
      <h4 className="text-sm font-semibold mb-2">HTML Structure Debug:</h4>
      <pre>{debugInfo}</pre>
    </div>
  );
};

export default DebugPanel;

