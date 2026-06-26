import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/manualinput.css';

interface DestinationInput {
  id: string;
  address: string;
}

export default function ManualInputPage() {
  const [destinations, setDestinations] = useState<DestinationInput[]>([
    { id: crypto.randomUUID(), address: '' },
    { id: crypto.randomUUID(), address: '' },
  ]);
  const navigate = useNavigate();

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

  function handleProceed() {
    const validAddresses = destinations
      .map(d => d.address.trim())
      .filter(a => a.length > 0);

    if (validAddresses.length < 2) {
      alert('최소 2개 이상의 목적지를 입력해주세요.');
      return;
    }

    sessionStorage.setItem('scannedAddresses', JSON.stringify(validAddresses));
    navigate('/address-review');
  }

  function loadSampleData() {
    const samples = [
      '서울특별시 강남구 테헤란로 152',
      '서울특별시 송파구 올림픽로 300',
      '서울특별시 마포구 월드컵북로 396',
      '서울특별시 종로구 세종대로 209',
      '서울특별시 영등포구 여의대방로 300',
    ];
    setDestinations(samples.map(address => ({
      id: crypto.randomUUID(),
      address,
    })));
  }

  return (
    <div className="manual-container">
      <div className="manual-header">
        <h1>다중 목적지 입력</h1>
        <p>방문할 목적지의 주소를 입력해주세요</p>
        <button className="btn-sample" onClick={loadSampleData}>
          📋 샘플 데이터 불러오기
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
              placeholder={`목적지 ${index + 1}의 주소를 입력하세요`}
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

      <div className="manual-actions">
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
