import React, { useState } from 'react';

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function CustomCheckbox({ id, checked, onChange, label }: CustomCheckboxProps) {
  return (
    <div className="sound-type-item">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="custom-checkbox-input"
      />
      <label htmlFor={id} className="sound-type-label">
        {label}
      </label>
    </div>
  );
}
