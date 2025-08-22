import { createTheme } from '@mui/material/styles';

// Custom theme based on the original CSS design system
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#21808D', // --color-teal-500
      light: '#32B8C6', // --color-teal-300
      dark: '#1A6873', // --color-teal-700
      contrastText: '#FCFCF9', // --color-cream-50
    },
    secondary: {
      main: '#5E5240', // --color-brown-600
      light: 'rgba(94, 82, 64, 0.12)', // --color-secondary
      dark: 'rgba(94, 82, 64, 0.25)', // --color-secondary-active
      contrastText: '#133435', // --color-slate-900
    },
    background: {
      default: '#FCFCF9', // --color-cream-50
      paper: '#FFFFFD', // --color-cream-100
    },
    text: {
      primary: '#133435', // --color-slate-900
      secondary: '#626C71', // --color-slate-500
    },
    error: {
      main: '#C0152F', // --color-red-500
      light: '#FF5459', // --color-red-400
    },
    warning: {
      main: '#A84B2F', // --color-orange-500
      light: '#E68161', // --color-orange-400
    },
    success: {
      main: '#21808D', // --color-teal-500
      light: '#32B8C6', // --color-teal-300
    },
    info: {
      main: '#626C71', // --color-slate-500
    },
    divider: 'rgba(94, 82, 64, 0.2)', // --color-border
  },
  typography: {
    fontFamily: '"FKGroteskNeue", "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '30px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 550,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 550,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '18px',
      fontWeight: 550,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '16px',
      fontWeight: 550,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '14px',
      fontWeight: 550,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8, // --radius-base
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.02)', // --shadow-xs
    '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)', // --shadow-sm
    '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)', // --shadow-md
    '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)', // --shadow-lg
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:focus-visible': {
            outline: '2px solid #21808D',
            outlineOffset: '2px',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
          },
        },
        outlined: {
          borderColor: 'rgba(94, 82, 64, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(94, 82, 64, 0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(94, 82, 64, 0.12)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
          transition: 'box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(94, 82, 64, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(94, 82, 64, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#21808D',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 500,
          fontSize: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFD',
          color: '#133435',
          borderBottom: '1px solid rgba(94, 82, 64, 0.2)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        },
      },
    },
  },
});

// Color palette for background variations (like the original CSS)
export const backgroundColors = {
  bg1: 'rgba(59, 130, 246, 0.08)', // Light blue
  bg2: 'rgba(245, 158, 11, 0.08)', // Light yellow
  bg3: 'rgba(34, 197, 94, 0.08)', // Light green
  bg4: 'rgba(239, 68, 68, 0.08)', // Light red
  bg5: 'rgba(147, 51, 234, 0.08)', // Light purple
  bg6: 'rgba(249, 115, 22, 0.08)', // Light orange
  bg7: 'rgba(236, 72, 153, 0.08)', // Light pink
  bg8: 'rgba(6, 182, 212, 0.08)', // Light cyan
}; 