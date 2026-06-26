import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScannedBarcode } from '../types';
import { simulateBarcodeScans, generateEncodedBarcode, decodeAndExtractAddress } from '../utils/ocrParser';
import '../styles/ocrscan.css';

export default function OCRScanPage() {
  const [scannedItems, setScannedItems] = useState<ScannedBarcode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      alert('카메라에 접근할 수 없습니다. 시뮬레이션 모드를 사용해주세요.');
    }
  }, []);

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }

  function handleSimulateScan() {
    setIsScanning(true);
    setTimeout(() => {
      const results = simulateBarcodeScans();
      setScannedItems(prev => [...prev, ...results]);
      setIsScanning(false);
    }, 1500);
  }

  function handleCaptureScan() {
    if (!videoRef.current) return;
    setIsScanning(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);

    setTimeout(() => {
      const sampleAddresses = [
        '대전광역시 서구 둔산로 100',
        '대전광역시 유성구 대학로 99',
        '대전광역시 동구 대전로 689',
      ];
      const randomAddr = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
      const newItem: ScannedBarcode = {
        raw: `SCAN-${Date.now()}`,
        address: randomAddr,
        timestamp: Date.now(),
      };
      setScannedItems(prev => [...prev, newItem]);
      setIsScanning(false);
    }, 1000);
  }

  function handleManualBarcode() {
    if (!manualInput.trim()) return;
    const encoded = generateEncodedBarcode(manualInput.trim());
    const address = decodeAndExtractAddress(encoded);
    if (address) {
      setScannedItems(prev => [...prev, {
        raw: encoded,
        address,
        timestamp: Date.now(),
      }]);
      setManualInput('');
    }
  }

  function removeItem(index: number) {
    setScannedItems(prev => prev.filter((_, i) => i !== index));
  }

  function handleProceed() {
    if (scannedItems.length === 0) {
      alert('최소 1개 이상의 주소를 스캔해주세요.');
      return;
    }
    const addresses = scannedItems.map(item => item.address);
    sessionStorage.setItem('scannedAddresses', JSON.stringify(addresses));
    stopCamera();
    navigate('/address-review');
  }

  return (
    <div className="ocr-container">
      <div className="ocr-header">
        <h1>운송장 바코드 스캔</h1>
        <p>운송장의 바코드를 스캔하면 주소가 자동으로 추출됩니다</p>
      </div>

      <div className="ocr-content">
        <div className="camera-section">
          <div className="camera-viewport">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
            ) : (
              <div className="camera-placeholder">
                <span className="camera-icon">📷</span>
                <p>카메라를 시작하거나 시뮬레이션을 사용하세요</p>
              </div>
            )}
            {isScanning && (
              <div className="scanning-overlay">
                <div className="scan-line" />
                <p>스캔 중...</p>
              </div>
            )}
          </div>

          <div className="camera-controls">
            {!cameraActive ? (
              <button className="btn-camera" onClick={startCamera}>
                📷 카메라 시작
              </button>
            ) : (
              <>
                <button className="btn-camera btn-capture" onClick={handleCaptureScan} disabled={isScanning}>
                  스캔하기
                </button>
                <button className="btn-camera btn-stop" onClick={stopCamera}>
                  카메라 중지
                </button>
              </>
            )}
            <button className="btn-camera btn-simulate" onClick={handleSimulateScan} disabled={isScanning}>
              🔄 데모 데이터 불러오기
            </button>
          </div>

          <div className="manual-barcode">
            <h3>주소 직접 입력</h3>
            <div className="manual-input-row">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                placeholder="주소를 직접 입력하세요"
                onKeyDown={e => e.key === 'Enter' && handleManualBarcode()}
              />
              <button onClick={handleManualBarcode}>추가</button>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2>스캔된 주소 ({scannedItems.length}건)</h2>
          {scannedItems.length === 0 ? (
            <div className="empty-results">
              <p>아직 스캔된 주소가 없습니다</p>
            </div>
          ) : (
            <ul className="scanned-list">
              {scannedItems.map((item, index) => (
                <li key={`${item.timestamp}-${index}`} className="scanned-item">
                  <span className="item-number">{index + 1}</span>
                  <div className="item-info">
                    <span className="item-address">{item.address}</span>
                    <span className="item-time">
                      {new Date(item.timestamp).toLocaleTimeString('ko-KR')}
                    </span>
                  </div>
                  <button className="btn-remove" onClick={() => removeItem(index)}>✕</button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="btn-proceed"
            onClick={handleProceed}
            disabled={scannedItems.length === 0}
          >
            경로 최적화하기 ({scannedItems.length}건) →
          </button>
        </div>
      </div>
    </div>
  );
}
