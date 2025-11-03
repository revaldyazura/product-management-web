import React, { useEffect, useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

/**
 * SearchAutocomplete
 * Props:
 * - id
 * - label
 * - value
 * - onSearch: function(string) called after debounce when input changes or selection
 * - freeSolo: boolean
 * - size: number of suggestions to fetch
 * - options: array of suggestion strings provided by parent (if omitted, no fetching will occur)
 */
export default function SearchAutocomplete({ id = 'search', label = 'Cari produk', value = '', onSearch = () => {}, freeSolo = true, size = 6, options: parentOptions = [], onSelectOption }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [options, setOptions] = useState(Array.isArray(parentOptions) ? parentOptions : []);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Keep inputValue in sync if value prop changes
  useEffect(() => setInputValue(value || ''), [value]);

  useEffect(() => {
    // If parent provided options, use them and do not fetch
    if (Array.isArray(parentOptions) && parentOptions.length > 0) {
      setOptions(parentOptions);
      // also notify parent about typing but do not trigger fetch here
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch((inputValue || '').trim());
      }, 200);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }

    // If parent didn't provide options, keep options empty and still notify parent of typing
    if (!Array.isArray(parentOptions) || parentOptions.length === 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch((inputValue || '').trim());
      }, 200);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, parentOptions]);

  return (
    <Autocomplete
      id={id}
      freeSolo={freeSolo}
      options={options}
      noOptionsText="Tidak ada saran"
      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.label || '')}
      inputValue={inputValue}
      onInputChange={(e, newInput) => setInputValue(newInput ?? '')}
      onChange={(e, newValue) => {
        // when selection made, call onSearch with selected label and optionally pass selected object to parent
        if (!newValue) return;
        const labelVal = typeof newValue === 'string' ? newValue : (newValue.label || '');
        setInputValue(labelVal);
        // inform parent about the raw selected object (if they need id)
        if (typeof onSelectOption === 'function') {
          const payload = typeof newValue === 'string' ? { label: labelVal } : newValue;
          try { onSelectOption(payload); } catch (err) { /* swallow */ }
        }
        onSearch(labelVal);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

SearchAutocomplete.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onSearch: PropTypes.func,
  freeSolo: PropTypes.bool,
  size: PropTypes.number,
  options: PropTypes.array,
  onSelectOption: PropTypes.func,
};
