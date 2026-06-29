import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Address } from '../types';
import { createAddressFromString } from '../utils/geocoding';
import { useAuth } from '../context/AuthContext';
import '../styles/addressreview.css';

export default function AddressReviewPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeProgress, setGeocodeProgress] = useState({ done: 0, total: 0 });
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const saved = sessionStorage.getItem('scannedAddresses');
    if (!saved) {
      navigate('/user-type');
      return;
    }
    const addressStrings: string[] = JSON.parse(saved);

    async function geocodeAll() {
      setIsGeocoding(true);
      setGeocodeProgress({ done: 0, total: addressStrings.length });

      const results: Address[] = [];
      for (let i = 0; i < addressStrings.length; i++) {
        if (i > 0) await new Promise(r => setTimeout(r, 250));
        const addr = await createAddressFromString(addressStrings[i], i);
        results.push(addr);
        setGeocodeProgress({ done: i + 1, total: addressStrings.length });
      }
      setAddresses(results);
      setIsGeocoding(false);
    }

    geocodeAll();
  }, [navigate]);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...addresses];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setAddresses(updated);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function removeAddress(id: string) {
    setAddresses(prev => prev.filter(a => a.id !== id));
  }

  function handleOptimize() {
    if (addresses.length < 2) {
      alert('최소 2개 이상의 주소가 필요합니다.');
      return;
    }
    sessionStorage.setItem('reviewedAddresses', JSON.stringify(addresses));

    if (user) {
      const originAddr = sessionStorage.getItem('originAddress');
      const destNames = addresses.map(a => a.address);

      const prevOrigins = user.recentOrigins || [];
      const prevDests = user.recentDestinations || [];

      const newOrigins = originAddr
        ? [originAddr, ...prevOrigins.filter(o => o !== originAddr)].slice(0, 10)
        : prevOrigins;
      const newDests = [...new Set([...destNames, ...prevDests])].slice(0, 10);

      updateUser({ recentOrigins: newOrigins, recentDestinations: newDests });
    }

    navigate('/navigation');
  }

  function sortByRegion() {
    const sorted = [...addresses].sort((a, b) => a.address.localeCompare(b.address));
    setAddresses(sorted);
  }

  return (
    <div className="review-container">
      <div className="review-header">
        <h1>주소 확인 및 정렬</h1>
        <p>주소를 확인하고 드래그하여 순서를 변경할 수 있습니다</p>
        <div className="review-actions-top">
          <button className="btn-sort" onClick={sortByRegion} disabled={isGeocoding}>
            🔤 지역별 정렬
          </button>
          <span className="address-count">총 {addresses.length}건</span>
        </div>
      </div>

      {isGeocoding && (
        <div className="geocoding-progress">
          <div className="geocoding-spinner" />
          <span>주소 위치 확인 중... ({geocodeProgress.done}/{geocodeProgress.total})</span>
          <div className="geocoding-bar">
            <div
              className="geocoding-bar-fill"
              style={{ width: `${(geocodeProgress.done / geocodeProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="address-list">
        {addresses.map((addr, index) => (
          <div
            key={addr.id}
            className={`address-item ${dragIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <span className="drag-handle">⠿</span>
            <span className="addr-number">{index + 1}</span>
            <div className="addr-info">
              <span className="addr-text">{addr.address}</span>
              {addr.roadAddress && addr.roadAddress !== addr.address && (
                <span className="addr-road">📍 {addr.roadAddress}</span>
              )}
              <span className="addr-coords">
                위도: {addr.lat.toFixed(4)}, 경도: {addr.lng.toFixed(4)}
              </span>
            </div>
            <button className="btn-remove-addr" onClick={() => removeAddress(addr.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="review-actions">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <button className="btn-optimize" onClick={handleOptimize} disabled={isGeocoding || addresses.length < 2}>
          🚀 플로이드-워셜 경로 최적화 실행
        </button>
      </div>
    </div>
  );
}
