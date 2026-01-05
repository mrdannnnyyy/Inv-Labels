
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

  // --- SMART HEADER (Lines + Text Combined) ---
  {
    id: 'header-combined',
    type: 'group', // Using group type to allow custom rendering in Canvas.tsx while keeping content editable
    name: 'Smart Header',
    content: 'STAFF PICK',
    x: 0,
    y: 35,
    style: {
      width: 400,
      height: 30,
      color: '#D4AF37', 
      fontSize: 28,
      fontWeight: 700,
      fontFamily: 'Cinzel, serif',
      textAlign: 'center',
      letterSpacing: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    className: 'text-gold-foil',
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
      height: 20, // Defined height
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
      height: 60, // Increased height for huge text
      color: '#222222',
      fontSize: 55, // Max font size target
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
    y: 155,
    style: {
      width: 360,
      height: 40, // Explicit height
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
    y: 195,
    style: {
      width: 80,
      height: 20,
      color: '#555555',
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'Montserrat, sans-serif',
      textAlign: 'right'
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
      height: 25,
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
      height: 90, // Explicit height for AutoFit (240 -> 330 area)
      color: '#1A1A1A',
      fontSize: 90,
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
      height: 30,
      color: '#222222',
      fontSize: 28,
      fontWeight: 700,
      textAlign: 'center',
      zIndex: 11,
      fontFamily: 'Oswald, sans-serif',
    },
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
      height: 60, // Fixed height
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
      height: 30,
      textAlign: 'center',
      color: '#D4AF37',
      fontSize: 24,
      fontWeight: 700,
      fontFamily: 'Cinzel, serif', 
    },
    className: 'text-gold-foil',
  },
];

export const STAFF_PICK_LAYERS: Layer[] = [
  // --- HEADER BLOCK ---
  {
    id: 'header-block',
    type: 'shape',
    name: 'Header Background',
    x: 0,
    y: 0,
    style: {
      width: 400,
      height: 80,
      backgroundColor: '#D32F2F', // Bold Red
      zIndex: 0
    }
  },
  {
    id: 'header-text',
    type: 'text',
    name: 'Header Text',
    content: 'STAFF PICK',
    x: 0,
    y: 20,
    style: {
      width: 400,
      height: 40,
      color: '#FFFFFF',
      fontSize: 36,
      fontWeight: 800,
      fontFamily: 'Oswald, sans-serif',
      textAlign: 'center',
      letterSpacing: '2px',
      zIndex: 1
    }
  },

  // --- PRODUCT ---
  {
    id: 'product-name-1',
    type: 'text',
    name: 'Brand Name',
    content: 'PRODUCT NAME',
    x: 20,
    y: 100,
    style: {
      width: 360,
      height: 50,
      color: '#000000',
      fontSize: 42,
      fontWeight: 800,
      textAlign: 'center',
      fontFamily: 'Oswald, sans-serif',
      zIndex: 1
    }
  },
  {
    id: 'product-name-2',
    type: 'text',
    name: 'Subtitle',
    content: 'Region / Varietal',
    x: 20,
    y: 150,
    style: {
      width: 360,
      height: 30,
      color: '#555555',
      fontSize: 20,
      fontWeight: 500,
      textAlign: 'center',
      fontFamily: 'Montserrat, sans-serif',
      textTransform: 'uppercase',
      zIndex: 1
    }
  },
  
  // --- NOTES (Handwritten feel) ---
  {
    id: 'tasting-notes',
    type: 'text',
    name: 'Tasting Notes',
    content: '"This wine blew me away. Incredible depth of flavor with hints of dark cherry and chocolate."',
    x: 40,
    y: 200,
    style: {
      width: 320,
      height: 120,
      color: '#222222',
      fontSize: 22,
      fontWeight: 400,
      fontStyle: 'italic',
      textAlign: 'center',
      fontFamily: 'Playfair Display, serif',
      lineHeight: 1.4,
      zIndex: 1
    }
  },

  // --- BOTTOM SECTION (Price) ---
  // The background bottom color will be set to Red via Config
  
  {
    id: 'was-price',
    type: 'text',
    name: 'Was Price',
    content: 'WAS $29.99',
    x: 0,
    y: 390, // Adjusted to sit just above the fold or inside the red
    style: {
      width: 400,
      height: 20,
      color: '#ffcccc',
      fontSize: 16,
      fontWeight: 600,
      textDecoration: 'line-through',
      textAlign: 'center',
      fontFamily: 'Montserrat, sans-serif',
      zIndex: 10
    }
  },
  {
    id: 'active-price',
    type: 'text',
    name: 'Active Price',
    content: '$24.99',
    x: 0,
    y: 420,
    style: {
      width: 400,
      height: 100,
      color: '#FFFFFF',
      fontSize: 90,
      fontWeight: 800,
      textAlign: 'center',
      fontFamily: 'Oswald, sans-serif',
      zIndex: 10
    }
  },
  
  {
    id: 'footer-signature',
    type: 'text',
    name: 'Signature',
    content: 'HIGHLY RECOMMENDED',
    x: 0,
    y: 530,
    style: {
      width: 400,
      height: 30,
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '3px',
      textAlign: 'center',
      fontFamily: 'Montserrat, sans-serif',
      textTransform: 'uppercase',
      zIndex: 10
    }
  }
];
