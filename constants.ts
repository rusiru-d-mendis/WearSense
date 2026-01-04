
// Fix: Import SkinTone type.
import { SkinTone } from './types';

export const OCCASIONS: string[] = [
    'Everyday Casual', 
    'Business Formal', 
    'Party / Night Out', 
    'Wedding Guest', 
    'Other'
];

// Fix: Add missing SKIN_TONES constant.
export const SKIN_TONES: SkinTone[] = [
  { name: 'Fair', hex: '#F3D7C4', undertone: 'Cool' },
  { name: 'Light', hex: '#E4B9A1', undertone: 'Neutral' },
  { name: 'Medium', hex: '#D1A28A', undertone: 'Warm' },
  { name: 'Tan', hex: '#B47D63', undertone: 'Warm' },
  { name: 'Rich', hex: '#8C5A44', undertone: 'Neutral' },
  { name: 'Deep', hex: '#5B3A29', undertone: 'Cool' },
];
