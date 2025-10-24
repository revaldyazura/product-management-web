// src/components/form/InputField.jsx
import React from 'react';
import TextField from '@mui/material/TextField';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  variant,
  fullWidth,
  outlineColor,
  focusedOutlineColor,
  labelColor,
  focusedLabelColor,
  transparentOutline = false,
  transparentHover = false,
  transparentFocus = false,
  bgColor = 'rgba(255, 255, 255, 0.5)',
  ...rest
}) {
  const borderDefault = transparentOutline ? 'transparent' : outlineColor;
  const borderHover = (transparentOutline || transparentHover) ? 'transparent' : (focusedOutlineColor || outlineColor);
  const borderFocus = (transparentOutline || transparentFocus) ? 'transparent' : (focusedOutlineColor || '#1976d2');

  const hideNotch = (transparentOutline || transparentHover || transparentFocus)
    ? {
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
    }
    : {};
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={!!error}
      // helperText={error || ' '}
      fullWidth={fullWidth}
      variant={variant || 'outlined'}
      {...rest}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: borderDefault },
          '&:hover fieldset': { borderColor: borderHover },
          '&.Mui-focused fieldset': { borderColor: borderFocus },
        },
        '& .MuiInputLabel-root': {
          color: labelColor,
          '&.Mui-focused': { color: focusedLabelColor },
        },
        ...hideNotch,
        backgroundColor: bgColor,
      }}
    />
  );
}