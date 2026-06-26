import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import type { Address, RouteResult } from '../types';
import { buildDistanceMatrix, optimizeRoute } from '../algorithms/floydWarshall';
import '../styles/navigation.css';
import 'leaflet/dist/leaflet.css';

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63', '#00bcd4'];

function createNumberedIcon(num: number, color: string) {
  return L.divIcon({
    className: 'numbered-marker',
    html: `<div style="background:${color};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${num}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function NavigationPage() {
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('reviewedAddresses');
    if (!saved) {
      navigate('/user-type');
      return;
    }

    const addresses: Address[] = JSON.parse(saved);
    const distMatrix = buildDistanceMatrix(addresses);
    const result = optimizeRoute(addresses, distMatrix);

    setTimeout(() => {
      setRouteResult(result);
      setIsOptimizing(false);
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    if (!routeResult || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      [routeResult.orderedAddresses[0].lat, routeResult.orderedAddresses[0].lng],
      12
    );
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    const coords: L.LatLng[] = [];

    routeResult.orderedAddresses.forEach((addr, i) => {
      const latlng = L.latLng(addr.lat, addr.lng);
      bounds.extend(latlng);
      coords.push(latlng);

      const color = COLORS[i % COLORS.length];
      L.marker(latlng, { icon: createNumberedIcon(i + 1, color) })
        .addTo(map)
        .bindPopup(`<b>${i + 1}번째 방문</b><br/>${addr.address}`);
    });

    L.polyline(coords, {
      color: '#3498db',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10',
    }).addTo(map);

    for (let i = 0; i < coords.length - 1; i++) {
      const mid = L.latLng(
        (coords[i].lat + coords[i + 1].lat) / 2,
        (coords[i].lng + coords[i + 1].lng) / 2
      );
      const dist = routeResult.distanceMatrix[i]?.[i + 1];
      if (dist !== undefined) {
        L.marker(mid, {
          icon: L.divIcon({
            className: 'distance-label',
            html: `<div style="background:white;padding:2px 6px;border-radius:4px;font-size:11px;border:1px solid #ccc;white-space:nowrap;">${dist.toFixed(1)}km</div>`,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          }),
        }).addTo(map);
      }
    }

    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [routeResult]);

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
          <p>모든 경유지 간 최단 경로를 계산하고 있습니다</p>
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
          <div className="algo-steps">
            <div className="algo-step active">1. 거리 행렬 생성</div>
            <div className="algo-step active">2. 플로이드-워셜 실행</div>
            <div className="algo-step">3. 최적 방문 순서 계산</div>
            <div className="algo-step">4. 경로 생성</div>
          </div>
        </div>
      </div>
    );
  }

  if (!routeResult) return null;

  return (
    <div className="navigation-container">
      <div className="nav-sidebar">
        <div className="nav-header">
          <h1>최적화된 경로</h1>
          <div className="route-summary">
            <div className="summary-item">
              <span className="summary-label">총 목적지</span>
              <span className="summary-value">{routeResult.orderedAddresses.length}곳</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">총 거리</span>
              <span className="summary-value">{routeResult.totalDistance.toFixed(1)}km</span>
            </div>
          </div>
        </div>

        <div className="route-steps">
          {routeResult.orderedAddresses.map((addr, i) => (
            <div
              key={addr.id}
              className={`route-step ${activeStep === i ? 'active' : ''}`}
              onClick={() => setActiveStep(i)}
            >
              <div
                className="step-marker"
                style={{ background: COLORS[i % COLORS.length] }}
              >
                {i + 1}
              </div>
              <div className="step-info">
                <span className="step-address">{addr.address}</span>
                {i < routeResult.orderedAddresses.length - 1 && (
                  <span className="step-distance">
                    → 다음 목적지까지{' '}
                    {routeResult.distanceMatrix[i]?.[i + 1]?.toFixed(1) ?? '?'}km
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-matrix" onClick={() => setShowMatrix(!showMatrix)}>
          {showMatrix ? '행렬 숨기기' : '📊 거리 행렬 보기'}
        </button>

        {showMatrix && (
          <div className="distance-matrix">
            <h3>플로이드-워셜 최단거리 행렬 (km)</h3>
            <div className="matrix-table-wrapper">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th></th>
                    {routeResult.orderedAddresses.map((_, i) => (
                      <th key={i}>{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routeResult.distanceMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="matrix-header">{i + 1}</td>
                      {row.map((val, j) => (
                        <td key={j} className={i === j ? 'diagonal' : ''}>
                          {val.toFixed(1)}
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
