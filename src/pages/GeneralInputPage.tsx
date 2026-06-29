import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { getKakaoApiKey, setKakaoApiKey, removeKakaoApiKey, validateKakaoKey } from '../utils/kakaoGeocode';
import 'leaflet/dist/leaflet.css';
import '../styles/generalinput.css';

interface DestinationInput {
  id: string;
  address: string;
}

const DAEJEON_CENTER = { lat: 36.3504, lng: 127.3845 };

export default function GeneralInputPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(true);
  const [destinations, setDestinations] = useState<DestinationInput[]>([
    { id: crypto.randomUUID(), address: '' },
    { id: crypto.randomUUID(), address: '' },
  ]);
  const [kakaoKey, setKakaoKey] = useState(getKakaoApiKey() || '');
  const [kakaoKeyStatus, setKakaoKeyStatus] = useState<'none' | 'valid' | 'invalid' | 'checking'>(
    getKakaoApiKey() ? 'valid' : 'none'
  );
  const [showApiSettings, setShowApiSettings] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError('브라우저가 위치 서비스를 지원하지 않습니다.');
      setLocLoading(false);
      setLocation(DAEJEON_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        setLocError('위치 권한이 거부되었습니다. 대전 중심부로 설정합니다.');
        setLocation(DAEJEON_CENTER);
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!location || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([location.lat, location.lng], 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20,
      }).addTo(map);

      const marker = L.marker([location.lat, location.lng], {
        icon: L.divIcon({
          className: 'my-location-marker',
          html: `<div style="background:#5b4cff;width:20px;height:20px;border-radius:50%;border:4px solid white;box-shadow:0 2px 8px rgba(91,76,255,0.5);"></div><div style="background:rgba(91,76,255,0.15);width:60px;height:60px;border-radius:50%;position:absolute;top:-24px;left:-24px;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map).bindPopup('현재 내 위치');
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([location.lat, location.lng], 14);
      markerRef.current?.setLatLng([location.lat, location.lng]);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [location]);

  function addDestination() {
    setDestinations(prev => [...prev, { id: crypto.randomUUID(), address: '' }]);
  }

  function removeDestination(id: string) {
    if (destinations.length <= 2) return;
    setDestinations(prev => prev.filter(d => d.id !== id));
  }

  function updateAddress(id: string, address: string) {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, address } : d));
  }

  function loadSampleData() {
    const samples = [
      '대전역',
      '대전시청',
      '카이스트',
      '충남대학교',
      '대전 성심당 본점',
    ];
    setDestinations(samples.map(address => ({
      id: crypto.randomUUID(),
      address,
    })));
  }

  async function handleSaveKakaoKey() {
    const trimmed = kakaoKey.trim();
    if (!trimmed) {
      removeKakaoApiKey();
      setKakaoKeyStatus('none');
      return;
    }
    setKakaoKeyStatus('checking');
    const valid = await validateKakaoKey(trimmed);
    if (valid) {
      setKakaoApiKey(trimmed);
      setKakaoKeyStatus('valid');
    } else {
      setKakaoKeyStatus('invalid');
    }
  }

  function handleRemoveKakaoKey() {
    removeKakaoApiKey();
    setKakaoKey('');
    setKakaoKeyStatus('none');
  }

  function handleProceed() {
    const validAddresses = destinations
      .map(d => d.address.trim())
      .filter(a => a.length > 0);

    if (validAddresses.length < 2) {
      alert('최소 2개 이상의 목적지를 입력해주세요.');
      return;
    }

    const loc = location ?? DAEJEON_CENTER;
    const originData = {
      name: '내 현재 위치',
      address: `위도 ${loc.lat.toFixed(4)}, 경도 ${loc.lng.toFixed(4)}`,
      lat: loc.lat,
      lng: loc.lng,
    };
    sessionStorage.setItem('selectedOrigin', JSON.stringify(originData));
    sessionStorage.setItem('originAddress', originData.address);

    sessionStorage.setItem('scannedAddresses', JSON.stringify(validAddresses));
    navigate('/address-review');
  }

  return (
    <div className="general-container">
      <div className="general-section location-section">
        <div className="section-header">
          <span className="section-number">1</span>
          <div>
            <h2>현재 내 위치</h2>
            <p>GPS를 통해 현재 위치를 확인합니다</p>
          </div>
        </div>

        <div className="location-map-wrapper">
          {locLoading ? (
            <div className="location-loading">
              <div className="loc-spinner" />
              <span>위치를 확인하는 중...</span>
            </div>
          ) : (
            <div className="location-map" ref={mapRef} />
          )}
        </div>

        {locError && <div className="location-error">{locError}</div>}
        {location && !locLoading && (
          <div className="location-info">
            <span className="loc-icon">📍</span>
            <span>위도 {location.lat.toFixed(4)}, 경도 {location.lng.toFixed(4)}</span>
          </div>
        )}
      </div>

      <div className="general-section destinations-section">
        <div className="section-header">
          <span className="section-number">2</span>
          <div>
            <h2>다중 목적지 설정</h2>
            <p>방문할 목적지의 주소를 입력해주세요</p>
          </div>
          <button className="btn-sample" onClick={loadSampleData}>
            📋 샘플 데이터
          </button>
        </div>

        <div className="destinations-list">
          {destinations.map((dest, index) => (
            <div key={dest.id} className="destination-row">
              <span className="dest-number">{index + 1}</span>
              <input
                type="text"
                value={dest.address}
                onChange={e => updateAddress(dest.id, e.target.value)}
                placeholder="장소명 또는 주소 (예: 대전역, 카이스트)"
                className="dest-input"
              />
              <button
                className="btn-remove-dest"
                onClick={() => removeDestination(dest.id)}
                disabled={destinations.length <= 2}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button className="btn-add-dest" onClick={addDestination}>
          + 목적지 추가
        </button>
      </div>

      <div className="general-section api-section">
        <button
          className="api-toggle-btn"
          onClick={() => setShowApiSettings(!showApiSettings)}
        >
          <span>{showApiSettings ? '▼' : '▶'} Kakao API 설정</span>
          <span className={`api-status-badge ${kakaoKeyStatus}`}>
            {kakaoKeyStatus === 'valid' ? '연결됨' :
             kakaoKeyStatus === 'invalid' ? '유효하지 않음' :
             kakaoKeyStatus === 'checking' ? '확인 중...' : '미설정'}
          </span>
        </button>

        {showApiSettings && (
          <div className="api-settings-body">
            <p className="api-desc">
              Kakao REST API 키를 입력하면 더 정확한 한국 주소 검색이 가능합니다.
              키가 없어도 기본 검색으로 동작합니다.
            </p>
            <div className="api-key-row">
              <input
                type="password"
                value={kakaoKey}
                onChange={e => { setKakaoKey(e.target.value); setKakaoKeyStatus('none'); }}
                placeholder="Kakao REST API 키 입력"
                className="api-key-input"
              />
              <button className="btn-api-save" onClick={handleSaveKakaoKey} disabled={kakaoKeyStatus === 'checking'}>
                {kakaoKeyStatus === 'checking' ? '확인 중...' : '저장'}
              </button>
              {kakaoKeyStatus === 'valid' && (
                <button className="btn-api-remove" onClick={handleRemoveKakaoKey}>삭제</button>
              )}
            </div>
            {kakaoKeyStatus === 'invalid' && (
              <p className="api-error">API 키가 유효하지 않습니다. 다시 확인해주세요.</p>
            )}
            {kakaoKeyStatus === 'valid' && (
              <p className="api-success">Kakao API가 정상적으로 연결되었습니다.</p>
            )}
          </div>
        )}
      </div>

      <div className="general-actions">
        <button className="btn-back" onClick={() => navigate('/user-type')}>
          ← 뒤로
        </button>
        <button className="btn-proceed" onClick={handleProceed}>
          경로 최적화하기 →
        </button>
      </div>
    </div>
  );
}
