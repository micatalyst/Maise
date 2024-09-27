import '@/styles/components/Horizontal_Tab.scss';

import { useState } from 'react';

export default function Horizontal_Tab_Video_Forms({ onActiveTab }) {
  const [activeTab, setActiveTab] = useState('Legendas');

  return (
    <div className="tab-container">
      <button
        type="button"
        className={activeTab === 'Legendas' ? 'active' : ''}
        aria-pressed={activeTab === 'Legendas'}
        onClick={() => {
          setActiveTab('Legendas');
          onActiveTab('Legendas');
        }}
      >
        Legendas
      </button>
      <button
        type="button"
        className={activeTab === 'Audiodescrição' ? 'active' : ''}
        aria-pressed={activeTab === 'Audiodescrição'}
        onClick={() => {
          setActiveTab('Audiodescrição');
          onActiveTab('Audiodescrição');
        }}
      >
        Audiodescrição
      </button>
    </div>
  );
}
