# Practical AI (인공지능응용 실습 프로젝트)

본 저장소는 **인공지능응용(Practical AI)** 실습 과제 및 결과물을 관리하는 저장소입니다.  
독립적인 두 개의 프로그램(`study_01`, `study_02`)으로 구성되어 있습니다.

---

## 📂 프로젝트 구성 요약

| 프로젝트 | 프로그램 명 | 설명 | 기술 스택 |
| :--- | :--- | :--- | :--- |
| **[`study_01`](./study_01/)** | **손글씨 숫자 인식 프로그램** | 캔버스에 직접 숫자를 그려 머신러닝으로 인식하는 데스크톱 GUI 프로그램 | Python, Scikit-learn, Tkinter, Pillow |
| **[`study_02`](./study_02/)** | **개인용 할 일 관리 애플리케이션** | 매일 10~20개의 할 일을 스마트하게 관리하는 모던 웹 애플리케이션 | HTML5, CSS3, Vanilla JavaScript (LocalStorage) |

---

## 1. [study_01] 손글씨 숫자 인식 프로그램 (Handwritten Digit Recognizer)

사용자가 캔버스 화면에 마우스로 숫자(0~9)를 직접 그리면, 머신러닝 모델이 실시간으로 어떤 숫자인지 인식하여 결과를 표시해주는 데스크톱 애플리케이션입니다.

### ✨ 주요 기능
- **직관적인 드로잉 캔버스**: 400x400 크기의 캔버스에 자유롭게 숫자 드로잉
- **머신러닝 기반 숫자 인식**: Scikit-learn의 `digits` 데이터셋으로 학습된 Random Forest 모델을 통해 실시간 예측
- **이미지 자동 전처리**: 사용자가 그린 고해상도 이미지를 모델 입력 규격(8x8 다운샘플링 및 정규화)으로 실시간 변환
- **캔버스 초기화(Clear)**: 원클릭으로 캔버스를 지우고 새로운 숫자 테스트 가능
- **독립 실행 파일(.exe) 패키징 지원**: PyInstaller를 통한 단일 실행 파일 빌드 구성 지원

### 🛠️ 기술 스택
- **언어**: Python 3.10+
- **머신러닝 & 연산**: `scikit-learn`, `numpy`, `scipy`
- **GUI & 이미지 처리**: `tkinter`, `Pillow`
- **테스트 & 배포**: `pytest`, `pyinstaller`

### 🚀 실행 방법
```bash
# 1) 디렉터리 이동
cd study_01

# 2) 필수 라이브러리 설치
pip install -r requirements.txt

# 3) 프로그램 실행
python main.py
```

### 🧪 테스트 실행
```bash
# 단위 테스트 실행 (모델 & GUI 변환)
pytest test_digit_recognition.py test_gui.py

# 종합 수동 워크플로 시뮬레이션 테스트
python test_manual_workflow.py
```

---

## 2. [study_02] 개인용 할 일 관리 애플리케이션 (Daily Task Tracker)

매일 10~20개의 할 일을 효율적으로 관리할 수 있도록 설계된 직관적이고 반응성이 뛰어난 단일 페이지 웹 애플리케이션(SPA)입니다.

### ✨ 주요 기능
- **⚡ 키워드 기반 스마트 자동 카테고리 분류**:
  - 할 일 입력 시 키워드(예: *회의, 운동, 공부* 등)를 실시간 분석하여 카테고리(`💼 업무`, `🌿 개인`, `📚 공부`) 자동 추천
  - 사용자 환경에 맞춘 자동 분류 On/Off 스위치 및 원클릭 카테고리 순환 변경 지원
- **🌓 다크 / 라이트 모드**: 원클릭 테마 전환 및 시스템 환경 자동 감지 (설정 영구 저장)
- **⭐ 중요도 별표(Priority)**: 중요 항목 지정 및 대시보드 통계 집계, 중요 항목 모아보기 필터
- **🔍 실시간 검색**: 입력과 동시에 일치하는 할 일을 1초 만에 필터링
- **🔀 드래그 앤 드롭(Drag & Drop)**: 마우스 드래그로 우선순위 순서 자유롭게 재배치
- **🎉 동기부여 효과**: 100% 목표 달성 시 Canvas Confetti 폭죽 효과 및 연속 달성 스트릭(🔥 N일 연속) 카운터
- **📅 새 하루 시작 (아카이브)**: 완료된 항목은 보관함으로 옮기고 미완료 항목만 남겨 새로운 루틴 시작
- **💾 데이터 백업 및 복원**: JSON 파일 Export / Import 지원

### 🛠️ 기술 스택
- **Frontend**: 순수 HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: 브라우저 `localStorage` (별도 서버 설치나 DB 없이 영구 데이터 저장)
- **Zero-Dependency**: 외부 무거운 프레임워크나 빌드 도구 없이 즉시 구동

### 🚀 실행 방법
별도의 웹 서버나 패키지 설치가 필요 없습니다.
1. `study_02` 폴더로 이동합니다.
2. [`index.html`](./study_02/index.html) 파일을 웹 브라우저(Chrome, Edge, Safari 등)에서 더블 클릭하여 실행합니다.

---

## 📂 저장소 디렉터리 구조

```text
Practical_AI/
├── .gitignore               # 불필요한 빌드/캐시/대용량 파일 제외 설정
├── README.md                # 저장소 전체 안내 및 프로젝트 설명서
├── study_01/                # [프로젝트 1] 손글씨 숫자 인식 프로그램 (Python/GUI)
│   ├── digit_recognition.py # 머신러닝 모델 로드 및 예측 클래스
│   ├── gui.py               # Tkinter GUI 및 캔버스 이미지 변환 유틸리티
│   ├── main.py              # 애플리케이션 시작점 (Entry Point)
│   ├── requirements.txt     # 의존성 패키지 목록
│   ├── DigitRecognizer.spec # PyInstaller 빌드 명세서
│   ├── PYINSTALLER_BUILD.md # .exe 빌드 안내 문서
│   └── test_*.py            # 단위 테스트 및 워크플로 검증 스크립트
└── study_02/                # [프로젝트 2] 개인용 할 일 관리 웹 앱 (Web)
    ├── index.html           # 앱 구조 마크업
    ├── style.css            # 모던 UI / 다크모드 스타일시트
    ├── app.js               # 카테고리 자동분류, 드래그앤드롭 등 앱 동작 로직
    ├── PRD.md               # 제품 요구사항 정의서 (기획서)
    └── README.md            # study_02 상세 매뉴얼
```
