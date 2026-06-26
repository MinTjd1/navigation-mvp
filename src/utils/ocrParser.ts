import type { ScannedBarcode } from '../types';

const SAMPLE_BARCODES: Record<string, string> = {
  'KR1234567890': '서울특별시 강남구 테헤란로 152',
  'KR2345678901': '서울특별시 송파구 올림픽로 300',
  'KR3456789012': '서울특별시 마포구 월드컵북로 396',
  'KR4567890123': '서울특별시 종로구 세종대로 209',
  'KR5678901234': '서울특별시 영등포구 여의대방로 300',
  'KR6789012345': '서울특별시 서초구 반포대로 201',
  'KR7890123456': '서울특별시 동대문구 왕산로 214',
  'KR8901234567': '서울특별시 성동구 왕십리로 83',
  'KR9012345678': '서울특별시 용산구 이태원로 29',
  'KR0123456789': '서울특별시 관악구 관악로 1',
};

export function parseBarcode(barcodeData: string): ScannedBarcode | null {
  const encrypted = atob(barcodeData).trim();

  const addressPattern = /(?:서울|부산|인천|대구|대전|광주|울산|경기|강원|충청|전라|경상|제주)[^\n|;]*/;
  const match = encrypted.match(addressPattern);
  if (match) {
    return {
      raw: barcodeData,
      address: match[0].trim(),
      timestamp: Date.now(),
    };
  }

  return null;
}

export function simulateBarcodeScans(): ScannedBarcode[] {
  return Object.entries(SAMPLE_BARCODES).map(([code, address]) => ({
    raw: code,
    address,
    timestamp: Date.now(),
  }));
}

export function generateEncodedBarcode(address: string): string {
  const payload = `TRACKING|${Date.now()}|${address}|SIGNATURE`;
  return btoa(payload);
}

export function decodeAndExtractAddress(encoded: string): string | null {
  try {
    const decoded = atob(encoded);
    const parts = decoded.split('|');
    if (parts.length >= 3) {
      return parts[2].trim();
    }
    const addressPattern = /(?:서울|부산|인천|대구|대전|광주|울산|경기|강원|충청|전라|경상|제주)[^|;]*/;
    const match = decoded.match(addressPattern);
    return match ? match[0].trim() : null;
  } catch {
    return null;
  }
}
