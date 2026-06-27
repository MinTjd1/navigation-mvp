import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import type { Address, RouteResult } from '../types';
import { buildDistanceMatrix, optimizeRoute } from '../algorithms/floydWarshall';
import { getOSRMDistanceMatrix, getOSRMRoute } from '../utils/routing';
import type { OSRMRouteResult } from '../utils/routing';
import '../styles/navigation.css';
import 'leaflet/dist/leaflet.css';

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63', '#00bcd4'];

interface OriginInfo {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

function createNumberedIcon(num: number, color: string) {
  return L.divIcon({
    className: 'numbered-marker',
    html: `<div style="background:${color};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${num}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function createOriginIcon(isGps: boolean) {
  const bg = isGps ? '#5b4cff' : '#ff6b35';
  const shadow = isGps ? 'rgba(91,76,255,0.5)' : 'rgba(255,107,53,0.5)';
  const label = isGps ? '📍' : 'S';
  const fontSize = isGps ? '18px' : '20px';
  return L.divIcon({
    className: 'origin-marker',
    html: `<div style="background:${bg};color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${fontSize};border:4px solid white;box-shadow:0 3px 10px ${shadow};">${label}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

export default function NavigationPage() {
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [osrmRoute, setOsrmRoute] = useState<OSRMRouteResult | null>(null);
  const [origin, setOrigin] = useState<OriginInfo | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(true);
  const [optimizeStep, setOptimizeStep] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('reviewedAddresses');
    const originData = sessionStorage.getItem('selectedOrigin');
    if (!saved) {
      navigate('/user-type');
      return;
    }

    let parsedOrigin: OriginInfo | null = null;
    if (originData) {
      parsedOrigin = JSON.parse(originData);
      setOrigin(parsedOrigin);
    }

    const addresses: Address[] = JSON.parse(saved);

    async function runOptimization() {
      let allAddresses = addresses;
      if (parsedOrigin) {
        const originAddress: Address = {
          id: 'origin',
          address: parsedOrigin.address,
          lat: parsedOrigin.lat,
          lng: parsedOrigin.lng,
          label: '출발지',
        };
        allAddresses = [originAddress, ...addresses];
      }

      setOptimizeStep(1);
      let distMatrix = await getOSRMDistanceMatrix(allAddresses);
      if (!distMatrix) {
        distMatrix = buildDistanceMatrix(allAddresses);
      }

      setOptimizeStep(2);
      const result = optimizeRoute(allAddresses, distMatrix);

      setOptimizeStep(3);
      const routeData = await getOSRMRoute(result.orderedAddresses);

      if (routeData) {
        result.totalDistance = routeData.totalDistance;
      }

      setRouteResult(result);
      setOsrmRoute(routeData);
      setIsOptimizing(false);
    }

    runOptimization();
  }, [navigate]);

  useEffect(() => {
    if (!routeResult || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([36.3504, 127.3845], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    const isGpsOrigin = origin?.name === '내 현재 위치';

    routeResult.orderedAddresses.forEach((addr, i) => {
      const latlng = L.latLng(addr.lat, addr.lng);
      bounds.extend(latlng);

      const isOrigin = addr.id === 'origin';
      const icon = isOrigin
        ? createOriginIcon(isGpsOrigin)
        : createNumberedIcon(origin ? i : i + 1, COLORS[(origin ? i - 1 : i) % COLORS.length]);
      const roadInfo = addr.roadAddress && addr.roadAddress !== addr.address
        ? `<br/><span style="color:#5b4cff;font-size:12px;">📍 ${addr.roadAddress}</span>` : '';
      const popupText = isOrigin
        ? `<b>${isGpsOrigin ? '내 현재 위치' : '출발지'}</b><br/>${origin?.name}<br/>${addr.address}`
        : `<b>${origin ? i : i + 1}번째 방문</b><br/>${addr.address}${roadInfo}`;

      L.marker(latlng, { icon }).addTo(map).bindPopup(popupText);
    });

    if (osrmRoute && osrmRoute.geometry.length > 1) {
      const latlngs = osrmRoute.geometry.map(([lat, lng]) => L.latLng(lat, lng));
      latlngs.forEach(ll => bounds.extend(ll));

      L.polyline(latlngs, {
        color: '#5b4cff',
        weight: 5,
        opacity: 0.85,
      }).addTo(map);
    } else {
      const coords = routeResult.orderedAddresses.map(a => L.latLng(a.lat, a.lng));
      L.polyline(coords, {
        color: '#5b4cff',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map);
    }

    const ordered = routeResult.orderedAddresses;
    for (let i = 0; i < ordered.length - 1; i++) {
      const mid = L.latLng(
        (ordered[i].lat + ordered[i + 1].lat) / 2,
        (ordered[i].lng + ordered[i + 1].lng) / 2
      );
      const dist = osrmRoute
        ? osrmRoute.legDistances[i]
        : routeResult.distanceMatrix[i]?.[i + 1];
      if (dist !== undefined) {
        L.marker(mid, {
          icon: L.divIcon({
            className: 'distance-label',
            html: `<div style="background:white;padding:2px 8px;border-radius:6px;font-size:12px;border:1px solid #ccc;white-space:nowrap;font-weight:600;color:#333;">${dist.toFixed(1)}km</div>`,
            iconSize: [70, 24],
            iconAnchor: [35, 12],
          }),
        }).addTo(map);
      }
    }

    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [routeResult, osrmRoute, origin]);

  if (isOptimizing) {
    return (
      <div className="optimizing-container">
        <div className="optimizing-content">
          <div className="algo-animation">
            <div className="matrix-visual">
              {[0, 1, 2].map(i => (
                <div key={i} className="matrix-row">
                  {[0, 1, 2].map(j => (
                    <div key={j} className={`matrix-cell ${i === j ? 'diagonal' : ''}`}>
                      {i === j ? '0' : Math.floor(Math.random() * 20 + 1)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <h2>플로이드-워셜 알고리즘 수행 중...</h2>
          <p>대전 지역 경유지 간 최단 경로를 계산하고 있습니다</p>
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
          <div className="algo-steps">
            <div className={`algo-step ${optimizeStep >= 1 ? 'active' : ''}`}>1. 실제 도로 거리 행렬 생성 (OSRM)</div>
            <div className={`algo-step ${optimizeStep >= 2 ? 'active' : ''}`}>2. 플로이드-워셜 최적화 실행</div>
            <div className={`algo-step ${optimizeStep >= 3 ? 'active' : ''}`}>3. 실제 도로 경로 생성</div>
            <div className={`algo-step ${!isOptimizing ? 'active' : ''}`}>4. 경로 완성</div>
          </div>
        </div>
      </div>
    );
  }

  if (!routeResult) return null;

  const destCount = origin
    ? routeResult.orderedAddresses.length - 1
    : routeResult.orderedAddresses.length;

  return (
    <div className="navigation-container">
      <div className="nav-sidebar">
        <div className="nav-header">
          <h1>최적화된 경로</h1>
          {origin && (
            <div className="origin-badge">
              {origin.name === '내 현재 위치' ? '📍' : '📦'} 출발: {origin.name}
            </div>
          )}
          <div className="route-summary">
            <div className="summary-item">
              <span className="summary-label">목적지</span>
              <span className="summary-value">{destCount}곳</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">총 도로 거리</span>
              <span className="summary-value">{routeResult.totalDistance.toFixed(1)}km</span>
            </div>
          </div>
          {osrmRoute && (
            <div className="route-type-badge">🛣️ 실제 도로 기반 경로</div>
          )}
        </div>

        <div className="route-steps">
          {routeResult.orderedAddresses.map((addr, i) => {
            const isOrigin = addr.id === 'origin';
            const legDist = osrmRoute
              ? osrmRoute.legDistances[i]
              : routeResult.distanceMatrix[i]?.[i + 1];
            return (
              <div
                key={addr.id}
                className={`route-step ${activeStep === i ? 'active' : ''} ${isOrigin ? 'origin-step' : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <div
                  className="step-marker"
                  style={{ background: isOrigin ? (origin?.name === '내 현재 위치' ? '#5b4cff' : '#ff6b35') : COLORS[(origin ? i - 1 : i) % COLORS.length] }}
                >
                  {isOrigin ? 'S' : (origin ? i : i + 1)}
                </div>
                <div className="step-info">
                  <span className="step-address">
                    {isOrigin ? `[출발] ${origin?.name}` : addr.address}
                  </span>
                  {!isOrigin && addr.roadAddress && addr.roadAddress !== addr.address && (
                    <span className="step-road">📍 {addr.roadAddress}</span>
                  )}
                  {i < routeResult.orderedAddresses.length - 1 && legDist !== undefined && (
                    <span className="step-distance">
                      → 다음까지 {legDist.toFixed(1)}km
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-matrix" onClick={() => setShowMatrix(!showMatrix)}>
          {showMatrix ? '행렬 숨기기' : '📊 거리 행렬 보기'}
        </button>

        {showMatrix && (
          <div className="distance-matrix">
            <h3>플로이드-워셜 최단거리 행렬 (km)</h3>
            <p className="matrix-note">
              {osrmRoute ? '실제 도로 거리 기반' : 'Haversine 직선 거리 기반'}
            </p>
            <div className="matrix-table-wrapper">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th></th>
                    {routeResult.orderedAddresses.map((addr, i) => (
                      <th key={i}>{addr.id === 'origin' ? 'S' : (origin ? i : i + 1)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routeResult.distanceMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="matrix-header">
                        {routeResult.orderedAddresses[i]?.id === 'origin' ? 'S' : (origin ? i : i + 1)}
                      </td>
                      {row.map((val, j) => (
                        <td key={j} className={i === j ? 'diagonal' : ''}>
                          {val === Infinity ? '∞' : val.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="nav-actions">
          <button className="btn-restart" onClick={() => navigate('/user-type')}>
            새로운 경로
          </button>
          <button className="btn-start-nav" onClick={() => alert('네비게이션을 시작합니다!')}>
            🧭 네비게이션 시작
          </button>
        </div>
      </div>

      <div className="nav-map" ref={mapRef} />
    </div>
  );
}
