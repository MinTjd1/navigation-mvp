import type { Address } from '../types';
import { kakaoGeocode, getKakaoApiKey } from './kakaoGeocode';

export const ORIGIN_POINTS = {
  hanjin: {
    name: '한진택배 대전물류종합센터',
    address: '대전광역시 대덕구 대화로 160',
    lat: 36.4267,
    lng: 127.4267,
  },
  coupang: {
    name: '대전 쿠팡 1센터',
    address: '대전광역시 유성구 테크노중앙로 123',
    lat: 36.4340,
    lng: 127.3380,
  },
} as const;

// Verified coordinates for well-known Daejeon landmarks
const KNOWN_PLACES: Record<string, { lat: number; lng: number; road: string }> = {
  '대전역': { lat: 36.33232, lng: 127.43464, road: '대전광역시 동구 중앙로 215' },
  '대전시청': { lat: 36.35065, lng: 127.38467, road: '대전광역시 서구 둔산로 100' },
  '카이스트': { lat: 36.37200, lng: 127.36070, road: '대전광역시 유성구 대학로 291' },
  'kaist': { lat: 36.37200, lng: 127.36070, road: '대전광역시 유성구 대학로 291' },
  '충남대학교': { lat: 36.36280, lng: 127.34478, road: '대전광역시 유성구 대학로 99' },
  '충남대': { lat: 36.36280, lng: 127.34478, road: '대전광역시 유성구 대학로 99' },
  '성심당': { lat: 36.32751, lng: 127.42720, road: '대전광역시 중구 대종로 480번길 15' },
  '성심당 본점': { lat: 36.32751, lng: 127.42720, road: '대전광역시 중구 대종로 480번길 15' },
  '대전 성심당 본점': { lat: 36.32751, lng: 127.42720, road: '대전광역시 중구 대종로 480번길 15' },
  '한밭수목원': { lat: 36.36820, lng: 127.38860, road: '대전광역시 서구 둔산대로 169' },
  '유성온천': { lat: 36.35540, lng: 127.34210, road: '대전광역시 유성구 봉명동 550' },
  '대전컨벤션센터': { lat: 36.37400, lng: 127.38560, road: '대전광역시 유성구 도룡동 397-1' },
  '엑스포과학공원': { lat: 36.37500, lng: 127.38900, road: '대전광역시 유성구 대덕대로 480' },
  '대전월드컵경기장': { lat: 36.34120, lng: 127.34560, road: '대전광역시 유성구 월드컵대로 32' },
  '으능정이거리': { lat: 36.32800, lng: 127.42700, road: '대전광역시 중구 은행동' },
  '대전대신고등학교': { lat: 36.33100, lng: 127.41500, road: '대전광역시 중구 대종로 18' },
  '보문산': { lat: 36.30660, lng: 127.41400, road: '대전광역시 중구 보문산공원로 469' },
  '중앙시장': { lat: 36.32600, lng: 127.42500, road: '대전광역시 동구 중앙로 170' },
  '대전복합터미널': { lat: 36.35170, lng: 127.43830, road: '대전광역시 동구 동서대로 1688' },
  '갤러리아타임월드': { lat: 36.35190, lng: 127.37840, road: '대전광역시 서구 대덕대로 211' },
  '타임월드': { lat: 36.35190, lng: 127.37840, road: '대전광역시 서구 대덕대로 211' },
  '둔산동': { lat: 36.35150, lng: 127.37850, road: '대전광역시 서구 둔산동' },
  '서대전역': { lat: 36.32240, lng: 127.40310, road: '대전광역시 중구 오류로 51' },
  '유성구청': { lat: 36.36230, lng: 127.35610, road: '대전광역시 유성구 대학로 211' },
  '대덕구청': { lat: 36.34670, lng: 127.41560, road: '대전광역시 대덕구 대전로 1033' },
  '동구청': { lat: 36.31210, lng: 127.45500, road: '대전광역시 동구 동구청로 147' },
  '중구청': { lat: 36.32550, lng: 127.42140, road: '대전광역시 중구 중앙로 101' },
  '서구청': { lat: 36.35550, lng: 127.38350, road: '대전광역시 서구 둔산로 100' },
  '대전교육청': { lat: 36.35740, lng: 127.38130, road: '대전광역시 서구 둔산로 155' },
  '대전시립미술관': { lat: 36.36800, lng: 127.39200, road: '대전광역시 서구 둔산대로 155' },
  '한국과학기술원': { lat: 36.37200, lng: 127.36070, road: '대전광역시 유성구 대학로 291' },
  '국립중앙과학관': { lat: 36.37400, lng: 127.37700, road: '대전광역시 유성구 대덕대로 481' },
  '대전선사박물관': { lat: 36.37100, lng: 127.32700, road: '대전광역시 유성구 노은동로 126' },
  '롯데백화점 대전점': { lat: 36.33500, lng: 127.43200, road: '대전광역시 동구 은행동 7-1' },
  '대전정부청사': { lat: 36.36100, lng: 127.37950, road: '대전광역시 서구 둔산로 120' },
  '신탄진역': { lat: 36.42000, lng: 127.43000, road: '대전광역시 대덕구 신탄진로 53' },
};

// 동-level fallback coordinates
const DONG_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  '인동': { lat: 36.3280, lng: 127.4410 }, '판암동': { lat: 36.3150, lng: 127.4700 },
  '용전동': { lat: 36.3320, lng: 127.4330 }, '가양동': { lat: 36.3050, lng: 127.4480 },
  '홍도동': { lat: 36.3180, lng: 127.4390 }, '은행동': { lat: 36.3275, lng: 127.4270 },
  '대흥동': { lat: 36.3270, lng: 127.4230 }, '선화동': { lat: 36.3240, lng: 127.4200 },
  '유천동': { lat: 36.3190, lng: 127.4100 }, '목동': { lat: 36.3300, lng: 127.4150 },
  '태평동': { lat: 36.3230, lng: 127.4180 }, '둔산동': { lat: 36.3515, lng: 127.3785 },
  '탄방동': { lat: 36.3450, lng: 127.3830 }, '용문동': { lat: 36.3390, lng: 127.3870 },
  '갈마동': { lat: 36.3480, lng: 127.3710 }, '월평동': { lat: 36.3590, lng: 127.3680 },
  '관저동': { lat: 36.3150, lng: 127.3400 }, '도안동': { lat: 36.3250, lng: 127.3350 },
  '봉명동': { lat: 36.3580, lng: 127.3500 }, '구암동': { lat: 36.3640, lng: 127.3430 },
  '노은동': { lat: 36.3750, lng: 127.3250 }, '지족동': { lat: 36.3800, lng: 127.3350 },
  '궁동': { lat: 36.3620, lng: 127.3470 }, '어은동': { lat: 36.3680, lng: 127.3520 },
  '도룡동': { lat: 36.3700, lng: 127.3760 }, '전민동': { lat: 36.3760, lng: 127.3700 },
  '관평동': { lat: 36.4100, lng: 127.3600 }, '오정동': { lat: 36.3650, lng: 127.4200 },
  '법동': { lat: 36.3550, lng: 127.4300 }, '송촌동': { lat: 36.3700, lng: 127.4250 },
  '신탄진동': { lat: 36.4200, lng: 127.4300 }, '대화동': { lat: 36.4267, lng: 127.4267 },
  '비래동': { lat: 36.4000, lng: 127.4350 },
  '동구': { lat: 36.3121, lng: 127.4550 }, '중구': { lat: 36.3255, lng: 127.4214 },
  '서구': { lat: 36.3555, lng: 127.3835 }, '유성구': { lat: 36.3622, lng: 127.3561 },
  '대덕구': { lat: 36.3467, lng: 127.4156 },
};

interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
  roadAddress: string;
}

function findKnownPlace(query: string): GeoResult | null {
  const q = query.replace(/\s/g, '').toLowerCase();
  for (const [name, info] of Object.entries(KNOWN_PLACES)) {
    if (q.includes(name.replace(/\s/g, '').toLowerCase()) ||
        name.replace(/\s/g, '').toLowerCase().includes(q)) {
      return {
        lat: info.lat,
        lng: info.lng,
        displayName: name,
        roadAddress: info.road,
      };
    }
  }
  return null;
}

function findDongLocation(query: string): GeoResult | null {
  for (const [dong, coords] of Object.entries(DONG_LOCATIONS)) {
    if (query.includes(dong)) {
      return {
        lat: coords.lat,
        lng: coords.lng,
        displayName: dong,
        roadAddress: `대전광역시 ${dong}`,
      };
    }
  }
  return null;
}

function buildRoadAddress(addr: Record<string, string>): string {
  const parts: string[] = [];
  const city = addr.city || addr.state;
  if (city) parts.push(city);
  const district = addr.borough || addr.city_district || addr.suburb || addr.quarter || addr.neighbourhood;
  if (district) parts.push(district);
  if (addr.road) {
    parts.push(addr.road + (addr.house_number ? ' ' + addr.house_number : ''));
  }
  return parts.length > 0 ? parts.join(' ') : '';
}

async function searchNominatim(query: string, bounded: boolean): Promise<GeoResult | null> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    countrycodes: 'kr',
    limit: '5',
    addressdetails: '1',
    'accept-language': 'ko',
  });
  if (bounded) {
    params.set('viewbox', '127.2,36.18,127.56,36.50');
    params.set('bounded', '1');
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    const data = await res.json();

    if (data.length > 0) {
      const best = data.find((r: { address?: { city?: string }; display_name?: string }) =>
        r.address?.city?.includes('대전') || r.display_name?.includes('대전')
      ) || data[0];

      const road = buildRoadAddress(best.address || {});
      return {
        lat: parseFloat(best.lat),
        lng: parseFloat(best.lon),
        displayName: best.display_name,
        roadAddress: road || best.display_name?.split(',').slice(0, 3).join(', ') || query,
      };
    }
  } catch {
    // network error
  }
  return null;
}

export async function geocodeAddress(query: string): Promise<GeoResult> {
  // 1. Check known places database (most accurate, instant)
  const known = findKnownPlace(query);
  if (known) return known;

  // 2. Try Kakao API (best for Korean addresses/place names)
  const kakaoKey = getKakaoApiKey();
  if (kakaoKey) {
    const kakaoResult = await kakaoGeocode(query, kakaoKey);
    if (kakaoResult) {
      return {
        lat: kakaoResult.lat,
        lng: kakaoResult.lng,
        displayName: kakaoResult.placeName,
        roadAddress: kakaoResult.roadAddress,
      };
    }
  }

  // 3. Try Nominatim with Daejeon viewbox
  const withDaejeon = query.includes('대전') ? query : `대전 ${query}`;
  let result = await searchNominatim(withDaejeon, true);
  if (result) return result;

  // 4. Try without viewbox restriction
  result = await searchNominatim(withDaejeon, false);
  if (result) return result;

  // 5. Try with full city name
  if (!query.includes('대전광역시')) {
    result = await searchNominatim(`대전광역시 ${query}`, false);
    if (result) return result;
  }

  // 6. Try original query alone
  result = await searchNominatim(query, false);
  if (result) return result;

  // 7. Fallback: 동-level lookup
  const dong = findDongLocation(query);
  if (dong) return dong;

  // 8. Final fallback: Daejeon center
  return {
    lat: 36.3504,
    lng: 127.3845,
    displayName: query,
    roadAddress: query,
  };
}

export async function createAddressFromString(address: string, index: number): Promise<Address> {
  const result = await geocodeAddress(address);
  return {
    id: crypto.randomUUID(),
    address,
    lat: result.lat,
    lng: result.lng,
    label: `목적지 ${index + 1}`,
    roadAddress: result.roadAddress,
  };
}
