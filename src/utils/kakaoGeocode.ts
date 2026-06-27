interface KakaoDocument {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
  category_name: string;
}

interface KakaoResponse {
  documents: KakaoDocument[];
}

interface KakaoAddressDoc {
  address_name: string;
  road_address?: { address_name: string };
  x: string;
  y: string;
}

interface KakaoAddressResponse {
  documents: KakaoAddressDoc[];
}

export interface KakaoGeoResult {
  lat: number;
  lng: number;
  placeName: string;
  roadAddress: string;
  jibunAddress: string;
}

export function getKakaoApiKey(): string | null {
  return localStorage.getItem('kakaoApiKey');
}

export function setKakaoApiKey(key: string) {
  localStorage.setItem('kakaoApiKey', key);
}

export function removeKakaoApiKey() {
  localStorage.removeItem('kakaoApiKey');
}

export async function kakaoKeywordSearch(query: string, apiKey: string): Promise<KakaoGeoResult | null> {
  const params = new URLSearchParams({
    query,
    x: '127.3845',
    y: '36.3504',
    radius: '30000',
    size: '1',
  });

  try {
    const res = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    });
    if (!res.ok) return null;
    const data: KakaoResponse = await res.json();

    if (data.documents?.length > 0) {
      const doc = data.documents[0];
      return {
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
        placeName: doc.place_name,
        roadAddress: doc.road_address_name || doc.address_name,
        jibunAddress: doc.address_name,
      };
    }
  } catch {
    // network error
  }
  return null;
}

export async function kakaoAddressSearch(query: string, apiKey: string): Promise<KakaoGeoResult | null> {
  const params = new URLSearchParams({
    query,
    size: '1',
  });

  try {
    const res = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?${params}`, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    });
    if (!res.ok) return null;
    const data: KakaoAddressResponse = await res.json();

    if (data.documents?.length > 0) {
      const doc = data.documents[0];
      return {
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
        placeName: doc.road_address?.address_name || doc.address_name,
        roadAddress: doc.road_address?.address_name || doc.address_name,
        jibunAddress: doc.address_name,
      };
    }
  } catch {
    // network error
  }
  return null;
}

export async function kakaoGeocode(query: string, apiKey: string): Promise<KakaoGeoResult | null> {
  const keywordResult = await kakaoKeywordSearch(query, apiKey);
  if (keywordResult) return keywordResult;

  return kakaoAddressSearch(query, apiKey);
}

export async function validateKakaoKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=대전역&size=1`,
      { headers: { Authorization: `KakaoAK ${apiKey}` } }
    );
    return res.ok;
  } catch {
    return false;
  }
}
