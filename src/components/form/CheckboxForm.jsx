import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function CheckboxForm({
    label, checked, onChange, disabled = false,  color = '#111827', colorChecked = '#FF7900'
}) {
    return (
        <FormControlLabel control={
            <Checkbox checked={checked} onChange={onChange}
                disabled={disabled} 
                sx={{
                    color:  color ,
                    '&.Mui-checked': {
                        color:  colorChecked ,
                    },
                }}
            />
        }
            label={label}
        />
    );
}
