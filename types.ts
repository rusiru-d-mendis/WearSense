
export interface UserData {
  image: {
    mimeType: string;
    data: string; // base64 encoded string
  };
  occasions: string[];
}

// Types for Gemini API Response
export interface PaletteColor {
  name: string;
  hex: string;
}

export interface ColorPalette {
  name: string;
  colors: PaletteColor[];
}

export interface RecommendationItem {
  item: string;
  color: string;
  notes: string;
}

export interface StyleAnalysis {
  palette: ColorPalette[];
  recommendations: RecommendationItem[];
  summary: string;
}

// Fix: Add missing SkinTone type definition.
export interface SkinTone {
  name: string;
  hex: string;
  undertone: string;
}

// Fix: Add missing ColorOption type definition.
export interface ColorOption {
  name: string;
  hex: string;
}
