import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: 'rgba(255,255,255,0.7)',
                    },
                },
            },
        },
    },
});

export default theme;
