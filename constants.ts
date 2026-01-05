
import { Layer, CanvasConfig } from './types';

export const CANVAS_CONFIG: CanvasConfig = {
  width: 400,
  height: 600, // 2:3 ratio (close to 4x6 print)
  backgroundTop: '#F5F0E1',
  backgroundBottom: '#7B1E36',
  splitRatio: 0.6,
};

export const INITIAL_LAYERS: Layer[] = [
  // --- DECORATIVE BORDER ---
  {
    id: 'inner-border',
    type: 'shape',
    name: 'Inner Gold Border',
    x: 15,
    y: 15,
    style: {
      width: 370,
      height: 570,
      backgroundColor: 'transparent',
      border: '2px solid #D4AF37',
      zIndex: 50,
      pointerEvents: 'none',
    },
    className: 'border-gold-foil',
  },

  // --- HEADER SECTION ---
  {
    id: 'header-text',
    type: 'text',
    name: 'Header: Staff Pick',
    content: 'STAFF PICK',
    x: 0,
    y: 35,
    style: {
      width: 400,
      color: '#D4AF37', 
      fontSize: 28,
      fontWeight: 700,
      fontFamily: 'Cinzel, serif',
      textAlign: 'center',
      letterSpacing: '2px',
    },
    className: 'text-gold-foil',
  },
  {
    id: 'header-line-left',
    type: 'shape',
    name: 'Header Line Left',
    x: 35,
    y: 50,
    style: {
      width: 50,
      height: 2,
      backgroundColor: '#D4AF37',
    },
    className: 'bg-gold-foil',
  },
  {
    id: 'header-line-right',
    type: 'shape',
    name: 'Header Line Right',
    x: 315,
    y: 50,
    style: {
      width: 50,
      height: 2,
      backgroundColor: '#D4AF37',
    },
    className: 'bg-gold-foil',
  },

  // --- NEW: CATEGORY FIELD ---
  {
    id: 'category-label',
    type: 'text',
    name: 'Category',
    content: 'SINGLE MALT SCOTCH',
    x: 20,
    y: 70,
    style: {
      width: 360,
      color: '#666666',
      fontSize: 12,
      fontWeight: 700,
      textAlign: 'center',
      fontFamily: 'Montserrat, sans-serif',
      letterSpacing: '1px',
      textTransform: 'uppercase'
    }
  },

  // --- PRODUCT INFO ---
  {
    id: 'product-name-1',
    type: 'text',
    name: 'Brand Name',
    content: 'W.L. WELLER',
    x: 20,
    y: 95,
    style: {
      width: 360,
      height: 50, // Explicit height for AutoFit
      color: '#222222',
      fontSize: 40,
      fontWeight: 700,
      textAlign: 'center',
      fontFamily: 'Cinzel, serif',
      lineHeight: 1.1,
    },
  },
  {
    id: 'product-name-2',
    type: 'text',
    name: 'Varietal Name',
    content: 'RESERVE',
    x: 20,
    y: 145,
    style: {
      width: 360,
      height: 40, // Explicit height for AutoFit
      color: '#333333',
      fontSize: 32,
      fontWeight: 600,
      textAlign: 'center',
      fontFamily: 'Cinzel, serif',
      lineHeight: 1,
    },
  },
  {
    id: 'size-label',
    type: 'text',
    name: 'Size Label',
    content: '750ml',
    x: 300,
    y: 185,
    style: {
      color: '#555555',
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'Montserrat, sans-serif',
    },
  },

  // --- PRICING ---
  {
    id: 'was-price',
    type: 'text',
    name: 'Was Price',
    content: 'WAS $169.99',
    x: 0,
    y: 215,
    style: {
      width: 400,
      color: '#D4AF37',
      fontSize: 20,
      fontWeight: 600,
      textDecoration: 'line-through',
      textAlign: 'center',
      fontFamily: 'Montserrat, sans-serif',
    },
    className: 'text-gold-foil',
  },
  {
    id: 'active-price',
    type: 'text',
    name: 'Active Price',
    content: '$129.99',
    x: 0,
    y: 240,
    style: {
      width: 400,
      color: '#1A1A1A',
      fontSize: 88,
      fontWeight: 700,
      textAlign: 'center',
      fontFamily: 'Oswald, sans-serif',
      letterSpacing: '-1px',
    },
  },

  // --- RIBBON ---
  {
    id: 'ribbon-bg',
    type: 'shape',
    name: 'Ribbon Background',
    x: 50,
    y: 338, 
    style: {
      width: 300,
      height: 45,
      backgroundColor: '#D4AF37',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)',
      zIndex: 10,
    },
    className: 'bg-gold-foil',
  },
  {
    id: 'ribbon-text',
    type: 'text',
    name: 'Ribbon Text',
    content: 'SAVE $40.00',
    x: 50,
    y: 345,
    style: {
      width: 300,
      color: '#222222',
      fontSize: 28,
      fontWeight: 700,
      textAlign: 'center',
      zIndex: 11,
      fontFamily: 'Oswald, sans-serif',
    },
  },

  // --- GROUPED BADGE ---
  {
    id: 'badge-points-group',
    type: 'group',
    name: 'Badge: 94 Points',
    x: 35,
    y: 410,
    style: {
      width: 90,
      height: 90,
      zIndex: 20,
    },
    content: '94', // Score
  },

  // --- ADDITIONAL BADGES ---
  {
    id: 'badge-gluten-free',
    type: 'shape',
    name: 'Badge: Gluten Free',
    x: 310,
    y: 415,
    style: { display: 'none', width: 70, height: 70 },
    content: 'GF',
    className: 'bg-gold-foil',
  },
  {
    id: 'badge-organic',
    type: 'shape',
    name: 'Badge: Organic',
    x: 310,
    y: 415,
    style: { display: 'none', width: 70, height: 70 },
    content: 'Organic',
    className: 'bg-green-foil',
  },
  {
    id: 'badge-sugar-free',
    type: 'shape',
    name: 'Badge: Sugar Free',
    x: 310,
    y: 415,
    style: { display: 'none', width: 70, height: 70 },
    content: '0g Sugar',
    className: 'bg-gold-foil',
  },
  {
    id: 'badge-staff-pick',
    type: 'shape',
    name: 'Badge: Staff Pick',
    x: 310,
    y: 415,
    style: { display: 'none', width: 80, height: 80 },
    content: 'Staff',
    className: 'bg-red-foil',
  },

  // --- TASTING NOTES ---
  {
    id: 'tasting-notes',
    type: 'text',
    name: 'Tasting Notes',
    content: 'Rich Caramel • Toasted Oak\n• Vanilla Bean',
    x: 135,
    y: 425,
    style: {
      width: 250,
      maxWidth: 250,
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: 'Montserrat, sans-serif',
    },
  },

  // --- FOOTER ---
  {
    id: 'footer-logo',
    type: 'text',
    name: 'Footer Logo',
    content: 'CORKED sale',
    x: 0,
    y: 540,
    style: {
      width: 400,
      textAlign: 'center',
      color: '#D4AF37',
      fontSize: 24,
      fontWeight: 700,
      fontFamily: 'Cinzel, serif', 
    },
    className: 'text-gold-foil',
  },
];
