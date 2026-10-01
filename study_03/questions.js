/**
 * 정보처리기사 필기 기출문제 은행 (Questions Database)
 * 실제 국가기술자격 '정보처리기사' 필기시험 기출문제를 바탕으로 엄선되었습니다.
 * 5개 과목: 소프트웨어 설계, 소프트웨어 개발, 데이터베이스 구축, 프로그래밍 언어 활용, 정보시스템 구축관리
 * 
 * answer_index: 0-based index (0: 보기 1, 1: 보기 2, 2: 보기 3, 3: 보기 4)
 */
const QUESTION_BANK = [
  // =========================================================================
  // 1과목: 소프트웨어 설계 (Software Design)
  // =========================================================================
  {
    id: 1,
    subject: "소프트웨어 설계",
    question: "GoF(Gang of Four) 디자인 패턴 중 생성 패턴(Creational Pattern)에 해당하는 것은?",
    options: ["Adapter 패턴", "Factory Method 패턴", "Decorator 패턴", "Observer 패턴"],
    answer_index: 1,
    explanation: "생성 패턴(Creational)에는 Abstract Factory, Builder, Factory Method, Prototype, Singleton이 있습니다. Adapter와 Decorator는 구조 패턴, Observer는 행위 패턴입니다."
  },
  {
    id: 2,
    subject: "소프트웨어 설계",
    question: "객체지향 설계 5대 원칙(SOLID) 중 '하위 클래스는 상위 클래스의 기능을 온전히 수행할 수 있어야 한다'는 원칙은?",
    options: ["단일 책임 원칙 (SRP)", "개방 폐쇄 원칙 (OCP)", "리스코프 치환 원칙 (LSP)", "인터페이스 분리 원칙 (ISP)"],
    answer_index: 2,
    explanation: "리스코프 치환 원칙(LSP, Liskov Substitution Principle)은 자식 타입은 언제나 자신의 부모 타입으로 교체될 수 있어야 한다는 원칙입니다."
  },
  {
    id: 3,
    subject: "소프트웨어 설계",
    question: "UML(Unified Modeling Language) 모델링에서 구조(정적) 다이어그램에 해당하지 않는 것은?",
    options: ["클래스 다이어그램 (Class Diagram)", "패키지 다이어그램 (Package Diagram)", "배치 다이어그램 (Deployment Diagram)", "활동 다이어그램 (Activity Diagram)"],
    answer_index: 3,
    explanation: "활동 다이어그램(Activity Diagram)은 시스템의 처리 과정이나 제어 흐름을 표현하는 행위(동적) 다이어그램입니다. 클래스, 패키지, 배치 다이어그램은 구조(정적) 다이어그램입니다."
  },
  {
    id: 4,
    subject: "소프트웨어 설계",
    question: "애자일(Agile) 소프트웨어 개발 선언문의 핵심 가치로 옳지 않은 것은?",
    options: [
      "프로세스와 도구보다 개인과 상호작용을 중시한다.",
      "포괄적인 문서화보다 작동하는 소프트웨어를 중시한다.",
      "계약 협상보다 고객과의 협력을 중시한다.",
      "계획에 따르는 것을 변화에 대응하는 것보다 중시한다."
    ],
    answer_index: 3,
    explanation: "애자일 선언문에서는 '계획에 따르기보다 변화에 대응하는 것(Responding to change over following a plan)'을 더 가치 있게 여깁니다."
  },
  {
    id: 5,
    subject: "소프트웨어 설계",
    question: "소프트웨어 아키텍처 패턴 중 서브시스템들이 공유 데이터 저장소를 통해 데이터를 교환하며, 독립적인 컴포넌트들이 저장소의 변경사항을 관찰하는 패턴은?",
    options: ["블랙보드 패턴 (Blackboard Pattern)", "파이프-필터 패턴 (Pipe-Filter Pattern)", "브로커 패턴 (Broker Pattern)", "피어 투 피어 패턴 (P2P Pattern)"],
    answer_index: 0,
    explanation: "블랙보드 패턴(Blackboard Pattern)은 해결책이 명확하지 않은 음성 인식, 신호 처리 등에 적합하며, 모든 컴포넌트가 공유 저장소(블랙보드)에 접근하여 데이터를 공유하고 협력합니다."
  },
  {
    id: 6,
    subject: "소프트웨어 설계",
    question: "소프트웨어 요구사항 분석 기법 중 사용자의 요구사항을 식별하기 위해 개발팀이 짧은 기간에 프로토타입을 만들어 고객과 소통하는 분석 기법은?",
    options: ["인터뷰 (Interview)", "프로토타이핑 (Prototyping)", "설문조사 (Survey)", "관찰법 (Observation)"],
    answer_index: 1,
    explanation: "프로토타이핑(Prototyping)은 실제 개발될 소프트웨어의 견본품(Mockup)을 빠르게 만들어 사용자의 요구사항을 직접 확인하고 구체화하는 기법입니다."
  },
  {
    id: 7,
    subject: "소프트웨어 설계",
    question: "GoF 디자인 패턴 중 '한 객체의 상태가 변경되면 그 객체에 의존하는 모든 객체에 자동으로 알림이 가고 갱신되도록 하는 1:N 의존 관계'를 정의하는 패턴은?",
    options: ["Observer 패턴", "Singleton 패턴", "Strategy 패턴", "Composite 패턴"],
    answer_index: 0,
    explanation: "옵저버(Observer) 패턴은 발행-구독 모델을 구현하여 한 객체의 상태 변화를 다수의 관찰자(Observer) 객체들에게 자동으로 통지하는 행위 디자인 패턴입니다."
  },
  {
    id: 8,
    subject: "소프트웨어 설계",
    question: "UML 관계(Relationship) 표현 중 하나의 클래스가 다른 클래스의 객체를 자신의 멤버 변수로 포함하되, 두 객체의 생명주기가 독립적인 약한 집합 관계를 나타내는 것은?",
    options: ["일반화 관계 (Generalization)", "실체화 관계 (Realization)", "집약 관계 (Aggregation)", "합성 관계 (Composition)"],
    answer_index: 2,
    explanation: "집약(Aggregation, 빈 마름모)은 포함 관계이지만 부분 객체가 독립적으로 존재할 수 있는 느슨한 관계이며, 합성(Composition, 채워진 마름모)은 부분 객체의 생명주기가 전체 객체에 종속되는 강한 결합 관계입니다."
  },
  {
    id: 9,
    subject: "소프트웨어 설계",
    question: "시스템 내 객체들의 복잡한 상호작용을 캡슐화하여 단일 중재자 객체를 통해 통신하게 함으로써 객체 간 결합도를 낮추는 행위 디자인 패턴은?",
    options: ["Mediator 패턴", "Facade 패턴", "Proxy 패턴", "Template Method 패턴"],
    answer_index: 0,
    explanation: "미디에이터(Mediator, 중재자) 패턴은 객체 간의 복잡한 다대다 통신을 하나의 중재자 객체로 집중시켜 상호 참조를 방지하고 결합도를 획기적으로 낮춥니다."
  },
  {
    id: 10,
    subject: "소프트웨어 설계",
    question: "소프트웨어 공학에서 요구사항의 분류 중 시스템이 제공해야 할 특정 기능이나 연산 작업과 직접적으로 관련된 요구사항은?",
    options: ["비기능적 요구사항 (Non-functional)", "기능적 요구사항 (Functional)", "제약사항 (Constraints)", "품질 요구사항 (Quality)"],
    answer_index: 1,
    explanation: "기능적 요구사항(Functional Requirement)은 시스템이 무엇(What)을 해야 하는지, 시스템이 입력에 대해 어떻게 반응하고 동작해야 하는지 기능을 기술한 요구사항입니다."
  },
  {
    id: 11,
    subject: "소프트웨어 설계",
    question: "럼바우(Rumbaugh) 객체지향 분석 기법에서 세 가지 모델링에 해당하지 않는 것은?",
    options: ["객체 모델링 (Object)", "동적 모델링 (Dynamic)", "기능 모델링 (Functional)", "정적 구조 모델링 (Structural)"],
    answer_index: 3,
    explanation: "럼바우 기법의 3대 모델링은 1) 객체 모델링(ERD, 객체 다이어그램), 2) 동적 모델링(상태 다이어그램), 3) 기능 모델링(DFD)입니다."
  },
  {
    id: 12,
    subject: "소프트웨어 설계",
    question: "객체지향 설계 원칙(SOLID) 중 '소프트웨어 엔티티는 확장에 대해서는 열려 있어야 하지만, 수정에 대해서는 닫혀 있어야 한다'는 원칙은?",
    options: ["SRP", "OCP", "LSP", "DIP"],
    answer_index: 1,
    explanation: "개방 폐쇄 원칙(OCP, Open-Closed Principle)은 기존의 코드를 변경하지 않고도 시스템의 기능을 확장할 수 있도록 설계해야 한다는 원칙입니다."
  },

  // =========================================================================
  // 2과목: 소프트웨어 개발 (Software Development)
  // =========================================================================
  {
    id: 13,
    subject: "소프트웨어 개발",
    question: "모듈의 독립성을 높이기 위해 결합도(Coupling)와 응집도(Cohesion)를 가장 바람직하게 구성한 것은?",
    options: [
      "결합도는 강하게, 응집도는 약하게",
      "결합도는 약하게, 응집도는 강하게",
      "결합도와 응집도 모두 강하게",
      "결합도와 응집도 모두 약하게"
    ],
    answer_index: 1,
    explanation: "소프트웨어 공학에서 좋은 모듈 설계는 모듈 간의 상호 의존성을 최소화(낮은 결합도, Low Coupling)하고, 모듈 내부 요소들의 관련성을 최대화(높은 응집도, High Cohesion)하는 것입니다."
  },
  {
    id: 14,
    subject: "소프트웨어 개발",
    question: "다음 모듈 결합도(Coupling) 종류 중 결합도가 가장 약하고(품질이 가장 우수함) 독립성이 높은 것은?",
    options: ["내용 결합도 (Content)", "공통 결합도 (Common)", "자료 결합도 (Data)", "제어 결합도 (Control)"],
    answer_index: 2,
    explanation: "결합도의 세기 순서(약함/우수 -> 강함/나쁨): 자료(Data) < 스탬프(Stamp) < 제어(Control) < 외부(External) < 공통(Common) < 내용(Content) 입니다. 자료 결합도가 가장 결합도가 낮습니다."
  },
  {
    id: 15,
    subject: "소프트웨어 개발",
    question: "모듈 응집도(Cohesion) 중 모듈 내부의 모든 기능 요소들이 단 하나의 유일한 목적을 위해 수행되는 가장 높은 응집도는?",
    options: ["기능적 응집도 (Functional)", "순차적 응집도 (Sequential)", "교환적 응집도 (Communication)", "우연적 응집도 (Coincidental)"],
    answer_index: 0,
    explanation: "기능적 응집도(Functional Cohesion)는 모듈 내부의 모든 요소가 단일 기능을 수행하기 위해 유기적으로 동작하는 가장 바람직하고 강한 응집도입니다."
  },
  {
    id: 16,
    subject: "소프트웨어 개발",
    question: "화이트박스 테스트(White Box Test) 기법에 해당하는 것은?",
    options: ["동등 분할 검사 (Equivalence Partitioning)", "경계값 분석 (Boundary Value Analysis)", "기초 경로 검사 (Basis Path Testing)", "원인-효과 그래프 (Cause-Effect Graphing)"],
    answer_index: 2,
    explanation: "기초 경로 검사, 조건 검사, 루프 검사, 데이터 흐름 검사는 프로그램의 내부 로직 구조를 직접 검사하는 화이트박스 테스트 기법입니다. 동등 분할, 경계값 분석 등은 블랙박스 테스트 기법입니다."
  },
  {
    id: 17,
    subject: "소프트웨어 개발",
    question: "블랙박스 테스트 기법 중 입력 조건의 유효값과 무효값의 경계 부근에서 오류가 발생할 확률이 높다는 점을 이용한 테스트 기법은?",
    options: ["경계값 분석 (Boundary Value Analysis)", "동등 분할 기법", "오류 예측 검사", "페어와이즈 검사"],
    answer_index: 0,
    explanation: "경계값 분석(Boundary Value Analysis)은 최소값, 최대값, 경계 바로 직전과 직후의 값 등을 테스트 케이스로 선정하는 대표적인 블랙박스 테스트 기법입니다."
  },
  {
    id: 18,
    subject: "소프트웨어 개발",
    question: "통합 테스트(Integration Test) 방식 중 하위 모듈에서 상위 모듈 방향으로 결합해 나가는 상향식(Bottom-Up) 테스트에서 상위 모듈의 역할을 대신하는 가상 컴포넌트는?",
    options: ["드라이버 (Test Driver)", "스텁 (Test Stub)", "목(Mock) 객체", "스파이(Spy)"],
    answer_index: 0,
    explanation: "상향식 통합 테스트에서는 하위 모듈을 구동할 상위 모듈이 없으므로 드라이버(Driver)를 작성합니다. 반대로 하향식(Top-Down)에서는 하위 모듈을 대신하는 스텁(Stub)이 필요합니다."
  },
  {
    id: 19,
    subject: "소프트웨어 개발",
    question: "소프트웨어의 내부 구조를 개선하여 유지보수성을 높이고 가독성을 향상시키되, 소프트웨어의 외부 동작 기능은 바꾸지 않는 활동은?",
    options: ["리팩토링 (Refactoring)", "역공학 (Reverse Engineering)", "재공학 (Re-engineering)", "패치 (Patching)"],
    answer_index: 0,
    explanation: "리팩토링(Refactoring)은 소프트웨어의 외부 동작(결과)을 변경하지 않고 내부 구조와 코드를 재구성하여 결함 가능성을 줄이고 유지보수성을 향상시키는 기법입니다."
  },
  {
    id: 20,
    subject: "소프트웨어 개발",
    question: "Git과 같은 형상 관리(SCM) 도구에서 개발자들이 독립된 작업 공간을 생성하여 작업한 후 원래의 메인 브랜치로 병합(Merge)하는 작업을 무엇이라 하는가?",
    options: ["Commit", "Branch & Merge", "Clone", "Checkout"],
    answer_index: 1,
    explanation: "형상 관리 도구에서 브랜치(Branch)를 만들어 독립적으로 기능을 구현한 후, 이를 기본 코드베이스에 병합(Merge)하는 방식을 사용합니다."
  },
  {
    id: 21,
    subject: "소프트웨어 개발",
    question: "다음 정렬 알고리즘 중 평균 시간 복잡도가 O(n log n)이 아닌 것은?",
    options: ["병합 정렬 (Merge Sort)", "퀵 정렬 (Quick Sort)", "힙 정렬 (Heap Sort)", "버블 정렬 (Bubble Sort)"],
    answer_index: 3,
    explanation: "버블 정렬(Bubble Sort), 삽입 정렬, 선택 정렬의 평균 시간 복잡도는 O(n²)입니다. 퀵, 병합, 힙 정렬의 평균 시간 복잡도는 O(n log n)입니다."
  },
  {
    id: 22,
    subject: "소프트웨어 개발",
    question: "테스트 커버리지(Test Coverage) 중 '소스 코드의 모든 조건문에서 전체 조건식이 참(True)과 거짓(False)을 최소 한 번씩 실행'하도록 측정하는 기준은?",
    options: ["구문(문장) 커버리지 (Statement)", "결정(분기) 커버리지 (Branch/Decision)", "조건 커버리지 (Condition)", "다중 조건 커버리지 (Multiple Condition)"],
    answer_index: 1,
    explanation: "결정(분기) 커버리지는 전체 조건식의 결과가 참/거짓으로 평가되는 모든 분기를 최소 한 번 이상 통과하는 커버리지입니다. (개별 조건식 각각이 참/거짓인 것은 조건 커버리지)"
  },
  {
    id: 23,
    subject: "소프트웨어 개발",
    question: "EAI(Enterprise Application Integration)의 구축 유형 중 중앙에 단일 전달 허브를 두어 데이터 전송과 메시지 변환을 전담하는 토폴로지는?",
    options: ["Point-to-Point", "Hub & Spoke", "Message Bus", "Hybrid"],
    answer_index: 1,
    explanation: "Hub & Spoke 방식은 중앙 허브 시스템이 연계 작업을 전담하는 중앙 집중형 방식으로, 유지보수가 편리하지만 허브 장애 시 전체 연계에 병목이 발생할 수 있습니다."
  },
  {
    id: 24,
    subject: "소프트웨어 개발",
    question: "소프트웨어 패키징 도구에서 불법 복제 방지 및 디지털 콘텐츠의 저작권을 보호하기 위해 적용하는 기술은?",
    options: ["DRM (Digital Rights Management)", "SSO (Single Sign-On)", "VPN (Virtual Private Network)", "IPS (Intrusion Prevention System)"],
    answer_index: 0,
    explanation: "DRM(Digital Rights Management)은 소프트웨어나 미디어 콘텐츠의 무단 복제와 배포를 방지하고 사용 권한을 제어하는 기술입니다."
  },

  // =========================================================================
  // 3과목: 데이터베이스 구축 (Database Construction)
  // =========================================================================
  {
    id: 25,
    subject: "데이터베이스 구축",
    question: "관계 데이터베이스 정규화 과정 중 '모든 도메인이 원자값(Atomic Value)으로만 구성'되도록 분해하는 정규형은?",
    options: ["제1정규형 (1NF)", "제2정규형 (2NF)", "제3정규형 (3NF)", "보이스-코드 정규형 (BCNF)"],
    answer_index: 0,
    explanation: "1NF는 테이블의 모든 속성이 원자값을 갖도록 하는 것이며, 2NF는 부분 함수 종속 제거, 3NF는 이행적 함수 종속 제거, BCNF는 결정자이면서 후보키가 아닌 것 제거입니다."
  },
  {
    id: 26,
    subject: "데이터베이스 구축",
    question: "정규화 과정에서 제2정규형(2NF)에서 제3정규형(3NF)으로 변환하기 위해 제거해야 하는 종속성은?",
    options: ["부분 함수 종속", "이행적 함수 종속 (Transitive Functional Dependency)", "다치 종속 (MVD)", "조인 종속 (JD)"],
    answer_index: 1,
    explanation: "A -> B 이고 B -> C 일 때 A -> C 가 성립하는 것을 이행적 함수 종속이라 하며, 이를 분해하여 제거하는 단계가 제3정규형(3NF)입니다."
  },
  {
    id: 27,
    subject: "데이터베이스 구축",
    question: "데이터베이스 트랜잭션의 4대 특성(ACID) 중 '트랜잭션 내의 모든 연산은 반드시 완전히 성공하거나 전혀 수행되지 않아야 한다(All or Nothing)'는 특성은?",
    options: ["원자성 (Atomicity)", "일관성 (Consistency)", "격리성 (Isolation)", "영속성 (Durability)"],
    answer_index: 0,
    explanation: "원자성(Atomicity)은 트랜잭션이 데이터베이스에 모두 반영(Commit)되거나 아니면 전혀 반영되지 않고 롤백(Rollback)되어야 한다는 All or Nothing 원칙입니다."
  },
  {
    id: 28,
    subject: "데이터베이스 구축",
    question: "순수 관계 연산자(Relational Algebra) 중 두 릴레이션에서 공통 속성을 기준으로 조건을 만족하는 튜플을 결합하여 새로운 릴레이션을 생성하는 연산자는?",
    options: ["Select (σ)", "Project (π)", "Join (⨝)", "Division (÷)"],
    answer_index: 2,
    explanation: "조인(Join, ⨝) 연산자는 공통된 속성을 기반으로 두 개 이상의 테이블을 연결하여 새로운 결과 릴레이션을 구성하는 순수 관계 연산자입니다."
  },
  {
    id: 29,
    subject: "데이터베이스 구축",
    question: "SQL 질의문에서 테이블에 새로운 컬럼(Column)을 추가할 때 사용하는 올바른 DDL 구문은?",
    options: [
      "ALTER TABLE 사원 ADD 직급 VARCHAR(20);",
      "UPDATE TABLE 사원 ADD COLUMN 직급 VARCHAR(20);",
      "MODIFY TABLE 사원 INSERT 직급 VARCHAR(20);",
      "INSERT INTO 사원 COLUMN 직급 VARCHAR(20);"
    ],
    answer_index: 0,
    explanation: "테이블의 구조를 변경하는 명령어는 ALTER TABLE 이며, 새 열을 추가할 때는 `ALTER TABLE 테이블명 ADD 컬럼명 데이터타입;` 형식을 사용합니다."
  },
  {
    id: 30,
    subject: "데이터베이스 구축",
    question: "데이터베이스에서 인덱스(Index)의 특징으로 가장 옳지 않은 것은?",
    options: [
      "검색(SELECT) 질의의 성능을 향상시킨다.",
      "테이블에 인덱스를 많이 생성할수록 INSERT, UPDATE 성능도 함께 대폭 향상된다.",
      "B-Tree, B+Tree 구조가 널리 사용된다.",
      "별도의 추가 저장 공간을 필요로 한다."
    ],
    answer_index: 1,
    explanation: "인덱스는 검색 속도를 빠르게 하지만 데이터의 삽입(INSERT), 삭제(DELETE), 갱신(UPDATE) 시마다 인덱스 트리 재구성 오버헤드가 발생하여 쓰기 성능은 오히려 저하됩니다."
  },
  {
    id: 31,
    subject: "데이터베이스 구축",
    question: "데이터베이스의 뷰(View)에 대한 설명으로 옳은 것은?",
    options: [
      "물리적으로 하드디스크에 저장되는 실제 기본 테이블이다.",
      "기본 테이블이 삭제되어도 정의된 뷰는 안전하게 남아있다.",
      "하나 이상의 테이블로부터 유도된 가상 테이블로 데이터 보안과 사용 편의성을 제공한다.",
      "모든 뷰에서는 제약 없이 INSERT, UPDATE, DELETE가 자유롭게 수행된다."
    ],
    answer_index: 2,
    explanation: "뷰(View)는 물리적으로 데이터를 저장하지 않고 정의(SQL)만 시스템 카탈로그에 저장되는 가상 테이블이며, 보안 향상과 복잡한 질의 단순화에 유용합니다."
  },
  {
    id: 32,
    subject: "데이터베이스 구축",
    question: "빅데이터 및 분산 환경에서 사용되며 고정된 스키마가 없고 대용량 비정형 데이터 처리에 최적화된 데이터베이스 유형은?",
    options: ["RDBMS", "NoSQL (Not Only SQL)", "계층형 DBMS", "네트워크 DBMS"],
    answer_index: 1,
    explanation: "NoSQL(MongoDB, Redis, Cassandra 등)은 비관계형 데이터 모델을 기반으로 하며 유연한 스키마, 수평적 확장성(Scale-out), 고성능 분산 처리를 지원합니다."
  },
  {
    id: 33,
    subject: "데이터베이스 구축",
    question: "동시성 제어(Concurrency Control)가 이루어지지 않을 때 발생할 수 있는 문제점으로 거리가 먼 것은?",
    options: ["갱신 손실 (Lost Update)", "모순성 (Inconsistency)", "연쇄 복귀 (Cascading Rollback)", "교착상태 (Deadlock) 방지"],
    answer_index: 3,
    explanation: "병행 제어가 없으면 갱신 분실, 모순성, 비원격 연쇄 복귀 등이 발생합니다. 교착상태(Deadlock)는 오히려 잠금(Locking) 기법을 부주의하게 사용할 때 유발되는 문제입니다."
  },
  {
    id: 34,
    subject: "데이터베이스 구축",
    question: "외래키(Foreign Key) 값이 참조하는 부모 테이블의 기본키(Primary Key) 값으로 반드시 존재해야 하거나 Null이어야 함을 규정하는 무결성 제약조건은?",
    options: ["개체 무결성 (Entity Integrity)", "참조 무결성 (Referential Integrity)", "도메인 무결성 (Domain Integrity)", "키 무결성 (Key Integrity)"],
    answer_index: 1,
    explanation: "참조 무결성(Referential Integrity)은 릴레이션 간의 일관성을 유지하기 위해 외래키가 유효한 부모 기본키를 참조하거나 널이어야 한다는 원칙입니다."
  },
  {
    id: 35,
    subject: "데이터베이스 구축",
    question: "데이터 모델의 3대 구성 요소로 옳은 것은?",
    options: [
      "개체(Entity), 속성(Attribute), 관계(Relationship)",
      "연산(Operation), 구조(Structure), 제약조건(Constraint)",
      "개념 모델, 논리 모델, 물리 모델",
      "기본키, 외래키, 대체키"
    ],
    answer_index: 1,
    explanation: "데이터 모델의 형식적 3요소는 구조(Structure), 연산(Operation), 제약조건(Constraint)입니다. (데이터베이스 개념 구성요소인 개체, 속성, 관계와 구분 필요)"
  },
  {
    id: 36,
    subject: "데이터베이스 구축",
    question: "SQL 명령어 중 ROLLBACK에 대한 설명으로 옳은 것은?",
    options: [
      "트랜잭션 내에서 변경된 내용을 데이터베이스에 영구적으로 반영한다.",
      "트랜잭션의 실행 도중 오류가 발생했을 때 변경 사항을 취소하고 이전 상태로 되돌린다.",
      "테이블의 스키마와 인덱스를 영구 삭제한다.",
      "사용자에게 부여된 권한을 회수한다."
    ],
    answer_index: 1,
    explanation: "ROLLBACK 명령어는 트랜잭션의 실행 실패나 취소 시 이전 세이브포인트 또는 트랜잭션 시작 직전의 일관된 상태로 되돌립니다."
  },

  // =========================================================================
  // 4과목: 프로그래밍 언어 활용 (Programming Language Usage)
  // =========================================================================
  {
    id: 37,
    subject: "프로그래밍 언어 활용",
    question: "C 언어에서 아래 코드 실행 시 출력되는 결과는?\nint a = 5;\nprintf(\"%d\", a++ + ++a);",
    options: ["11", "12", "13", "14"],
    answer_index: 1,
    explanation: "a++는 현재 값 5를 사용하고 난 뒤 6으로 증가하며, ++a는 다시 1 증가하여 7이 된 후 더해지므로 5 + 7 = 12 가 됩니다."
  },
  {
    id: 38,
    subject: "프로그래밍 언어 활용",
    question: "Java에서 상속(Inheritance) 관계에 있는 자식 클래스가 부모 클래스의 메서드를 동일한 시그니처로 재정의하는 객체지향 개념은?",
    options: ["메서드 오버로딩 (Method Overloading)", "메서드 오버라이딩 (Method Overriding)", "캡슐화 (Encapsulation)", "정보 은닉 (Information Hiding)"],
    answer_index: 1,
    explanation: "오버라이딩(Overriding)은 상속받은 상위 클래스의 메서드를 하위 클래스에서 입맛에 맞게 재정의하는 것입니다. (오버로딩은 같은 이름에 매개변수가 다른 메서드를 다수 정의하는 것)"
  },
  {
    id: 39,
    subject: "프로그래밍 언어 활용",
    question: "Python에서 다음 코드의 실행 결과는?\nx = [1, 2, 3, 4, 5]\nprint(x[1:4])",
    options: ["[1, 2, 3]", "[2, 3, 4]", "[2, 3, 4, 5]", "[1, 2, 3, 4]"],
    answer_index: 1,
    explanation: "파이썬 슬라이싱 `x[start:end]`는 start 인덱스(1번 인덱스인 2)부터 end-1 인덱스(3번 인덱스인 4)까지 추출하므로 `[2, 3, 4]`가 출력됩니다."
  },
  {
    id: 40,
    subject: "프로그래밍 언어 활용",
    question: "OSI 7계층 참조 모델 중 데이터의 암호화, 압축, 코드 변환(ASCII, EBCDIC 등)을 담당하는 계층은?",
    options: ["표현 계층 (Presentation Layer)", "세션 계층 (Session Layer)", "응용 계층 (Application Layer)", "전송 계층 (Transport Layer)"],
    answer_index: 0,
    explanation: "표현 계층(Presentation Layer, 6계층)은 송수신자 간 서로 다른 데이터 표현 방식을 상호 변환하고, 데이터 암호화 및 압축을 처리합니다."
  },
  {
    id: 41,
    subject: "프로그래밍 언어 활용",
    question: "TCP와 UDP의 비교 설명으로 가장 옳은 것은?",
    options: [
      "TCP는 비연결형 프로토콜이며 신뢰성을 보장하지 않는다.",
      "UDP는 3-Way Handshake를 통해 가상 회선을 수립하고 전송한다.",
      "TCP는 연결 지향형으로 흐름 제어 및 혼잡 제어를 제공하여 신뢰성이 높다.",
      "UDP는 TCP보다 헤더 오버헤드가 크고 전송 속도가 느리다."
    ],
    answer_index: 2,
    explanation: "TCP는 3-Way Handshake 기반의 연결 지향형 프로토콜로 흐름 제어, 오류 제어, 혼잡 제어를 통해 높은 신뢰성을 보장합니다. UDP는 비연결형으로 속도가 빠르지만 신뢰성은 낮습니다."
  },
  {
    id: 42,
    subject: "프로그래밍 언어 활용",
    question: "IP 주소가 '192.168.1.0/26' 일 때, 할당 가능한 유효 서브넷 마스크는?",
    options: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224"],
    answer_index: 2,
    explanation: "/26은 상위 26비트가 1임을 의미합니다. 마지막 4번째 옥텟이 11000000(2진수)이므로 128 + 64 = 192입니다. 따라서 255.255.255.192 입니다."
  },
  {
    id: 43,
    subject: "프로그래밍 언어 활용",
    question: "프로세스 상태 전이 중 실행(Running) 상태에 있던 프로세스가 지정된 CPU 타임 슬라이스를 모두 소진했을 때 이동하는 상태는?",
    options: ["대기(Waiting/Blocked) 상태", "준비(Ready) 상태", "종료(Terminated) 상태", "보류(Suspended) 상태"],
    answer_index: 1,
    explanation: "타임아웃(Timer Expiration)에 의해 CPU를 반납하게 되면 프로세스는 CPU를 다시 할당받기 위해 '준비(Ready)' 큐로 이동합니다."
  },
  {
    id: 44,
    subject: "프로그래밍 언어 활용",
    question: "다중 스레드(Multi-thread) 환경에서 임계 영역(Critical Section)에 하나의 스레드만 접근할 수 있도록 0과 1의 정수 변수를 사용하는 동기화 도구는?",
    options: ["바이너리 세마포어 (Binary Semaphore) / 뮤텍스 (Mutex)", "모니터 (Monitor)", "스핀락 (Spinlock)", "파이프 (Pipe)"],
    answer_index: 0,
    explanation: "뮤텍스(Mutex) 또는 바이너리 세마포어는 임계 구역에 오직 하나의 프로세스/스레드만 진입할 수 있도록 락(Lock)을 걸고 해제하는 상호 배제 메커니즘입니다."
  },
  {
    id: 45,
    subject: "프로그래밍 언어 활용",
    question: "C 언어에서 포인터 연산 시 `int arr[5] = {10, 20, 30, 40, 50}; int *p = arr;` 일 때, `*(p + 2)`의 값은?",
    options: ["10", "20", "30", "40"],
    answer_index: 2,
    explanation: "배열 이름 arr은 첫 번째 원소의 주소(&arr[0])입니다. 포인터 p에 2를 더해 역참조한 `*(p + 2)`는 `arr[2]`와 동일하므로 값은 30입니다."
  },
  {
    id: 46,
    subject: "프로그래밍 언어 활용",
    question: "비선점 스케줄링 중 대기 시간과 서비스(실행) 시간을 고려하여 기아 현상을 방지하는 우선순위 계산식 ((대기시간 + 서비스시간) / 서비스시간)을 갖는 방식은?",
    options: ["FCFS", "SJF", "HRN (Highest Response Ratio Next)", "RR (Round Robin)"],
    answer_index: 2,
    explanation: "HRN 스케줄링은 우선순위 값(응답률) = (대기 시간 + 서비스 시간) / 서비스 시간 공식을 사용하여 오래 대기한 프로세스의 우선순위를 높여 기아 현상을 해결합니다."
  },
  {
    id: 47,
    subject: "프로그래밍 언어 활용",
    question: "가상 메모리 관리 기법 중 최근에 참조된 페이지가 가까운 미래에 다시 참조될 가능성이 높다는 특성을 나타내는 원리는?",
    options: ["지역성 (Locality of Reference)", "스래싱 (Thrashing)", "워킹셋 (Working Set)", "단편화 (Fragmentation)"],
    answer_index: 0,
    explanation: "참조의 지역성(Locality)에는 특정 메모리 위치가 참조되면 인접 위치가 곧 참조되는 공간 지역성과, 최근 참조된 주소가 곧 다시 참조되는 시간 지역성이 있습니다."
  },
  {
    id: 48,
    subject: "프로그래밍 언어 활용",
    question: "UNIX 계열 운영체제에서 프로세스를 복제하여 새로운 자식 프로세스를 생성하는 시스템 호출(System Call)은?",
    options: ["fork()", "exec()", "wait()", "kill()"],
    answer_index: 0,
    explanation: "fork() 시스템 콜은 현재 실행 중인 부모 프로세스의 메모리 상태를 복제하여 새로운 자식 프로세스를 생성합니다."
  },

  // =========================================================================
  // 5과목: 정보시스템 구축관리 (Information System Management)
  // =========================================================================
  {
    id: 49,
    subject: "정보시스템 구축관리",
    question: "보안의 3대 요소(CIA Triad)에 해당하지 않는 것은?",
    options: ["기밀성 (Confidentiality)", "무결성 (Integrity)", "가용성 (Availability)", "책임추적성 (Accountability)"],
    answer_index: 3,
    explanation: "정보보안의 전통적인 3대 요소(CIA)는 기밀성(인가된 자만 접근), 무결성(인가 없이 변조 불가), 가용성(인가된 자가 필요할 때 언제든 접근 가능)입니다."
  },
  {
    id: 50,
    subject: "정보시스템 구축관리",
    question: "소프트웨어 개발 비용 산정 모델 중 보헴(Boehm)이 제안하였으며, 프로그램의 코드 라인 수(LOC)에 기초하여 조직형, 반분리형, 임베디드형으로 구분하는 모델은?",
    options: ["COCOMO 모델", "기능점수(FP) 모델", "Delphi 기법", "Putnam 모델"],
    answer_index: 0,
    explanation: "COCOMO(Constructive Cost Model) 모델은 LOC(원시 코드 라인 수)를 기반으로 소프트웨어 규모에 따라 Organic(5만 라인 이하), Semi-detached(30만 라인 이하), Embedded(30만 라인 초과)로 분류합니다."
  },
  {
    id: 51,
    subject: "정보시스템 구축관리",
    question: "웹 애플리케이션 보안 공격 중 악의적인 SQL 질의문을 입력값 필드에 주입하여 비정상적으로 DB 데이터를 열람하거나 인증을 우회하는 공격 기법은?",
    options: ["XSS (Cross-Site Scripting)", "SQL Injection", "CSRF (Cross-Site Request Forgery)", "DDoS 공격"],
    answer_index: 1,
    explanation: "SQL Injection(SQL 삽입) 공격은 사용자의 입력값을 적절히 검증하지 않아 공격자가 조작된 쿼리를 실행시켜 데이터베이스를 침해하는 대표적인 웹 취약점 공격입니다."
  },
  {
    id: 52,
    subject: "정보시스템 구축관리",
    question: "암호화 방식 중 암호화할 때 사용하는 키와 복호화할 때 사용하는 키가 서로 동일한 대칭키 암호화 알고리즘에 해당하는 것은?",
    options: ["AES (Advanced Encryption Standard)", "RSA", "ECC (Elliptic Curve Cryptography)", "DSA"],
    answer_index: 0,
    explanation: "AES, DES, 3DES, SEED, ARIA는 대칭키(비밀키) 암호 알고리즘입니다. RSA, ECC, DSA는 공개키(비대칭키) 암호 알고리즘입니다."
  },
  {
    id: 53,
    subject: "정보시스템 구축관리",
    question: "공격자가 자신의 IP 주소를 신뢰받는 호스트의 IP 주소로 위장하여 네트워크 침입을 시도하는 공격 기법은?",
    options: ["IP 스푸핑 (IP Spoofing)", "스니핑 (Sniffing)", "스파이웨어", "스미싱"],
    answer_index: 0,
    explanation: "스푸핑(Spoofing)은 '속이다'라는 뜻으로, 송신자 IP 주소를 변조하여 신뢰할 수 있는 정상 시스템인 것처럼 위장하는 공격입니다."
  },
  {
    id: 54,
    subject: "정보시스템 구축관리",
    question: "네트워크 취약점 공격 중 출발지 IP와 목적지 IP 주소를 희생자의 IP로 동일하게 위조하여 수신자가 자신에게 계속 응답 패킷을 보내 시스템을 다운시키는 공격은?",
    options: ["Land Attack", "Smurf Attack", "Ping of Death", "SYN Flooding"],
    answer_index: 0,
    explanation: "Land Attack은 패킷의 출발지 IP와 목적지 IP를 피해자의 IP로 동일하게 조작하여 피해자 시스템이 무한 루프 상태에 빠지도록 하는 DoS 공격입니다."
  },
  {
    id: 55,
    subject: "정보시스템 구축관리",
    question: "클라우드 서비스 모델 중 인프라나 운영체제에 신경 쓰지 않고 클라우드 상에서 완성된 애플리케이션 소프트웨어를 구독 형태로 이용하는 서비스 모델은?",
    options: ["IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)", "BaaS (Backend as a Service)"],
    answer_index: 2,
    explanation: "SaaS(Software as a Service)는 구글 독스, 슬랙처럼 사용자가 브라우저를 통해 애플리케이션 소프트웨어 전체를 즉시 이용하는 클라우드 형태입니다."
  },
  {
    id: 56,
    subject: "정보시스템 구축관리",
    question: "블록 암호화 알고리즘의 운영 모드 중 가장 단순하며 각 평문 블록을 독립적으로 암호화하여 동일한 평문 블록이 항상 동일한 암호문 블록을 생성하는 모드는?",
    options: ["ECB (Electronic Codebook) 모드", "CBC (Cipher Block Chaining) 모드", "CFB (Cipher Feedback) 모드", "OFB (Output Feedback) 모드"],
    answer_index: 0,
    explanation: "ECB 모드는 블록 간의 연쇄 의존성 없이 독립적으로 암호화하므로 패턴 분석 공격에 취약하며 보안상 단독 사용을 지양합니다."
  },
  {
    id: 57,
    subject: "정보시스템 구축관리",
    question: "Secure SDLC(안전한 소프트웨어 개발 생명주기) 모델 중 마이크로소프트에서 보안 수준 향상을 위해 개발한 프레임워크는?",
    options: ["MS-SDL", "Seven Touchpoints", "CLASP", "OWASP SAMM"],
    answer_index: 0,
    explanation: "MS-SDL(Microsoft Secure Development Lifecycle)은 마이크로소프트에서 소프트웨어 개발 전 과정에 보안 활동을 내재화하기 위해 수립한 모델입니다."
  },
  {
    id: 58,
    subject: "정보시스템 구축관리",
    question: "공격자가 세션 쿠키를 탈취하거나 사용자의 의지와 무관하게 공격자가 의도한 행위(패스워드 변경, 글 등록 등)를 특정 웹사이트에 전송하도록 유도하는 공격은?",
    options: ["CSRF (Cross-Site Request Forgery)", "SQL Injection", "Buffer Overflow", "포트 스캐닝"],
    answer_index: 0,
    explanation: "CSRF(사이트 간 요청 위조)는 희생자가 이미 인증된 세션을 가진 신뢰된 사이트를 대상으로 공격자가 조작한 악의적인 요청을 대신 전송하게 만드는 기법입니다."
  },
  {
    id: 59,
    subject: "정보시스템 구축관리",
    question: "비대칭키 암호화 알고리즘 중 소인수분해의 수학적 난해성에 기반하여 전자서명 및 키 교환에 널리 사용되는 대표적인 알고리즘은?",
    options: ["RSA", "AES", "SHA-256", "DES"],
    answer_index: 0,
    explanation: "RSA(Rivest-Shamir-Adleman)는 매우 큰 두 소수의 곱을 소인수분해하기 어렵다는 수학적 복잡도에 기반한 공개키(비대칭키) 암호 알고리즘입니다."
  },
  {
    id: 60,
    subject: "정보시스템 구축관리",
    question: "ITIL(Information Technology Infrastructure Library) 기반으로 IT 서비스의 계획, 제공, 운영, 개선 활동을 종합적으로 관리하는 프레임워크는?",
    options: ["ITSM (IT Service Management)", "ERP (Enterprise Resource Planning)", "SCM (Supply Chain Management)", "CRM (Customer Relationship Management)"],
    answer_index: 0,
    explanation: "ITSM(IT 서비스 관리)은 최종 사용자의 비즈니스 요구에 부합하도록 고품질의 IT 서비스를 체계적으로 설계, 제공, 운영하는 체계입니다."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTION_BANK };
}
