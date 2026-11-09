import React from 'react';
import { EditorId } from '../../types';
import { AI_EDITORS } from '../../data/feedMockData';

interface EditorAvatarProps {
  editorId: EditorId;
  size?: 'sm' | 'md' | 'base' | 'lg';
  className?: string;
}

export const EditorAvatar: React.FC<EditorAvatarProps> = ({
  editorId,
  size = 'md',
  className = '',
}) => {
  const editor = AI_EDITORS[editorId] || AI_EDITORS.hwabi;

  const sizeDimensions = {
    sm: 'w-8 h-8',
    md: 'w-9.5 h-9.5',
    base: 'w-10 h-10',
    lg: 'w-11 h-11',
  }[size];

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 border border-ink/15 shadow-2xs overflow-visible ${sizeDimensions} ${className}`}
      style={{ backgroundColor: editor.avatarBg }}
    >
      {/* 
        Original Korean Dokkaebi Editor Avatar
        - Fluffy black hair with single red horn
        - Cute round red cheeks, fangs, bright smile
      */}
      <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
        <img
          src="/images/dokkaebi_character.png"
          alt={editor.name}
          className="w-full h-full object-cover object-[center_35%] scale-[1.35] pointer-events-none select-none"
          referrerPolicy="no-referrer"
          draggable={false}
        />
      </div>

      {/* Tiny Element Flame Dot on Avatar Badge identifying the editor */}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-2xs z-10"
        style={{ backgroundColor: editor.flameColor }}
      />
    </div>
  );
};
