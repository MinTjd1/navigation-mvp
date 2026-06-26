import type { ScannedBarcode } from '../types';

const SAMPLE_BARCODES: Record<string, string> = {
  'DJ1234567890': '대전광역시 서구 둔산로 100',
  'DJ2345678901': '대전광역시 유성구 대학로 99',
  'DJ3456789012': '대전광역시 동구 대전로 689',
  'DJ4567890123': '대전광역시 중구 중앙로 101',
  'DJ5678901234': '대전광역시 대덕구 한밭대로 1233',
  'DJ6789012345': '대전광역시 서구 갈마역로 21',
  'DJ7890123456': '대전광역시 유성구 봉명동 548-1',
  'DJ8901234567': '대전광역시 동구 판암동 123-4',
  'DJ9012345678': '대전광역시 중구 대흥동 보문로 20',
  'DJ0123456789': '대전광역시 대덕구 신탄진동 중앙로 15',
};

export function parseBarcode(barcodeData: string): ScannedBarcode | null {
  const encrypted = atob(barcodeData).trim();

  const addressPattern = /대전[^\n|;]*/;
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
    const addressPattern = /대전[^|;]*/;
    const match = decoded.match(addressPattern);
    return match ? match[0].trim() : null;
  } catch {
    return null;
  }
}
