import type { Address } from '../types';

const KOREAN_LANDMARKS: Record<string, { lat: number; lng: number }> = {
  '서울특별시': { lat: 37.5665, lng: 126.9780 },
  '서울시': { lat: 37.5665, lng: 126.9780 },
  '서울': { lat: 37.5665, lng: 126.9780 },
  '강남구': { lat: 37.5172, lng: 127.0473 },
  '강북구': { lat: 37.6396, lng: 127.0257 },
  '강서구': { lat: 37.5509, lng: 126.8495 },
  '강동구': { lat: 37.5301, lng: 127.1238 },
  '종로구': { lat: 37.5735, lng: 126.9790 },
  '중구': { lat: 37.5641, lng: 126.9979 },
  '용산구': { lat: 37.5326, lng: 126.9906 },
  '성동구': { lat: 37.5634, lng: 127.0370 },
  '광진구': { lat: 37.5384, lng: 127.0822 },
  '동대문구': { lat: 37.5744, lng: 127.0396 },
  '중랑구': { lat: 37.6063, lng: 127.0928 },
  '성북구': { lat: 37.5894, lng: 127.0164 },
  '도봉구': { lat: 37.6688, lng: 127.0471 },
  '노원구': { lat: 37.6542, lng: 127.0568 },
  '은평구': { lat: 37.6176, lng: 126.9227 },
  '서대문구': { lat: 37.5791, lng: 126.9368 },
  '마포구': { lat: 37.5663, lng: 126.9014 },
  '양천구': { lat: 37.5170, lng: 126.8664 },
  '구로구': { lat: 37.4954, lng: 126.8877 },
  '금천구': { lat: 37.4519, lng: 126.9018 },
  '영등포구': { lat: 37.5264, lng: 126.8963 },
  '동작구': { lat: 37.5124, lng: 126.9393 },
  '관악구': { lat: 37.4784, lng: 126.9516 },
  '서초구': { lat: 37.4837, lng: 127.0324 },
  '송파구': { lat: 37.5145, lng: 127.1050 },
  '부산광역시': { lat: 35.1796, lng: 129.0756 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '인천광역시': { lat: 37.4563, lng: 126.7052 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '대구광역시': { lat: 35.8714, lng: 128.6014 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '대전광역시': { lat: 36.3504, lng: 127.3845 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '광주광역시': { lat: 35.1595, lng: 126.8526 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '울산광역시': { lat: 35.5384, lng: 129.3114 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '수원시': { lat: 37.2636, lng: 127.0286 },
  '수원': { lat: 37.2636, lng: 127.0286 },
  '성남시': { lat: 37.4200, lng: 127.1267 },
  '판교': { lat: 37.3948, lng: 127.1112 },
  '분당': { lat: 37.3825, lng: 127.1195 },
  '일산': { lat: 37.6580, lng: 126.7726 },
  '파주': { lat: 37.7599, lng: 126.7803 },
  '제주': { lat: 33.4996, lng: 126.5312 },
};

export function geocodeAddress(address: string): { lat: number; lng: number } {
  for (const [keyword, coords] of Object.entries(KOREAN_LANDMARKS)) {
    if (address.includes(keyword)) {
      const jitter = () => (Math.random() - 0.5) * 0.01;
      return { lat: coords.lat + jitter(), lng: coords.lng + jitter() };
    }
  }

  const hash = Array.from(address).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return {
    lat: 37.5 + (hash % 100) * 0.002 - 0.1,
    lng: 127.0 + (hash % 73) * 0.002 - 0.073,
  };
}

export function createAddressFromString(address: string, index: number): Address {
  const coords = geocodeAddress(address);
  return {
    id: crypto.randomUUID(),
    address,
    lat: coords.lat,
    lng: coords.lng,
    label: `목적지 ${index + 1}`,
  };
}
