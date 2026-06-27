import type { Address } from '../types';

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

const DAEJEON_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  '대전광역시': { lat: 36.3504, lng: 127.3845 },
  '대전': { lat: 36.3504, lng: 127.3845 },

  // 동구
  '동구': { lat: 36.3121, lng: 127.4550 },
  '인동': { lat: 36.3280, lng: 127.4410 },
  '판암동': { lat: 36.3150, lng: 127.4700 },
  '용전동': { lat: 36.3320, lng: 127.4330 },
  '대동': { lat: 36.3250, lng: 127.4530 },
  '자양동': { lat: 36.3200, lng: 127.4620 },
  '가양동': { lat: 36.3050, lng: 127.4480 },
  '삼성동': { lat: 36.3030, lng: 127.4560 },
  '홍도동': { lat: 36.3180, lng: 127.4390 },
  '천동': { lat: 36.3340, lng: 127.4600 },

  // 중구
  '중구': { lat: 36.3255, lng: 127.4214 },
  '은행동': { lat: 36.3275, lng: 127.4270 },
  '대흥동': { lat: 36.3270, lng: 127.4230 },
  '선화동': { lat: 36.3240, lng: 127.4200 },
  '유천동': { lat: 36.3190, lng: 127.4100 },
  '목동': { lat: 36.3300, lng: 127.4150 },
  '중촌동': { lat: 36.3260, lng: 127.4310 },
  '부사동': { lat: 36.3210, lng: 127.4250 },
  '태평동': { lat: 36.3230, lng: 127.4180 },
  '문화동': { lat: 36.3290, lng: 127.4160 },
  '석교동': { lat: 36.3220, lng: 127.4300 },

  // 서구
  '서구': { lat: 36.3555, lng: 127.3835 },
  '둔산동': { lat: 36.3515, lng: 127.3785 },
  '탄방동': { lat: 36.3450, lng: 127.3830 },
  '용문동': { lat: 36.3390, lng: 127.3870 },
  '갈마동': { lat: 36.3480, lng: 127.3710 },
  '월평동': { lat: 36.3590, lng: 127.3680 },
  '만년동': { lat: 36.3620, lng: 127.3750 },
  '관저동': { lat: 36.3150, lng: 127.3400 },
  '도안동': { lat: 36.3250, lng: 127.3350 },
  '변동': { lat: 36.3410, lng: 127.3900 },
  '괴정동': { lat: 36.3350, lng: 127.3780 },
  '내동': { lat: 36.3480, lng: 127.3920 },

  // 유성구
  '유성구': { lat: 36.3622, lng: 127.3561 },
  '봉명동': { lat: 36.3580, lng: 127.3500 },
  '구암동': { lat: 36.3640, lng: 127.3430 },
  '장대동': { lat: 36.3710, lng: 127.3550 },
  '노은동': { lat: 36.3750, lng: 127.3250 },
  '지족동': { lat: 36.3800, lng: 127.3350 },
  '궁동': { lat: 36.3620, lng: 127.3470 },
  '어은동': { lat: 36.3680, lng: 127.3520 },
  '도룡동': { lat: 36.3700, lng: 127.3760 },
  '전민동': { lat: 36.3760, lng: 127.3700 },
  '원내동': { lat: 36.3650, lng: 127.3580 },
  '신성동': { lat: 36.3850, lng: 127.3400 },
  '관평동': { lat: 36.4100, lng: 127.3600 },

  // 대덕구
  '대덕구': { lat: 36.3467, lng: 127.4156 },
  '오정동': { lat: 36.3650, lng: 127.4200 },
  '법동': { lat: 36.3550, lng: 127.4300 },
  '송촌동': { lat: 36.3700, lng: 127.4250 },
  '중리동': { lat: 36.3750, lng: 127.4180 },
  '신탄진동': { lat: 36.4200, lng: 127.4300 },
  '석봉동': { lat: 36.4100, lng: 127.4250 },
  '목상동': { lat: 36.3900, lng: 127.4150 },
  '대화동': { lat: 36.4267, lng: 127.4267 },
  '와동': { lat: 36.3800, lng: 127.4100 },
  '비래동': { lat: 36.4000, lng: 127.4350 },
};

function geocodeAddressFallback(address: string): { lat: number; lng: number } {
  for (const [keyword, coords] of Object.entries(DAEJEON_LOCATIONS)) {
    if (address.includes(keyword)) {
      const jitter = () => (Math.random() - 0.5) * 0.005;
      return { lat: coords.lat + jitter(), lng: coords.lng + jitter() };
    }
  }

  const hash = Array.from(address).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return {
    lat: 36.32 + (hash % 100) * 0.001,
    lng: 127.35 + (hash % 73) * 0.001,
  };
}

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number; displayName: string }> {
  const searchQuery = query.includes('대전') ? query : `대전 ${query}`;

  const params = new URLSearchParams({
    q: searchQuery,
    format: 'json',
    countrycodes: 'kr',
    limit: '1',
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
  } catch {
    // fall through to fallback
  }

  const coords = geocodeAddressFallback(query);
  return { ...coords, displayName: query };
}

export async function createAddressFromString(address: string, index: number): Promise<Address> {
  const result = await geocodeAddress(address);
  return {
    id: crypto.randomUUID(),
    address,
    lat: result.lat,
    lng: result.lng,
    label: `목적지 ${index + 1}`,
  };
}
