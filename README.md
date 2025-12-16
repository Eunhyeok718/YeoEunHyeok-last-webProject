# 무뮤 (MoodMusic)

감정 기반으로 음악을 추천·공유·발견할 수 있는 웹 사이트입니다. 순수 HTML/CSS/JavaScript만으로 동작하며, 모든 데이터는 브라우저 `localStorage`에 저장됩니다.

## 주요 화면
- 메인: 감정을 선택하면 해당 분위기의 3곡을 카드로 추천, 테마 색상 자동 변경
- 추천: 사용자가 곡을 등록하고 하트/정렬로 인기순 확인
- 랜덤: 전체 풀에서 한 곡을 랜덤으로 표시
- 소개: 서비스 개요 및 로고 노출

## 핵심 기능
- 감정별 추천: 해피/슬픔/평온/분노 4가지 감정에 따라 추천 곡과 테마 색상 적용
- 로컬 저장: 감정별 추천 결과, 추천 목록, 랜덤 선택 결과를 `localStorage`에 저장해 새로고침 후에도 유지
- 다크 모드: 헤더 토글로 라이트/다크 전환 및 상태 영구 저장
- 테마 연출: 감정별 파스텔톤 배경, 부드러운 애니메이션, 간단한 파티클 효과
- 접근성·모바일: 768px/480px 반응형 레이아웃, 터치 최적화, 44px 최소 터치 영역
- 안내 팝업: 첫 방문 시 사이트 소개 모달, “다시 보지 않기” 선택 시 이후 미표시

## 파일 구조 (주요)
- [index.html](index.html): 메인 감정 선택 및 추천 카드
- [pages/suggest.html](pages/suggest.html): 사용자 추천/하트/정렬 목록
- [pages/random.html](pages/random.html): 랜덤 한 곡 추천
- [pages/introduction.html](pages/introduction.html): 서비스 소개
- [css/styles.css](css/styles.css): 전체 스타일, 테마, 반응형
- [js/script.js](js/script.js): 공통 인터랙션, 애니메이션, 팝업, 효과
- [js/darkMode.js](js/darkMode.js): 라이트/다크 모드 상태 관리
- [js/musicData.js](js/musicData.js): 추천에 사용되는 음악 데이터

## 실행 방법
Github Pages: https://eunhyeok718.github.io/YeoEunHyeok-last-webProject

## 사용 기술
HTML, CSS, JavaScript