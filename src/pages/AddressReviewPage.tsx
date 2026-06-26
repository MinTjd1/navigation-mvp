import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Address } from '../types';
import { createAddressFromString } from '../utils/geocoding';
import '../styles/addressreview.css';

export default function AddressReviewPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('scannedAddresses');
    if (!saved) {
      navigate('/user-type');
      return;
    }
    const addressStrings: string[] = JSON.parse(saved);
    const parsed = addressStrings.map((addr, i) => createAddressFromString(addr, i));
    setAddresses(parsed);
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
          <button className="btn-sort" onClick={sortByRegion}>
            🔤 지역별 정렬
          </button>
          <span className="address-count">총 {addresses.length}건</span>
        </div>
      </div>

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
        <button className="btn-optimize" onClick={handleOptimize}>
          🚀 플로이드-워셜 경로 최적화 실행
        </button>
      </div>
    </div>
  );
}
