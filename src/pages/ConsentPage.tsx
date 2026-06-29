import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/consent.css';

interface ConsentItem {
  id: string;
  required: boolean;
  title: string;
  content: string;
  checked: boolean;
}

const CONSENT_ITEMS: Omit<ConsentItem, 'checked'>[] = [
  {
    id: 'terms',
    required: true,
    title: '서비스 이용약관 동의',
    content: `NaviOptima 서비스 이용약관

제1조 (목적)
본 약관은 NaviOptima(이하 "서비스")가 제공하는 다중 목적지 경로 최적화 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 NaviOptima가 제공하는 플로이드-워셜 알고리즘 기반 경로 최적화, 지도 표시, 네비게이션 안내 등 관련 제반 서비스를 의미합니다.
② "이용자"란 본 약관에 따라 서비스를 이용하는 회원을 말합니다.
③ "회원"이란 서비스에 개인정보를 제공하여 회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
② 서비스는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 내에 7일 전부터 공지합니다.

제4조 (서비스의 제공)
① 서비스는 다음과 같은 기능을 제공합니다:
  1. 다중 목적지 경로 최적화 (플로이드-워셜 알고리즘)
  2. 실제 도로 기반 경로 안내
  3. 운송장 바코드 OCR 스캔 (배달 기사용)
  4. 지도 기반 경로 시각화 및 턴바이턴 네비게이션
② 서비스는 대전광역시 지역에 한정하여 제공됩니다.

제5조 (서비스 이용의 제한)
서비스는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다:
  1. 타인의 정보를 도용한 경우
  2. 서비스 운영을 고의로 방해한 경우
  3. 관련 법령에 위반되는 행위를 한 경우

제6조 (면책사항)
① 서비스가 제공하는 경로 정보는 참고용이며, 실제 도로 상황과 차이가 있을 수 있습니다.
② 서비스는 무료로 제공되는 서비스의 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.`,
  },
  {
    id: 'privacy',
    required: true,
    title: '개인정보 수집·이용 동의',
    content: `개인정보 수집·이용 동의서

「개인정보 보호법」 제15조 제1항 제1호, 제17조 제1항 제1호, 제22조 제1항 및 제24조에 따라 아래와 같이 개인정보의 수집·이용에 대해 안내드리오니, 내용을 충분히 읽으신 후 동의 여부를 결정하여 주시기 바랍니다.

1. 개인정보의 수집·이용 목적
  - 회원 가입 및 관리: 회원 식별, 본인 확인, 서비스 부정이용 방지
  - 서비스 제공: 경로 최적화, 네비게이션 안내, 맞춤형 서비스 제공
  - 서비스 개선: 서비스 이용 통계 분석, 서비스 품질 향상

2. 수집하는 개인정보의 항목
  [필수항목]
  - 이메일 주소: 회원 식별 및 로그인
  - 비밀번호: 회원 인증
  - 이름: 서비스 내 표시 및 본인 확인

3. 개인정보의 보유 및 이용 기간
  - 회원 탈퇴 시까지
  - 단, 관계 법령에 의해 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보존합니다.
    · 계약 또는 청약철회 등에 관한 기록: 5년 (「전자상거래 등에서의 소비자보호에 관한 법률」)
    · 대금결제 및 재화 등의 공급에 관한 기록: 5년
    · 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
    · 접속에 관한 기록: 3개월 (「통신비밀보호법」)

4. 동의를 거부할 권리 및 거부 시 불이익
  - 이용자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
  - 다만, 필수항목에 대한 동의를 거부할 경우 회원가입 및 서비스 이용이 제한됩니다.

5. 개인정보의 파기 절차 및 방법
  - 파기 절차: 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
  - 파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

6. 개인정보 보호책임자
  - 성명: NaviOptima 개인정보보호팀
  - 연락처: privacy@navioptima.com

※ 본 동의는 「개인정보 보호법」 제15조 제1항 제1호에 근거합니다.`,
  },
  {
    id: 'location',
    required: true,
    title: '위치정보 수집·이용 동의',
    content: `위치정보 수집·이용 동의서

「위치정보의 보호 및 이용 등에 관한 법률」 제15조 제1항, 제18조 제1항에 따라 아래와 같이 위치정보의 수집·이용에 대해 안내드리오니, 내용을 충분히 읽으신 후 동의 여부를 결정하여 주시기 바랍니다.

1. 위치정보 수집·이용 목적
  - 현재 위치 기반 출발지 자동 설정
  - 최적 경로 계산 및 턴바이턴 네비게이션 안내
  - 실시간 위치 기반 경로 이탈 감지 및 재탐색

2. 수집하는 위치정보의 항목
  - GPS를 통한 단말기의 실시간 위치정보 (위도, 경도)
  - 이용자가 입력한 출발지 및 목적지 주소 정보

3. 위치정보의 보유 및 이용 기간
  - 서비스 이용 중 일시적으로 이용되며, 경로 안내 완료 후 실시간 위치정보는 즉시 파기합니다.
  - 이용자가 설정한 출발지·목적지 주소는 서비스 편의를 위해 회원 탈퇴 시까지 보관됩니다.

4. 위치정보 수집·이용·제공사실 확인자료의 보유
  - 「위치정보의 보호 및 이용 등에 관한 법률」 제16조 제2항에 따라 위치정보 수집·이용·제공사실 확인자료를 자동 기록·보존하며, 해당 자료는 6개월간 보관합니다.

5. 위치정보 이용·제공의 거부
  - 이용자는 위치정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
  - 다만, 동의를 거부할 경우 현재 위치 기반 출발지 자동 설정 및 네비게이션 안내 기능의 이용이 제한될 수 있습니다.
  - 위치정보 이용을 원하지 않을 경우, 단말기의 위치 서비스를 비활성화하거나 브라우저 설정에서 위치 권한을 거부할 수 있습니다.

6. 위치정보 관련 분쟁 조정
  - 위치정보와 관련된 분쟁에 대해 당사자 간 협의가 이루어지지 않는 경우, 방송통신위원회에 재정을 신청하거나 개인정보분쟁조정위원회에 조정을 신청할 수 있습니다.

※ 본 동의는 「위치정보의 보호 및 이용 등에 관한 법률」 제15조 및 제18조에 근거합니다.`,
  },
  {
    id: 'address',
    required: true,
    title: '주소정보 수집·이용 동의',
    content: `주소정보 수집·이용 동의서

「개인정보 보호법」 제15조 및 제17조에 따라 아래와 같이 주소정보의 수집·이용에 대해 안내드립니다.

1. 주소정보 수집·이용 목적
  - 다중 목적지 경로 최적화 서비스 제공
  - 배달 기사용 운송장 주소 자동 인식 및 경로 안내
  - 지오코딩(주소→좌표 변환)을 통한 정확한 위치 파악
  - 자주 사용하는 출발지·목적지 저장을 통한 서비스 편의 제공

2. 수집하는 주소정보의 항목
  - 이용자가 입력하는 출발지 및 목적지 주소 (지번주소, 도로명주소)
  - OCR 스캔을 통해 인식된 운송장 내 배송지 주소
  - 주소의 위도·경도 좌표 (지오코딩 결과)

3. 주소정보의 보유 및 이용 기간
  - 경로 최적화 과정에서 일시적으로 이용되며, 세션 종료 시 임시 데이터는 삭제됩니다.
  - 자주 사용하는 출발지·목적지 기록은 서비스 편의를 위해 회원 탈퇴 시까지 보관됩니다.
  - 이용자는 설정 메뉴에서 저장된 주소 기록을 언제든지 삭제할 수 있습니다.

4. 주소정보의 제3자 제공
  - 경로 계산을 위해 다음 외부 서비스에 주소 또는 좌표 정보가 전달됩니다:
    · OSRM (Open Source Routing Machine): 경로 계산 및 거리 산출
    · Kakao 로컬 API: 주소 검색 및 지오코딩
    · Nominatim (OpenStreetMap): 보조 지오코딩
  - 상기 서비스에는 익명화된 좌표 정보만 전달되며, 이용자의 개인 식별 정보는 제공되지 않습니다.

5. 동의 거부 시 불이익
  - 주소정보 수집에 동의하지 않을 경우, 경로 최적화 서비스의 핵심 기능을 이용할 수 없습니다.

※ 본 동의는 「개인정보 보호법」 제15조 제1항 제1호 및 제17조 제1항에 근거합니다.`,
  },
  {
    id: 'marketing',
    required: false,
    title: '마케팅 정보 수신 동의 (선택)',
    content: `마케팅 정보 수신 동의서

「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조에 따라 아래와 같이 마케팅 정보 수신에 대해 안내드립니다.

1. 수신 목적
  - 신규 기능 안내 및 서비스 업데이트 알림
  - 이벤트, 프로모션, 할인 혜택 안내
  - 맞춤형 서비스 추천

2. 수신 항목
  - 이메일을 통한 마케팅 정보

3. 수신 기간
  - 동의 철회 시 또는 회원 탈퇴 시까지

4. 동의 거부 및 철회
  - 마케팅 정보 수신 동의는 선택사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.
  - 동의 후에도 설정 메뉴에서 언제든지 수신을 거부할 수 있습니다.

※ 본 동의는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조에 근거합니다.`,
  },
];

export default function ConsentPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ConsentItem[]>(
    CONSENT_ITEMS.map(item => ({ ...item, checked: false }))
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const allChecked = items.every(i => i.checked);
  const requiredAllChecked = items.filter(i => i.required).every(i => i.checked);

  function toggleAll() {
    const next = !allChecked;
    setItems(items.map(i => ({ ...i, checked: next })));
  }

  function toggleItem(id: string) {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  }

  function toggleExpand(id: string) {
    setExpanded(expanded === id ? null : id);
  }

  function handleSubmit() {
    if (!requiredAllChecked) {
      alert('필수 동의 항목을 모두 체크해주세요.');
      return;
    }
    navigate('/signup');
  }

  return (
    <div className="consent-container">
      <div className="consent-card">
        <div className="consent-header">
          <h1>약관 동의</h1>
          <p>NaviOptima 서비스 이용을 위해 아래 약관에 동의해주세요.</p>
        </div>

        <div className="consent-all" onClick={toggleAll}>
          <div className={`consent-checkbox ${allChecked ? 'checked' : ''}`}>
            {allChecked && '✓'}
          </div>
          <span className="consent-all-label">전체 동의하기</span>
        </div>

        <div className="consent-divider" />

        <div className="consent-list">
          {items.map(item => (
            <div key={item.id} className="consent-item">
              <div className="consent-item-row" onClick={() => toggleItem(item.id)}>
                <div className={`consent-checkbox ${item.checked ? 'checked' : ''}`}>
                  {item.checked && '✓'}
                </div>
                <span className="consent-item-title">
                  <span className={`consent-tag ${item.required ? 'required' : 'optional'}`}>
                    {item.required ? '필수' : '선택'}
                  </span>
                  {item.title}
                </span>
                <button
                  className="consent-expand-btn"
                  onClick={e => { e.stopPropagation(); toggleExpand(item.id); }}
                >
                  {expanded === item.id ? '∧' : '∨'}
                </button>
              </div>
              {expanded === item.id && (
                <div className="consent-content">
                  <pre>{item.content}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="consent-actions">
          <button className="consent-back" onClick={() => navigate('/login')}>
            ← 뒤로
          </button>
          <button
            className="consent-submit"
            onClick={handleSubmit}
            disabled={!requiredAllChecked}
          >
            동의하고 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
