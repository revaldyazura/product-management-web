import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

/**
 * RolesMultiSelect
 * Props:
 * - id: string
 * - label: string
 * - value: string[]
 * - onChange: (roles: string[]) => void
 * - options: Array<string | { value: string; label: string }>
 * - placeholder?: string
 */
export default function RolesMultiSelect({ id, label, value = [], onChange, options = [], placeholder = 'Pilih roles' }) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: capitalize(o) } : o));

  const handleChange = (event) => {
    const val = event.target.value;
    onChange?.(Array.isArray(val) ? val : []);
  };

  const removeChip = (val) => {
    onChange?.(value.filter((v) => v !== val));
  };

  return (
    <FormControl fullWidth>
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${id}-label`}
        id={id}
        multiple
        value={value}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => {
          if (!selected || selected.length === 0) {
            return <span style={{ color: '#9ca3af' }}>{placeholder}</span>;
          }
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((val) => {
                const found = opts.find((o) => o.value === val);
                const text = found ? found.label : val;
                return <Chip key={val} label={text} onMouseDown={(e) => e.stopPropagation()} onDelete={() => removeChip(val)} />;
              })}
            </Box>
          );
        }}
      >
        {opts.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            <Checkbox checked={value.indexOf(o.value) > -1} />
            <ListItemText primary={o.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
