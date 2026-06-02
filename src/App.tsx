import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle,
  XCircle,
  ChevronRight,
  Home,
  FileText,
  Bookmark,
  Trophy,
  Filter,
  AlertCircle,
  Clock,
  BrainCircuit,
  BarChart3,
} from 'lucide-react';

type QuestionType =
  | 'single_choice'
  | 'combo_choice'
  | 'sequence_choice'
  | 'matching_choice'
  | 'negative_choice'
  | 'quote_choice'
  | 'comparison_choice';

type Difficulty = 'hard' | 'medium' | 'easy';

type Question = {
  id: string;
  version: 'V0' | 'V3' | 'V4';
  week: number;
  source: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  wrongExplanation: string;
  keyword: string;
  tags: string[];
  isActive: boolean;
};

type AppTab = 'dashboard' | 'quiz' | 'results' | 'notes';

type StoredWrongNote = Question & {
  userChoice?: number;
  timestamp: number;
};

const q = (question: Question): Question => question;

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const V0_QUESTION_BANK: Question[] = [
  q({
    id: "V0-W09-001",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "프랑스 혁명 기간동안 벌어진 사건이다. 다음 중 가장 먼저 벌어진 일은?",
    options: ["공포정치", "인권선언 반포", "바스티유 함락", "삼부회 소집"],
    answer: 4,
    explanation: "삼부회 소집이 가장 먼저 일어났다.",
    wrongExplanation: "바스티유 함락, 인권선언 반포, 공포정치는 모두 삼부회 소집 이후의 사건이다.",
    keyword: "프랑스 혁명 전개 순서",
    tags: ["9주차", "기출문제"],
    isActive: true
  }),
  q({
    id: "V0-W09-002",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 공포 정치 시대 만들어진 것이 아닌 것은?",
    options: ["혁명재판소", "인간과 시민의 권리선언", "최고 가격제", "반혁명 혐의자 체포법"],
    answer: 2,
    explanation: "인간과 시민의 권리선언은 공포 정치 이전인 1789년에 발표되었다.",
    wrongExplanation: "혁명재판소, 최고 가격제, 반혁명 혐의자 체포법은 공포 정치 시기와 관련된다.",
    keyword: "공포 정치",
    tags: ["9주차", "기출문제", "공포 정치"],
    isActive: true
  }),
  q({
    id: "V0-W09-003",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹 이후 등장한 현상이라 보기 힘든 것은?",
    options: ["로맨티시즘 유행", "미합중국 건설", "그리스 독립투쟁", "빈 체제 성립"],
    answer: 2,
    explanation: "미합중국 건설은 나폴레옹 이후가 아니라 미국 독립혁명 과정에서 이루어진 일이다.",
    wrongExplanation: "로맨티시즘 유행, 그리스 독립투쟁, 빈 체제 성립은 나폴레옹 이후 유럽 질서와 관련된다.",
    keyword: "나폴레옹 이후 유럽",
    tags: ["9주차", "기출문제", "나폴레옹 이후 유럽"],
    isActive: true
  }),
  q({
    id: "V0-W09-004",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "미국 독립혁명에서 가장 늦게 일어난 사건은?",
    options: ["7년전쟁", "대륙회의", "파리조약", "보스턴 차 사건"],
    answer: 3,
    explanation: "파리조약은 미국 독립전쟁을 공식적으로 종결한 사건으로 가장 늦다.",
    wrongExplanation: "7년전쟁, 보스턴 차 사건, 대륙회의는 파리조약보다 앞선 사건이다.",
    keyword: "미국 독립혁명",
    tags: ["9주차", "기출문제", "미국 독립혁명"],
    isActive: true
  }),
  q({
    id: "V0-W09-005",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 성격이 다른 하나를 고르면?",
    options: ["자코뱅", "공포정치", "상킬로트", "1791년 헌법"],
    answer: 4,
    explanation: "1791년 헌법은 입헌군주제적 성격을 지닌 헌법으로, 자코뱅·공포정치·상킬로트와 성격이 다르다.",
    wrongExplanation: "자코뱅, 공포정치, 상킬로트는 급진적 혁명 국면과 관련된다.",
    keyword: "프랑스 혁명 세력",
    tags: ["9주차", "기출문제", "프랑스 혁명 세력"],
    isActive: true
  }),
  q({
    id: "V0-W09-006",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "프랑스 혁명의 3대 기본 정신에 속하지 않는 것은?",
    options: ["박애", "평등", "공화", "자유"],
    answer: 3,
    explanation: "프랑스 혁명의 3대 정신은 자유, 평등, 박애이다.",
    wrongExplanation: "박애, 평등, 자유는 프랑스 혁명의 3대 기본 정신에 속한다.",
    keyword: "자유 평등 박애",
    tags: ["9주차", "기출문제", "자유 평등 박애"],
    isActive: true
  }),
  q({
    id: "V0-W09-007",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1806년 나폴레옹이 건설한 것으로, 자신이 만든 제국이 로마제국에 필적할 만한 곳임을 드러내기 위해 만든 기념물은 무엇인가?",
    options: ["앵발리드", "바스티유", "콩코르드 광장의 오벨리스크", "개선문"],
    answer: 4,
    explanation: "나폴레옹은 제국의 영광과 군사적 승리를 기념하기 위해 개선문을 건설하게 했다.",
    wrongExplanation: "앵발리드, 바스티유, 콩코르드 광장의 오벨리스크는 해당 설명의 기념물이 아니다.",
    keyword: "나폴레옹 개선문",
    tags: ["9주차", "기출문제", "나폴레옹 개선문"],
    isActive: true
  }),
  q({
    id: "V0-W09-008",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹은 프랑스 혁명을 종식시킨 사람으로도, 계승한 사람으로도 평가된다. 나폴레옹이 한 일 중 혁명을 계승했다고 평가할만한 일은?",
    options: ["나폴레옹 헌법 제정", "아우스터리츠 전투", "브뤼메르 쿠데타", "러시아 원정"],
    answer: 1,
    explanation: "나폴레옹 헌법 제정은 혁명의 성과를 제도화했다는 점에서 혁명 계승으로 평가될 수 있다.",
    wrongExplanation: "아우스터리츠 전투, 브뤼메르 쿠데타, 러시아 원정은 혁명 계승보다는 군사·정치 권력 장악과 관련된다.",
    keyword: "나폴레옹과 혁명 계승",
    tags: ["9주차", "기출문제", "나폴레옹과 혁명 계승"],
    isActive: true
  }),
  q({
    id: "V0-W09-009",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹의 이미지 변천에 대한 설명으로 잘못된 것은?",
    options: ["나폴레옹은 세인트헬레나 유배시절부터 국민영웅으로 여겨졌다", "러시아원정 이후 나폴레옹에 대한 반대 이미지가 프랑스에서도 등장하기 시작했다", "초기에는 새로운 질서의 중심이라는 긍정적인 차원으로 이미지가 유포되었다", "왕정복고 시대 오히려 나폴레옹의 인기가 서서히 올라갔다"],
    answer: 1,
    explanation: "나폴레옹이 세인트헬레나 유배 시절부터 곧바로 국민영웅으로 여겨졌다는 설명은 잘못되었다.",
    wrongExplanation: "러시아 원정 이후 부정적 이미지 등장, 초기의 긍정적 이미지, 왕정복고기의 인기 상승은 이미지 변천과 관련된다.",
    keyword: "나폴레옹 이미지 변천",
    tags: ["9주차", "기출문제", "나폴레옹 이미지 변천"],
    isActive: true
  }),
  q({
    id: "V0-W09-010",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹 시대 전후 벌어진 일을 순서대로 배열할 때 세 번째 일어난 일은?",
    options: ["앵발리드 조성", "툴롱전투", "세인트헬레나 유배", "대동맹 전쟁"],
    answer: 3,
    explanation: "대화에서 확인된 답은 세인트헬레나 유배이다.",
    wrongExplanation: "앵발리드 조성, 툴롱전투, 대동맹 전쟁은 세 번째로 제시된 답이 아니다.",
    keyword: "나폴레옹 사건 순서",
    tags: ["9주차", "기출문제", "나폴레옹 사건 순서"],
    isActive: true
  }),
  q({
    id: "V0-W09-011",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "혁명 이전 생도맹그의 인구 중 가장 많은 비율을 차지하는 층은 누구였는가?",
    options: ["흑인노예", "백인 노동자", "백인농장주", "유색인 자유민"],
    answer: 1,
    explanation: "혁명 이전 생도맹그 인구의 가장 큰 비중은 흑인노예였다.",
    wrongExplanation: "백인 노동자, 백인농장주, 유색인 자유민은 흑인노예보다 인구 비중이 작았다.",
    keyword: "생도맹그 인구 구성",
    tags: ["9주차", "기출문제", "생도맹그 인구 구성"],
    isActive: true
  }),
  q({
    id: "V0-W09-012",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "생도맹그의 노예반란을 아이티 독립혁명으로 성장시킨 아이티혁명의 선구자는 누구인가?",
    options: ["장자크 데살린", "알렉산드르 페시옹", "투생 루베르튀르", "샤를 르클레르"],
    answer: 3,
    explanation: "투생 루베르튀르는 생도맹그 노예반란을 아이티 독립혁명으로 발전시킨 핵심 인물이다.",
    wrongExplanation: "장자크 데살린, 알렉산드르 페시옹, 샤를 르클레르는 해당 설명의 선구자로 제시된 인물이 아니다.",
    keyword: "투생 루베르튀르",
    tags: ["9주차", "기출문제", "투생 루베르튀르"],
    isActive: true
  }),
  q({
    id: "V0-W09-013",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "투생 루베르튀르가 인권선언에서 말하는 인간으로 인정받지 못한 이유는 무엇인가?",
    options: ["성별 때문에", "재산이 부족해서", "나이가 어려서", "유색인종이므로"],
    answer: 4,
    explanation: "투생 루베르튀르는 유색인종이라는 이유로 인권선언의 보편적 인간 범주에서 배제되었다.",
    wrongExplanation: "성별, 재산, 나이는 이 문항에서 묻는 직접적 이유가 아니다.",
    keyword: "인권선언의 한계",
    tags: ["9주차", "기출문제", "인권선언의 한계"],
    isActive: true
  }),
  q({
    id: "V0-W09-014",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "아이티가 속한 서인도제도의 국가가 아닌 것은?",
    options: ["자메이카", "코스타리카", "도미니카 공화국", "쿠바"],
    answer: 2,
    explanation: "코스타리카는 중앙아메리카 국가로, 서인도제도 국가가 아니다.",
    wrongExplanation: "자메이카, 도미니카 공화국, 쿠바는 서인도제도와 관련된 국가이다.",
    keyword: "서인도제도",
    tags: ["9주차", "기출문제", "서인도제도"],
    isActive: true
  }),
  q({
    id: "V0-W09-015",
    version: "V0",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1789년 인간과 시민의 권리선언은 보편적 인간을 기준으로 했지만 암묵적인 몇 가지 제한조건이 있었다. 다음 중 이에 해당하지 않는 것은?",
    options: ["성 정체성", "재산", "인종", "성별"],
    answer: 1,
    explanation: "대화에서 확인된 답은 성 정체성이다.",
    wrongExplanation: "재산, 인종, 성별은 당시 인권선언의 보편성에서 배제되거나 제한된 기준과 관련된다.",
    keyword: "인간과 시민의 권리선언 한계",
    tags: ["9주차", "기출문제", "인간과 시민의 권리선언 한계"],
    isActive: true
  }),
  q({
    id: "V0-W10-001",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1848년 독일에서 자유주의 혁명을 현실화하기 위해 수립한 조직은 무엇인가?",
    options: ["바이마르 의회", "보름스 의회", "프랑크푸르트 의회", "베를린 의회"],
    answer: 3,
    explanation: "1848년 독일 지역의 자유주의·민족주의 흐름 속에서 독일 통일과 헌정 체제를 논의하기 위해 프랑크푸르트 의회가 소집되었다.",
    wrongExplanation: "다른 선택지는 해당 맥락과 다르다.",
    keyword: "프랑크푸르트 의회",
    tags: ["10주차", "기출문제"],
    isActive: true
  }),
  q({
    id: "V0-W10-002",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 19세기 도시적 삶에 대한 설명으로 적절하지 않은 것은?",
    options: ["출퇴근의 등장", "중산층은 교외로 이주", "도시화로 인한 삶의 질 향상", "도시정비의 가속화"],
    answer: 3,
    explanation: "19세기 도시화는 출퇴근, 교외 이주, 도시정비 등을 낳았지만, 급격한 도시화는 빈곤·위생 문제·노동 문제를 동반했으므로 단순히 삶의 질 향상으로 보기 어렵다.",
    wrongExplanation: "출퇴근의 등장, 중산층의 교외 이주, 도시정비 가속화는 19세기 도시화와 관련된 변화로 볼 수 있다.",
    keyword: "19세기 도시화",
    tags: ["10주차", "기출문제", "19세기 도시화"],
    isActive: true
  }),
  q({
    id: "V0-W10-003",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "산업혁명이 영국에서 시작된 이유라 보기 어려운 것은?",
    options: ["석탄", "상품의 창출", "자본력", "인구증가"],
    answer: 4,
    explanation: "대화에서 확인한 답은 인구증가이다. 영국 산업혁명의 주요 배경으로 석탄, 자본력, 시장과 상품 생산 조건 등이 강조된다.",
    wrongExplanation: "석탄은 에너지원, 자본력은 기계와 공장 투자 기반, 상품의 창출은 시장 확대와 생산 체계 변화와 관련된다.",
    keyword: "영국 산업혁명 배경",
    tags: ["10주차", "기출문제", "영국 산업혁명 배경"],
    isActive: true
  }),
  q({
    id: "V0-W10-004",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1848년 2월 혁명의 결과 프랑스에서 수립된 정부 체제는?",
    options: ["왕정", "제2공화정", "제1제정", "제3공화정"],
    answer: 2,
    explanation: "1848년 2월 혁명으로 프랑스의 7월 왕정이 붕괴하고 제2공화정이 수립되었다.",
    wrongExplanation: "왕정은 혁명으로 붕괴된 체제이고, 제1제정은 나폴레옹 1세 시기의 체제이다. 제3공화정은 보불전쟁 이후 수립되었다.",
    keyword: "프랑스 제2공화정",
    tags: ["10주차", "기출문제", "프랑스 제2공화정"],
    isActive: true
  }),
  q({
    id: "V0-W10-005",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 조선의 4대 박해는 어떤 종교와의 갈등을 의미했는가?",
    options: ["천주교", "유교", "불교", "개신교"],
    answer: 1,
    explanation: "19세기 조선의 4대 박해는 천주교 신앙 확산과 조선 정부의 탄압이 충돌한 사건들을 가리킨다.",
    wrongExplanation: "유교는 조선의 지배 이념이었고, 불교는 조선에서 억불 정책의 대상이었으나 4대 박해의 직접 대상은 아니다. 개신교는 조선 후기에 들어왔지만 4대 박해의 핵심 대상은 천주교이다.",
    keyword: "천주교 박해",
    tags: ["10주차", "기출문제", "천주교 박해"],
    isActive: true
  }),
  q({
    id: "V0-W10-006",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 유럽의 도시화 현상 속에서 벌어지는 형태가 아닌 것은?",
    options: ["만국박람회 개최", "평준화된 도시 공간의 등장", "백화점의 등장", "여성상품의 유행"],
    answer: 2,
    explanation: "19세기 도시화는 만국박람회, 백화점, 소비문화와 여성상품의 유행 등을 동반했지만, 도시 공간은 계층과 기능에 따라 분화되었으므로 평준화된 도시 공간의 등장이라고 보기는 어렵다.",
    wrongExplanation: "만국박람회 개최, 백화점의 등장, 여성상품의 유행은 19세기 도시 소비문화와 관련된다.",
    keyword: "도시 공간의 분화",
    tags: ["10주차", "기출문제", "도시 공간의 분화"],
    isActive: true
  }),
  q({
    id: "V0-W10-007",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "중간계급, 즉 부르주아지가 내세운 가치에 해당하지 않는 것은?",
    options: ["세련됨", "성실함", "근면함", "남성다움"],
    answer: 1,
    explanation: "대화에서 확인한 답은 세련됨이다. 부르주아지는 근면, 성실, 책임, 남성적 가장 역할 등 도덕적·사회적 가치를 강조한 것으로 정리된다.",
    wrongExplanation: "성실함, 근면함, 남성다움은 19세기 부르주아적 가치관과 연결된다.",
    keyword: "부르주아 가치",
    tags: ["10주차", "기출문제", "부르주아 가치"],
    isActive: true
  }),
  q({
    id: "V0-W10-008",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "산업혁명과 직접적으로 관련된 개념이 아닌 것은?",
    options: ["대량의 등장", "대량생산", "증기기관", "공장제"],
    answer: 1,
    explanation: "산업혁명은 대량생산, 증기기관, 공장제와 직접적으로 관련된다. '대량의 등장'은 의미가 불명확하여 산업혁명의 직접 개념으로 보기 어렵다.",
    wrongExplanation: "대량생산은 생산 방식의 변화, 증기기관은 동력 혁신, 공장제는 노동과 생산 조직의 변화를 의미한다.",
    keyword: "산업혁명 개념",
    tags: ["10주차", "기출문제", "산업혁명 개념"],
    isActive: true
  }),
  q({
    id: "V0-W10-009",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "영국에서 산업혁명이 시작된 이유로 적절하지 않은 것은?",
    options: ["풍부한 석탄 매장량", "탄탄한 자본력", "뛰어난 전문기술을 지닌 장인집단의 존재", "식민지 중심 거대한 시장의 존재"],
    answer: 3,
    explanation: "영국 산업혁명의 배경으로는 풍부한 석탄, 자본 축적, 식민지와 해외 시장 등이 강조된다. 뛰어난 전문기술을 지닌 장인집단의 존재는 산업혁명보다는 전통적 수공업 생산과 더 가깝다.",
    wrongExplanation: "석탄 매장량은 에너지원, 자본력은 공장과 기계 투자, 식민지 시장은 상품 판매와 원료 확보에 관련된다.",
    keyword: "영국 산업혁명 원인",
    tags: ["10주차", "기출문제", "영국 산업혁명 원인"],
    isActive: true
  }),
  q({
    id: "V0-W10-010",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "산업혁명의 역사적 의의라 보기 힘든 것은?",
    options: ["인구의 급성장", "사회주의 혁명으로 가는 징검다리 역할 담당", "유럽의 세계 주도 가능케 함", "근대적 삶의 공간 형성"],
    answer: 1,
    explanation: "대화에서 확인한 답은 인구의 급성장이다. 산업혁명의 역사적 의의는 생산 방식과 사회 구조의 변화, 유럽의 세계적 우위, 근대적 생활공간 형성 등으로 정리된다.",
    wrongExplanation: "사회주의 운동의 배경 형성, 유럽의 세계 주도, 근대적 삶의 공간 형성은 산업혁명의 역사적 파급 효과와 관련된다.",
    keyword: "산업혁명의 의의",
    tags: ["10주차", "기출문제", "산업혁명의 의의"],
    isActive: true
  }),
  q({
    id: "V0-W10-011",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 유럽 미술의 중심지가 된 도시는?",
    options: ["파리", "로마", "베를린", "런던"],
    answer: 1,
    explanation: "19세기 유럽 미술의 중심지는 파리로, 살롱전과 근대 미술의 흐름이 집중된 도시였다.",
    wrongExplanation: "로마는 고전 미술과 종교 미술의 전통적 중심지였고, 베를린과 런던도 중요한 도시였지만 19세기 유럽 미술의 중심지로는 파리가 대표적이다.",
    keyword: "파리",
    tags: ["10주차", "기출문제", "파리"],
    isActive: true
  }),
  q({
    id: "V0-W10-012",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 나머지 셋과 붓 터치와 지향이 다른 화가를 고르면?",
    options: ["들라크루아", "쿠르베", "앵그르", "밀레"],
    answer: 3,
    explanation: "앵그르는 선명한 윤곽과 고전주의적 질서를 중시한 화가로, 상대적으로 거친 붓터치나 사실주의·낭만주의적 흐름과 다른 지향을 보인다.",
    wrongExplanation: "들라크루아, 쿠르베, 밀레는 각각 낭만주의·사실주의 흐름과 관련되어 있으며, 앵그르와는 미술적 지향이 다르다.",
    keyword: "앵그르",
    tags: ["10주차", "기출문제", "앵그르"],
    isActive: true
  }),
  q({
    id: "V0-W10-013",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "인상파 미술의 시작이라 볼 수 있는 인물은?",
    options: ["밀레", "마네", "카바넬", "앵그르"],
    answer: 2,
    explanation: "마네는 전통적 살롱 미술과 다른 방식으로 근대적 주제와 표현을 제시하여 인상파 미술의 출발점으로 자주 언급된다.",
    wrongExplanation: "밀레는 사실주의 농민화와 관련되고, 카바넬과 앵그르는 관전파·아카데미 미술과 관련된다.",
    keyword: "마네",
    tags: ["10주차", "기출문제", "마네"],
    isActive: true
  }),
  q({
    id: "V0-W10-014",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 인상파 화가가 아닌 사람은?",
    options: ["밀레", "피사로", "마네", "모네"],
    answer: 1,
    explanation: "밀레는 농민의 삶을 주제로 한 사실주의 화가로 분류되며, 인상파 화가로 보기는 어렵다.",
    wrongExplanation: "피사로와 모네는 대표적인 인상파 화가이며, 마네는 인상파의 출발과 관련된 인물로 다루어진다.",
    keyword: "밀레",
    tags: ["10주차", "기출문제", "밀레"],
    isActive: true
  }),
  q({
    id: "V0-W10-015",
    version: "V0",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "인상파 미술의 특징이라 보기 힘든 것은?",
    options: ["거친 붓터치에 대한 경멸", "개성과 독창성", "변화와 속도를 강조함", "도시의 일상을 소재로 잡음"],
    answer: 1,
    explanation: "인상파는 빠르고 거친 붓터치, 빛과 색의 순간적 인상, 변화하는 도시 일상 등을 중시했다. 따라서 거친 붓터치를 경멸했다는 설명은 인상파의 특징으로 보기 어렵다.",
    wrongExplanation: "개성과 독창성, 변화와 속도의 강조, 도시의 일상 소재는 인상파 미술의 특징과 관련된다.",
    keyword: "인상파 특징",
    tags: ["10주차", "기출문제", "인상파 특징"],
    isActive: true
  }),
  q({
    id: "V0-W11-001",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "세계에서 가장 먼저 여성에게 참정권을 준 국가는 어디인가?",
    options: ["뉴질랜드", "미국", "영국", "프랑스"],
    answer: 1,
    explanation: "뉴질랜드는 세계 최초로 여성에게 전국 단위 참정권을 부여한 국가로 알려져 있다.",
    wrongExplanation: "미국, 영국, 프랑스는 뉴질랜드보다 늦게 여성 참정권을 인정했다.",
    keyword: "여성 참정권",
    tags: ["11주차", "기출문제"],
    isActive: true
  }),
  q({
    id: "V0-W11-002",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "제국주의에 대한 설명으로 적절하지 않은 것은?",
    options: ["영국과 프랑스가 주도했다", "제국주의의 기저에는 결국 경제적 이해관계가 존재한다", "식민지는 원료공급과 상품시장으로 활용되었다", "문화의 수용과 전파라는 측면에서 상호 호혜적 측면이 있다"],
    answer: 4,
    explanation: "제국주의는 강대국이 식민지를 정치·경제적으로 지배하고 이용한 구조였으므로 상호 호혜적 관계로 보기 어렵다.",
    wrongExplanation: "1, 2, 3번은 제국주의의 주도 세력, 경제적 동기, 식민지 활용 방식에 대한 설명으로 적절하다.",
    keyword: "제국주의",
    tags: ["11주차", "기출문제", "제국주의"],
    isActive: true
  }),
  q({
    id: "V0-W11-003",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "1차 세계대전의 특징이라 보기 힘든 것은?",
    options: ["총력전", "전면전", "참호전", "단기전"],
    answer: 4,
    explanation: "제1차 세계대전은 장기화된 전쟁으로 총력전, 전면전, 참호전의 성격이 강했다.",
    wrongExplanation: "총력전, 전면전, 참호전은 제1차 세계대전의 대표적 특징이다.",
    keyword: "제1차 세계대전",
    tags: ["11주차", "기출문제", "제1차 세계대전"],
    isActive: true
  }),
  q({
    id: "V0-W11-004",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "삼국협상에 속하지 않은 국가는?",
    options: ["러시아", "독일", "영국", "프랑스"],
    answer: 2,
    explanation: "삼국협상은 영국, 프랑스, 러시아를 중심으로 형성되었다.",
    wrongExplanation: "독일은 삼국협상이 아니라 오스트리아-헝가리, 이탈리아와 함께 삼국동맹 쪽에 속했다.",
    keyword: "삼국협상",
    tags: ["11주차", "기출문제", "삼국협상"],
    isActive: true
  }),
  q({
    id: "V0-W11-005",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 독일 통일의 주역으로 '철혈재상'이라 불리는 인물은 누구인가?",
    options: ["카우르", "마치니", "가리발디", "비스마르크"],
    answer: 4,
    explanation: "비스마르크는 프로이센 중심의 독일 통일을 주도한 인물로 철혈재상이라 불린다.",
    wrongExplanation: "마치니와 가리발디는 이탈리아 통일과 관련된 인물이다.",
    keyword: "비스마르크",
    tags: ["11주차", "기출문제", "비스마르크"],
    isActive: true
  }),
  q({
    id: "V0-W11-006",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 신사가 되고자 하는 욕망과 신사 개념의 모호함을 치밀하게 묘사한 <위대한 유산>의 작가는 누구인가?",
    options: ["브램 스토커", "제인 오스틴", "제임스 매튜 배리", "찰스 디킨스"],
    answer: 4,
    explanation: "<위대한 유산>은 찰스 디킨스의 대표작이다.",
    wrongExplanation: "브램 스토커는 <드라큘라>, 제임스 매튜 배리는 <피터팬>과 관련된다.",
    keyword: "찰스 디킨스",
    tags: ["11주차", "기출문제", "찰스 디킨스"],
    isActive: true
  }),
  q({
    id: "V0-W11-007",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 영국에서 신사를 향한 동경과 공포를 담고 있는 작품에 속하지 않는 것은?",
    options: ["드라큘라", "로빈슨 크루소", "피터팬", "위대한 유산"],
    answer: 2,
    explanation: "<로빈슨 크루소>는 18세기 작품으로, 19세기 영국의 신사 담론과 직접 연결되는 작품으로 보기 어렵다.",
    wrongExplanation: "드라큘라, 피터팬, 위대한 유산은 19세기 영국 사회와 신사 담론의 맥락에서 다루어질 수 있다.",
    keyword: "영국 신사 담론",
    tags: ["11주차", "기출문제", "영국 신사 담론"],
    isActive: true
  }),
  q({
    id: "V0-W11-008",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 영국 제국주의 시대 정치, 경제, 군사적 성격과 어울리지 않는 설명을 고르면?",
    options: ["영광스러운 고립", "꾸준한 선거법 개정", "식민지 투자를 통한 大 증식", "세계 제조업의 중심"],
    answer: 4,
    explanation: "대화상 최종 정답은 4번으로 정정되었다. '세계 제조업의 중심'은 산업혁명기 영국의 성격에 더 가깝고, 제국주의 시대의 정치·경제·군사적 성격을 직접 설명하는 표현으로는 상대적으로 부적절하다.",
    wrongExplanation: "영광스러운 고립, 선거법 개정, 식민지 투자는 19세기 영국의 정치·제국주의적 변화와 연결된다.",
    keyword: "영국 제국주의",
    tags: ["11주차", "기출문제", "영국 제국주의"],
    isActive: true
  }),
  q({
    id: "V0-W11-009",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "영국 제국주의의 3C 정책에 속하지 않는 도시는?",
    options: ["케이프타운", "카이로", "캔버라", "캘커타"],
    answer: 3,
    explanation: "영국의 3C 정책은 카이로, 케이프타운, 캘커타를 잇는 제국주의 구상이다.",
    wrongExplanation: "케이프타운, 카이로, 캘커타는 3C 정책의 세 거점이다.",
    keyword: "3C 정책",
    tags: ["11주차", "기출문제", "3C 정책"],
    isActive: true
  }),
  q({
    id: "V0-W11-010",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "신사를 묘사할 때 사용할 만한 표현이 아닌 것은?",
    options: ["진중한 태도", "관리된 육체", "향락과 사치", "유능한 관리자"],
    answer: 3,
    explanation: "신사는 절제, 품위, 자기관리, 책임감과 연결되는 이미지가 강하므로 향락과 사치는 어울리지 않는다.",
    wrongExplanation: "진중한 태도, 관리된 육체, 유능한 관리자는 신사의 이상적 이미지와 연결될 수 있다.",
    keyword: "신사",
    tags: ["11주차", "기출문제", "신사"],
    isActive: true
  }),
  q({
    id: "V0-W11-011",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "벨기에가 원활한 식민통치를 위해 특별히 우대한 르완다의 민족은 누구인가?",
    options: ["투치", "후투", "모두 똑같이 대함", "트와"],
    answer: 1,
    explanation: "벨기에는 르완다 식민통치 과정에서 투치족을 우대하며 간접통치 구조를 강화했다.",
    wrongExplanation: "후투와 트와는 식민통치 과정에서 투치보다 우대받지 못했다.",
    keyword: "투치",
    tags: ["11주차", "기출문제", "투치"],
    isActive: true
  }),
  q({
    id: "V0-W11-012",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "현재 키갈리를 설명할 수 있는 개념으로 적절치 않은 것은?",
    options: ["친환경도시", "내전이 진행중", "신산업 육성", "여행하기 안전한 도시"],
    answer: 2,
    explanation: "현재 키갈리는 친환경 정책, 신산업 육성, 비교적 안전한 도시 이미지로 설명되며, 현재 내전이 진행 중인 도시로 보기는 어렵다.",
    wrongExplanation: "친환경도시, 신산업 육성, 여행하기 안전한 도시는 현재 키갈리를 설명하는 개념으로 제시될 수 있다.",
    keyword: "키갈리",
    tags: ["11주차", "기출문제", "키갈리"],
    isActive: true
  }),
  q({
    id: "V0-W11-013",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "키갈리는 어느 나라의 수도인가?",
    options: ["르완다", "모잠비크", "이디오피아", "튀니지"],
    answer: 1,
    explanation: "키갈리는 르완다의 수도이다.",
    wrongExplanation: "모잠비크, 에티오피아, 튀니지의 수도는 키갈리가 아니다.",
    keyword: "르완다 수도",
    tags: ["11주차", "기출문제", "르완다 수도"],
    isActive: true
  }),
  q({
    id: "V0-W11-014",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "르완다의 전통적 민족 구성에 속하지 않는 것은?",
    options: ["투치", "호텐토트", "후투", "트와"],
    answer: 2,
    explanation: "르완다의 대표적 전통 민족 구성은 후투, 투치, 트와로 설명된다.",
    wrongExplanation: "호텐토트는 르완다의 전통적 민족 구성에 속하지 않는다.",
    keyword: "르완다 민족 구성",
    tags: ["11주차", "기출문제", "르완다 민족 구성"],
    isActive: true
  }),
  q({
    id: "V0-W11-015",
    version: "V0",
    week: 11,
    source: "업로드 이미지/대화 기반(강의노트 파일명 미확인)",
    type: "single_choice",
    difficulty: "hard",
    question: "르완다를 가장 먼저 식민한 유럽의 국가는?",
    options: ["독일", "벨기에", "프랑스", "영국"],
    answer: 1,
    explanation: "르완다는 처음 독일의 식민 지배를 받았고, 이후 벨기에의 지배를 받았다.",
    wrongExplanation: "벨기에는 독일 이후 르완다를 지배한 국가이다.",
    keyword: "르완다 식민 지배",
    tags: ["11주차", "기출문제", "르완다 식민 지배"],
    isActive: true
  }),
  q({
    id: "V0-W12-001",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 파시즘이 반대하지 않는 사고방식은?",
    options: ["자유민주주의", "인종주의", "공산주의", "개인주의"],
    answer: 2,
    explanation: "파시즘은 자유민주주의, 공산주의, 개인주의에 반대하지만 인종주의와 결합되는 경우가 많았다.",
    wrongExplanation: "자유민주주의, 공산주의, 개인주의는 파시즘이 배격한 대표적 사고방식이다. 반면 인종주의는 파시즘과 결합될 수 있으므로 정답이다.",
    keyword: "파시즘, 인종주의",
    tags: ["12주차", "V0", "파시즘, 인종주의"],
    isActive: true
  }),
  q({
    id: "V0-W12-002",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "이탈리아와 독일의 파시즘 운동과 무관한 개념은?",
    options: ["케인즈", "무솔리니", "수권법", "붉은 2년"],
    answer: 1,
    explanation: "케인즈는 수정자본주의와 국가 개입 경제 이론과 관련된 인물로, 이탈리아와 독일의 파시즘 운동 자체와 직접 관련된 개념은 아니다.",
    wrongExplanation: "무솔리니는 이탈리아 파시즘, 수권법은 독일 나치 독재 체제 확립, 붉은 2년은 이탈리아 파시즘 성장 배경과 관련된다.",
    keyword: "파시즘, 케인즈, 무솔리니, 수권법, 붉은 2년",
    tags: ["12주차", "V0", "파시즘, 케인즈, 무솔리니, 수권법, 붉은 2년"],
    isActive: true
  }),
  q({
    id: "V0-W12-003",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "일본 제국주의 확장 과정에서 세 번째로 일어난 일은?",
    options: ["진주만 공격", "만주 침공", "연합군 원폭 투하", "독일과의 동맹 체결"],
    answer: 1,
    explanation: "보기의 사건을 시간순으로 배열하면 만주 침공, 독일과의 동맹 체결, 진주만 공격, 연합군 원폭 투하 순서가 된다. 따라서 세 번째 사건은 진주만 공격이다.",
    wrongExplanation: "만주 침공은 가장 먼저, 독일과의 동맹 체결은 그 다음, 연합군 원폭 투하는 가장 나중에 일어난 사건이다.",
    keyword: "일본 제국주의, 만주 침공, 진주만 공격",
    tags: ["12주차", "V0", "일본 제국주의, 만주 침공, 진주만 공격"],
    isActive: true
  }),
  q({
    id: "V0-W12-004",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "대공황의 결과 벌어진 일이라 보기 힘든 것은?",
    options: ["독일의 정치적 불안 극대화", "작은 정부론", "뉴딜 정책", "유럽 전체주의의 부상"],
    answer: 2,
    explanation: "대공황 이후에는 국가의 경제 개입과 복지·고용 정책이 강화되었으므로 작은 정부론은 대공황의 결과로 보기 어렵다.",
    wrongExplanation: "독일의 정치적 불안, 뉴딜 정책, 유럽 전체주의의 부상은 대공황 이후 나타난 주요 변화와 관련된다.",
    keyword: "대공황, 작은 정부론, 뉴딜 정책",
    tags: ["12주차", "V0", "대공황, 작은 정부론, 뉴딜 정책"],
    isActive: true
  }),
  q({
    id: "V0-W12-005",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "나치 독일이 유대인 정책을 펼 때 ‘최종해결책’으로 제시한 것은 무엇인가?",
    options: ["완전한 멸절", "국외 추방", "게토 설치", "시민권 박탈"],
    answer: 1,
    explanation: "나치의 ‘최종해결책’은 유대인 문제를 학살과 절멸로 해결하려는 정책을 의미한다.",
    wrongExplanation: "국외 추방, 게토 설치, 시민권 박탈은 유대인 탄압 과정의 일부였지만 ‘최종해결책’ 자체는 완전한 멸절이다.",
    keyword: "나치, 최종해결책, 홀로코스트",
    tags: ["12주차", "V0", "나치, 최종해결책, 홀로코스트"],
    isActive: true
  }),
  q({
    id: "V0-W12-006",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 극우파 정당이 아닌 것은?",
    options: ["프랑스 국민전선", "독일을 위한 대안", "미국 공화당", "이탈리아 형제당"],
    answer: 3,
    explanation: "프랑스 국민전선, 독일을 위한 대안, 이탈리아 형제당은 유럽 극우 정치의 사례로 제시될 수 있다. 미국 공화당은 보기 중 극우파 정당으로 분류하기 어렵다.",
    wrongExplanation: "프랑스 국민전선, 독일을 위한 대안, 이탈리아 형제당은 극우 정당 사례로 연결된다.",
    keyword: "극우파 정당",
    tags: ["12주차", "V0", "극우파 정당"],
    isActive: true
  }),
  q({
    id: "V0-W12-007",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "1차 세계대전 패망 이후 제3제국 성립 시까지 존속했던 독일의 국가체제를 무엇이라 하는가?",
    options: ["프로이센 왕국", "제2제국", "브란덴부르크 체제", "바이마르 공화국"],
    answer: 4,
    explanation: "제1차 세계대전 이후 독일에는 바이마르 공화국이 성립했고, 나치의 제3제국 성립 전까지 존속했다.",
    wrongExplanation: "프로이센 왕국과 제2제국은 제1차 세계대전 이전의 독일사와 관련되며, 브란덴부르크 체제는 해당 시기의 독일 국가체제가 아니다.",
    keyword: "바이마르 공화국",
    tags: ["12주차", "V0", "바이마르 공화국"],
    isActive: true
  }),
  q({
    id: "V0-W12-008",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "나치즘 성공의 배경이라 보기 힘든 것은?",
    options: ["베르사유 조약에 대한 거부감", "자본주의에 대한 적개심", "바이마르 공화국에 대한 불만", "대공황으로 인한 경제위기"],
    answer: 2,
    explanation: "나치즘은 베르사유 조약에 대한 반감, 바이마르 공화국에 대한 불만, 대공황으로 인한 경제위기 속에서 성장했다. 자본주의 자체에 대한 적개심은 나치즘 성공의 핵심 배경으로 보기 어렵다.",
    wrongExplanation: "베르사유 조약에 대한 거부감, 바이마르 공화국에 대한 불만, 대공황으로 인한 경제위기는 나치즘 성장 배경과 관련된다.",
    keyword: "나치즘, 베르사유 조약, 바이마르 공화국, 대공황",
    tags: ["12주차", "V0", "나치즘, 베르사유 조약, 바이마르 공화국, 대공황"],
    isActive: true
  }),
  q({
    id: "V0-W12-009",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "히틀러의 나치당이 독일인들의 본격적 주목을 받게 된 계기는 무엇인가?",
    options: ["수권법", "대공황", "1차세계대전", "독일 국회의사당 방화사건"],
    answer: 2,
    explanation: "대공황으로 독일 사회가 경제적·정치적 혼란에 빠지면서 나치당은 본격적으로 대중의 주목과 지지를 받게 되었다.",
    wrongExplanation: "수권법과 독일 국회의사당 방화사건은 나치가 권력을 장악·강화하는 과정과 관련되지만, 본격적 대중적 주목의 계기는 대공황이다.",
    keyword: "히틀러, 나치당, 대공황",
    tags: ["12주차", "V0", "히틀러, 나치당, 대공황"],
    isActive: true
  }),
  q({
    id: "V0-W12-010",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 가장 늦게 일어난 사건은?",
    options: ["수권법 제정", "뉘른베르크 법 제정", "하이퍼 인플레이션", "2차 세계대전 발발"],
    answer: 4,
    explanation: "하이퍼 인플레이션은 1920년대 초, 수권법 제정은 1933년, 뉘른베르크 법 제정은 1935년, 제2차 세계대전 발발은 1939년이다. 따라서 가장 늦게 일어난 사건은 제2차 세계대전 발발이다.",
    wrongExplanation: "하이퍼 인플레이션, 수권법 제정, 뉘른베르크 법 제정은 모두 제2차 세계대전 발발 이전의 사건이다.",
    keyword: "수권법, 뉘른베르크 법, 하이퍼 인플레이션, 2차 세계대전",
    tags: ["12주차", "V0", "수권법, 뉘른베르크 법, 하이퍼 인플레이션, 2차 세계대전"],
    isActive: true
  }),
  q({
    id: "V0-W12-011",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "희생자가 살던 공간에 작은 명패를 설치해 일상 속에서 학살의 기억을 되새기게 만드는 조형물의 명칭은?",
    options: ["노이에 바헤", "베벨의 비어있는 도서관", "체크포인트 찰리", "슈톨퍼슈타인 프로젝트"],
    answer: 4,
    explanation: "슈톨퍼슈타인 프로젝트는 나치 희생자들이 살던 장소 앞에 작은 추모 명패를 설치해 일상 속에서 기억을 환기하는 프로젝트이다.",
    wrongExplanation: "노이에 바헤, 베벨의 비어있는 도서관, 체크포인트 찰리는 각각 다른 기억 공간 또는 역사 장소와 관련된다.",
    keyword: "슈톨퍼슈타인 프로젝트",
    tags: ["12주차", "V0", "슈톨퍼슈타인 프로젝트"],
    isActive: true
  }),
  q({
    id: "V0-W12-012",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "국가기념조형물의 성격으로 볼 수 없는 것은?",
    options: ["역사적 사건의 추모나 경고를 위해 설치된다", "웅장하고 권위적일수록 높은 평가를 받는다", "특정 사건을 기리기 위한 탑이나 동상들이 많다", "최근 해당 장소에서 벌어진 일을 체험하게 만드는 방식의 조형물이 늘고 있다"],
    answer: 2,
    explanation: "국가기념조형물은 역사적 사건의 추모나 경고, 특정 사건의 기억을 위해 설치될 수 있다. 그러나 현대의 기념조형물이 반드시 웅장하고 권위적일수록 높은 평가를 받는 것은 아니다.",
    wrongExplanation: "역사적 사건의 추모와 경고, 특정 사건을 기리는 탑이나 동상, 장소 경험형 조형물은 국가기념조형물의 성격으로 볼 수 있다.",
    keyword: "국가기념조형물, 기억 문화",
    tags: ["12주차", "V0", "국가기념조형물, 기억 문화"],
    isActive: true
  }),
  q({
    id: "V0-W12-013",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린 유대인 추모공간에 대한 설명으로 적절하지 못한 것은?",
    options: ["어두운 통로를 걸으며 학살의 공포와 폭력을 성찰하게 만들었다", "관을 연상시키는 콘크리트 조형물이 배치되어 있다", "베를린 중심부에 위치한다", "설치과정에서 비판이나 반대는 전혀 없었다"],
    answer: 4,
    explanation: "베를린 유대인 추모공간은 조성 과정에서 여러 논쟁과 비판이 있었으므로, 비판이나 반대가 전혀 없었다는 설명은 적절하지 않다.",
    wrongExplanation: "어두운 통로를 걷는 경험, 관을 연상시키는 콘크리트 조형물, 베를린 중심부라는 위치는 베를린 유대인 추모공간의 설명과 연결된다.",
    keyword: "베를린 유대인 추모공간",
    tags: ["12주차", "V0", "베를린 유대인 추모공간"],
    isActive: true
  }),
  q({
    id: "V0-W12-014",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "베벨 광장의 비어있는 도서관에서 상기시키는 사건은?",
    options: ["1940년 아우슈비츠의 설치", "1938년의 수정의 밤", "1933년 대학생 분서 시위", "1944년 노르망디 상륙작전"],
    answer: 3,
    explanation: "베벨 광장의 ‘비어있는 도서관’은 1933년 나치 지지 대학생들의 분서 사건을 기억하게 하는 추모 공간이다.",
    wrongExplanation: "아우슈비츠 설치, 수정의 밤, 노르망디 상륙작전은 베벨 광장의 ‘비어있는 도서관’이 직접적으로 상기시키는 사건이 아니다.",
    keyword: "베벨 광장, 비어있는 도서관, 분서 시위",
    tags: ["12주차", "V0", "베벨 광장, 비어있는 도서관, 분서 시위"],
    isActive: true
  }),
  q({
    id: "V0-W12-015",
    version: "V0",
    week: 12,
    source: "[업로드 이미지] 12주차 세계사 기출문제",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린에 대한 설명으로 적절치 않은 것은?",
    options: ["1989년까지 베를린 장벽이 존재했다", "현재 통일 독일의 수도이다", "15세기 이후 내내 독일의 수도였다", "현재 유럽에서 인구 1위의 도시이다"],
    answer: 4,
    explanation: "이미지에 제시된 기존 정답 흐름에 따라 4번을 정답으로 유지했다. 베를린은 현재 통일 독일의 수도이지만, 유럽 전체에서 인구 1위 도시라고 보기는 어렵다.",
    wrongExplanation: "1989년까지 베를린 장벽이 존재했다는 설명과 현재 통일 독일의 수도라는 설명은 적절하다. 3번은 표현상 엄밀성 논란이 있을 수 있으나, 해당 기출 문항의 정답 흐름은 4번으로 정리했다.",
    keyword: "베를린, 베를린 장벽, 통일 독일",
    tags: ["12주차", "V0", "베를린, 베를린 장벽, 통일 독일"],
    isActive: true
  }),
  q({
    id: "V0-W13-001",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 레닌의 정책이라 보기 힘든 것은?",
    options: ["신경제정책", "프롤레타리아 독재", "일국사회주의", "코민테른"],
    answer: 3,
    explanation: "일국사회주의는 레닌의 대표 정책이라기보다 스탈린 시기와 관련된 노선이다.",
    wrongExplanation: "다른 보기는 레닌 및 볼셰비키 혁명 체제와 관련된다.",
    keyword: "레닌 정책",
    tags: ["13주차", "기출문제"],
    isActive: true
  }),
  q({
    id: "V0-W13-002",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "미국 역사에서 '명백한 운명'란 무엇을 의미하는가?",
    options: ["노예해방", "나치즘에 대한 승리", "대서양에서 태평양까지 영토확장", "세계 1위의 강대국으로 성장"],
    answer: 3,
    explanation: "명백한 운명은 미국이 대륙을 가로질러 서부로 팽창하는 것이 운명이라는 관념이다.",
    wrongExplanation: "노예해방, 나치즘에 대한 승리, 세계 1위 강대국 성장은 명백한 운명의 직접적 의미가 아니다.",
    keyword: "명백한 운명",
    tags: ["13주차", "기출문제", "명백한 운명"],
    isActive: true
  }),
  q({
    id: "V0-W13-003",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "러시아혁명 이전 러시아의 상황을 올바로 설명한 것은?",
    options: ["19세기 러시아 농민은 상당수 자영농이었다", "노동자 중심으로 개혁을 추진하자는 파당을 볼셰비키라 부른다", "브나로드 운동을 통해 러시아 지식인들은 농민이 새 시대의 주역이라 여기게 되었다", "알렉산드르 3세는 진보적이고 유화적인 편이었다"],
    answer: 3,
    explanation: "브나로드 운동은 지식인들이 민중, 특히 농민에게 들어가 사회 변화를 모색한 운동이었다.",
    wrongExplanation: "러시아 농민 다수가 자영농이었다고 보기 어렵고, 알렉산드르 3세는 보수적 성향이 강했다. 볼셰비키는 노동자 중심 혁명 세력이지만 ‘개혁 추진’이라는 표현은 부정확하다.",
    keyword: "브나로드 운동",
    tags: ["13주차", "기출문제", "브나로드 운동"],
    isActive: true
  }),
  q({
    id: "V0-W13-004",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "미국 남북전쟁에서 링컨의 가장 중요한 목표는 무엇이라 할 수 있을까?",
    options: ["노예해방", "북부의 절대 우위 확보", "인종차별 철폐", "연방의 유지"],
    answer: 4,
    explanation: "링컨의 남북전쟁 초기 핵심 목표는 미국 연방의 보존이었다.",
    wrongExplanation: "노예해방은 전쟁 중 중요한 목표가 되었지만, 가장 기본적이고 우선적인 목표는 연방 유지였다.",
    keyword: "남북전쟁",
    tags: ["13주차", "기출문제", "남북전쟁"],
    isActive: true
  }),
  q({
    id: "V0-W13-005",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "러시아 혁명의 전개과정에서 가장 늦게 일어난 일은?",
    options: ["2월혁명", "피의 일요일", "1차 세계대전", "내전 발발"],
    answer: 4,
    explanation: "피의 일요일은 1905년, 1차 세계대전은 1914년, 2월혁명은 1917년에 일어났고, 러시아 내전은 혁명 이후 본격화되었다.",
    wrongExplanation: "피의 일요일, 1차 세계대전, 2월혁명은 내전 발발보다 앞선 사건이다.",
    keyword: "러시아 혁명 전개",
    tags: ["13주차", "기출문제", "러시아 혁명 전개"],
    isActive: true
  }),
  q({
    id: "V0-W13-006",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "빌러비드의 등장인물 사이의 관계를 잘못 설명한 것은?",
    options: ["헬리의 어머니는 베이비석스이다", "새서와 헬리는 부부 사이였다", "덴버는 베이비석스의 딸이다", "폴D는 새서를 예전부터 마음에 두고 있었다"],
    answer: 3,
    explanation: "덴버는 베이비석스의 딸이 아니라 새서의 딸이다.",
    wrongExplanation: "베이비석스는 헬리의 어머니이며, 새서와 헬리는 부부 관계로 제시된다. 폴D와 새서의 관계도 작품의 주요 인물 관계에 포함된다.",
    keyword: "빌러비드 인물관계",
    tags: ["13주차", "기출문제", "빌러비드 인물관계"],
    isActive: true
  }),
  q({
    id: "V0-W13-007",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "대서양 노예무역 시기 아프리카에서 대서양을 건너 아메리카에 오기까지의 항해를 뜻하는 것으로, 수없이 많은 포로가 고통이 동반되었던 이 현상을 무엇이라 부르는가?",
    options: ["삼각항해", "남쪽항해", "서쪽항해", "중간항해"],
    answer: 4,
    explanation: "아프리카에서 아메리카로 노예를 실어 나른 항해는 중간항해라고 부른다.",
    wrongExplanation: "삼각항해는 대서양 무역 구조 전체를 가리키는 개념이고, 남쪽항해·서쪽항해는 해당 용어가 아니다.",
    keyword: "중간항해",
    tags: ["13주차", "기출문제", "중간항해"],
    isActive: true
  }),
  q({
    id: "V0-W13-008",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "<빌러비드>의 작가 토니 모리슨에 대한 설명으로 적절하지 않은 것은?",
    options: ["사랑과 그 부재를 다룬 작가라는 평가를 받고 있다", "노벨문학상을 수상했다", "현재 현역으로 활동하는 작가이다", "모두가 무관심했던 흑인공동체의 역사적 기억에 관심을 가졌다"],
    answer: 3,
    explanation: "토니 모리슨은 2019년에 사망했으므로 현재 현역으로 활동하는 작가라고 볼 수 없다.",
    wrongExplanation: "토니 모리슨은 노벨문학상 수상 작가이며, 흑인 공동체의 역사와 기억을 작품의 중요한 주제로 다루었다.",
    keyword: "토니 모리슨",
    tags: ["13주차", "기출문제", "토니 모리슨"],
    isActive: true
  }),
  q({
    id: "V0-W13-009",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 토니 모리슨의 작품이 아닌 것은?",
    options: ["가장 푸른 눈", "재즈", "하녀 이야기", "낙원"],
    answer: 3,
    explanation: "하녀 이야기는 토니 모리슨의 작품이 아니라 마거릿 애트우드의 작품이다.",
    wrongExplanation: "가장 푸른 눈, 재즈, 낙원은 토니 모리슨의 작품이다.",
    keyword: "토니 모리슨 작품",
    tags: ["13주차", "기출문제", "토니 모리슨 작품"],
    isActive: true
  }),
  q({
    id: "V0-W13-010",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "<빌러비드>에서 다루지 않는 내용을 고르면?",
    options: ["신남부 시대 백인들의 불안과 좌절", "노예제가 남긴 집단 트라우마", "미국 흑인 공동체의 역사적 경험", "흑인 여성 노예로 산다는 것의 의미"],
    answer: 1,
    explanation: "<빌러비드>는 노예제의 기억, 흑인 공동체의 역사적 경험, 흑인 여성 노예의 삶과 트라우마를 다룬다.",
    wrongExplanation: "노예제가 남긴 집단 트라우마, 흑인 공동체의 역사 경험, 흑인 여성 노예의 삶은 작품의 핵심 주제와 관련된다.",
    keyword: "빌러비드 주제",
    tags: ["13주차", "기출문제", "빌러비드 주제"],
    isActive: true
  }),
  q({
    id: "V0-W13-011",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린이 추구한 정책과 그 방향을 잘못 설명한 것은?",
    options: ["콜라크 철거", "5개년 계획", "농업중심 경제개발", "나치 독일과의 전면전"],
    answer: 3,
    explanation: "스탈린의 경제정책은 농업 중심이라기보다 중공업 중심의 급속한 산업화와 집단농장화를 특징으로 한다.",
    wrongExplanation: "콜라크 탄압, 5개년 계획, 나치 독일과의 전면전은 스탈린 시대와 관련된다.",
    keyword: "스탈린 경제정책",
    tags: ["13주차", "기출문제", "스탈린 경제정책"],
    isActive: true
  }),
  q({
    id: "V0-W13-012",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린 시대 대숙청에 대한 설명으로 잘못된 것은?",
    options: ["숙청의 대상이 된 사람들은 죽거나 굴라그에 끌려갔다", "권력자들 사이에서 벌어진 것으로 일반인 피해는 없었다", "NKVD(엔카베데)라는 조직이 숙청의 도구로 활용됐다", "1937~1938년에 정점에 이르렀다"],
    answer: 2,
    explanation: "대숙청은 권력층뿐 아니라 일반 시민, 당원, 군인, 지식인 등 광범위한 집단에 피해를 주었다.",
    wrongExplanation: "대숙청 과정에서 처형과 굴라그 수용이 일어났고, NKVD가 핵심 도구로 활용되었으며, 1937~1938년에 절정에 달했다.",
    keyword: "대숙청",
    tags: ["13주차", "기출문제", "대숙청"],
    isActive: true
  }),
  q({
    id: "V0-W13-013",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "홀로도모르란 무엇인가?",
    options: ["대숙청 시기 스탈린의 비밀 경찰 조직", "스탈린이 운영했던 정치범 수용소의 이름", "우크라이나의 대기근으로 수백만명이 굶어죽은 사건", "농민들이 수용되었던 집단농장의 별칭"],
    answer: 3,
    explanation: "홀로도모르는 1930년대 초 우크라이나에서 발생한 대기근을 가리키는 말이다.",
    wrongExplanation: "비밀경찰 조직은 NKVD, 정치범 수용소는 굴라그와 관련되며, 집단농장의 별칭이 아니다.",
    keyword: "홀로도모르",
    tags: ["13주차", "기출문제", "홀로도모르"],
    isActive: true
  }),
  q({
    id: "V0-W13-014",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린에 대한 설명으로 적절하지 않은 것은?",
    options: ["소련의 변방인 조지아 출신이다", "젊은 시절부터 마르크스와 레닌의 사상에 경도되었다", "본명은 이오세브 주가슈빌리이다", "레닌은 죽을 때까지 스탈린을 총애했다"],
    answer: 4,
    explanation: "레닌은 말년에 스탈린에 대해 비판적 견해를 보였으므로, 죽을 때까지 총애했다는 설명은 부적절하다.",
    wrongExplanation: "스탈린은 조지아 출신이며, 본명은 이오세브 주가슈빌리이다. 젊은 시절 혁명 사상에 영향을 받았다.",
    keyword: "스탈린 생애",
    tags: ["13주차", "기출문제", "스탈린 생애"],
    isActive: true
  }),
  q({
    id: "V0-W13-015",
    version: "V0",
    week: 13,
    source: "[업로드 이미지] 13주차 세계사 기출",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린 시대의 대표적 특징이라 보기 힘든 것은?",
    options: ["중앙집권국가로의 변신", "영구혁명론", "나치즘에 대한 저항", "대숙청"],
    answer: 2,
    explanation: "영구혁명론은 트로츠키와 관련된 노선이며, 스탈린은 일국사회주의 노선을 내세웠다.",
    wrongExplanation: "중앙집권화, 나치즘에 대한 저항, 대숙청은 스탈린 시대의 특징과 관련된다.",
    keyword: "스탈린 체제",
    tags: ["13주차", "기출문제", "스탈린 체제"],
    isActive: true
  }),
];

const WEEK_09_V3: Question[] = [
  {
    id: 'V3-W09-001',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명 (1).pdf',
    type: 'single_choice',
    difficulty: 'hard',
    question:
      '1789년의 권리 담론이 곧바로 식민지 현실의 보편적 권리로 작동하지 않았음을 가장 선명하게 드러내는 사례로 적절한 것은?',
    options: [
      '삼부회 소집을 통해 신분제 내부 조정이 시도된 일',
      '생도맹그의 흑인노예들이 보편 권리의 언어를 식민지 현실에서 다시 혁명화한 일',
      '1791년 헌법을 통해 입헌군주제가 제도화된 일',
      '나폴레옹이 개선문을 통해 제국의 위엄을 시각화한 일',
    ],
    answer: 2,
    explanation:
      '강의노트에서 아이티 혁명은 프랑스 혁명의 보편주의가 식민지·인종 질서에서는 곧바로 보편으로 작동하지 않았음을 드러내는 사례로 읽힌다. 생도맹그의 노예반란이 독립혁명으로 발전했다는 점이 핵심이다.',
    wrongExplanation:
      '1번은 프랑스 본국 정치 전개이고, 3번은 본국 헌정질서 문제이며, 4번은 나폴레옹 제국의 상징 문제이다.',
    keyword: '아이티 혁명과 보편주의의 한계',
    tags: ['9주차', '아이티혁명', '인권선언', '식민지'],
    isActive: true,
  },
  {
    id: 'V3-W09-002',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(02차시)_인물_나폴레옹 (1).pdf',
    type: 'single_choice',
    difficulty: 'hard',
    question:
      "강의노트의 서술 기준에서 나폴레옹이 프랑스 혁명을 '계승'했다고 평가될 수 있는 대목으로 가장 적절한 것은?",
    options: [
      '러시아 원정을 통해 유럽 전체를 재편한 점',
      '브뤼메르 쿠데타로 불안정한 정국을 종결한 점',
      '세인트헬레나 유배 이후 신화적 이미지를 획득한 점',
      '혁명의 성과를 헌정·법제의 형태로 고정한 점',
    ],
    answer: 4,
    explanation:
      '강의노트는 나폴레옹을 혁명의 종결자로만 보지 않고, 혁명의 성과를 제도화한 계승자로도 본다. 따라서 군사적 승리보다 제도화가 더 핵심이다.',
    wrongExplanation: '1번과 2번은 권력 확대·장악에 가깝고, 3번은 후대 이미지 변천의 문제이다.',
    keyword: '나폴레옹의 혁명 계승',
    tags: ['9주차', '나폴레옹', '프랑스혁명', '헌정'],
    isActive: true,
  },
  {
    id: 'V3-W09-003',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'single_choice',
    difficulty: 'hard',
    question: '다음 중 나폴레옹 이후의 유럽 질서와 직접 연결해 보기 어려운 것은?',
    options: ['빈 체제의 성립', '로맨티시즘의 확산', '미합중국의 건설', '그리스 독립투쟁의 전개'],
    answer: 3,
    explanation:
      '미합중국의 건설은 미국 독립혁명 과정에서 형성된 문제로, 나폴레옹 이후 유럽 질서의 산물로 보기 어렵다. 나머지는 모두 나폴레옹 이후 유럽 재편과 연결된다.',
    wrongExplanation: '1번, 2번, 4번은 모두 나폴레옹 전쟁 이후의 유럽 분위기와 직접 관련된다.',
    keyword: '나폴레옹 이후 유럽',
    tags: ['9주차', '나폴레옹', '유럽질서', '빈체제'],
    isActive: true,
  },
  {
    id: 'V3-W09-004',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'combo_choice',
    difficulty: 'hard',
    question: `다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 옳은 것을 모두 고른 것은?\n\nㄱ. 인간과 시민의 권리선언은 공포정치보다 앞선다.\nㄴ. 상킬로트와 자코뱅은 급진화 국면과 연결된다.\nㄷ. 1791년 헌법은 공포정치의 산물이다.\nㄹ. 혁명재판소와 반혁명 혐의자 체포법은 공포정치와 연결된다.`,
    options: ['ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄹ', 'ㄱ, ㄴ, ㄹ'],
    answer: 4,
    explanation:
      '권리선언은 1789년이고 공포정치는 그보다 뒤이다. 자코뱅·상킬로트·혁명재판소·혐의자 체포법은 모두 급진화와 공포정치 국면에서 읽힌다.',
    wrongExplanation: 'ㄷ은 틀리다. 1791년 헌법은 입헌군주제 국면과 관련된다.',
    keyword: '공포정치와 혁명 급진화',
    tags: ['9주차', '프랑스혁명', '공포정치', '자코뱅'],
    isActive: true,
  },
  {
    id: 'V3-W09-005',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'combo_choice',
    difficulty: 'hard',
    question: `다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 옳은 것을 모두 고른 것은?\n\nㄱ. 미국 독립전쟁의 종결은 파리조약으로 공식화되었다.\nㄴ. 프랑스 혁명은 처음부터 공포정치의 형식으로만 전개되었다.\nㄷ. 바스티유 함락은 삼부회 소집 이후의 사건이다.\nㄹ. 아이티 혁명은 프랑스 혁명의 보편주의를 식민지 차원에서 다시 묻게 만들었다.`,
    options: ['ㄱ, ㄷ, ㄹ', 'ㄱ, ㄴ', 'ㄴ, ㄹ', 'ㄱ, ㄴ, ㄷ'],
    answer: 1,
    explanation:
      '파리조약은 미국 독립전쟁의 공식 종결과 연결되고, 바스티유 함락은 삼부회 이후이며, 아이티 혁명은 프랑스 혁명의 보편주의 한계를 드러낸다. 프랑스 혁명을 처음부터 공포정치로 환원할 수는 없다.',
    wrongExplanation: 'ㄴ이 틀리므로 2번, 3번, 4번은 성립하지 않는다.',
    keyword: '미국 독립혁명과 프랑스 혁명 비교',
    tags: ['9주차', '미국독립혁명', '프랑스혁명', '아이티혁명'],
    isActive: true,
  },
  {
    id: 'V3-W09-006',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명 (1).pdf',
    type: 'combo_choice',
    difficulty: 'hard',
    question: `다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 옳은 것을 모두 고른 것은?\n\nㄱ. 혁명 이전 생도맹그 인구에서 가장 큰 비중을 차지한 것은 흑인노예였다.\nㄴ. 투생 루베르튀르는 노예반란을 독립혁명으로 성장시키는 데 핵심적이었다.\nㄷ. 인간과 시민의 권리선언은 유색인에게 곧바로 아무 제약 없이 적용되었다.\nㄹ. 코스타리카는 아이티와 함께 서인도제도의 핵심 섬 국가로 묶인다.`,
    options: ['ㄱ, ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄹ', 'ㄱ, ㄴ, ㄷ'],
    answer: 2,
    explanation:
      '강의노트 기준으로 생도맹그의 최대 인구층은 흑인노예이며, 투생 루베르튀르는 아이티 혁명의 선구자이자 노예반란을 독립혁명의 차원으로 끌어올린 핵심 인물이다. 유색인에게 권리선언이 보편적으로 적용되었다는 진술과 코스타리카를 서인도제도 국가로 묶는 진술은 틀리다.',
    wrongExplanation: 'ㄷ, ㄹ이 틀리므로 1번, 3번, 4번은 성립하지 않는다.',
    keyword: '생도맹그와 투생 루베르튀르',
    tags: ['9주차', '아이티혁명', '생도맹그', '투생루베르튀르'],
    isActive: true,
  },
  {
    id: 'V3-W09-007',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'sequence_choice',
    difficulty: 'hard',
    question: `다음 사건을 발생한 순서대로 올바르게 배열한 것은?\n\nㄱ. 7년전쟁\nㄴ. 보스턴 차 사건\nㄷ. 대륙회의\nㄹ. 파리조약`,
    options: ['ㄴ-ㄱ-ㄷ-ㄹ', 'ㄱ-ㄷ-ㄴ-ㄹ', 'ㄱ-ㄴ-ㄷ-ㄹ', 'ㄷ-ㄴ-ㄱ-ㄹ'],
    answer: 3,
    explanation:
      '미국 독립혁명 서사는 7년전쟁 이후 식민지 갈등이 심화되고, 보스턴 차 사건과 대륙회의를 거쳐 파리조약으로 귀결된다.',
    wrongExplanation: '보스턴 차 사건과 대륙회의는 모두 7년전쟁보다 뒤이고, 파리조약은 최후 단계이다.',
    keyword: '미국 독립혁명 순서',
    tags: ['9주차', '미국독립혁명', '순서배열', '파리조약'],
    isActive: true,
  },
  {
    id: 'V3-W09-008',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'sequence_choice',
    difficulty: 'hard',
    question: `다음 사건을 발생한 순서대로 올바르게 배열한 것은?\n\nㄱ. 삼부회 소집\nㄴ. 바스티유 함락\nㄷ. 인간과 시민의 권리선언\nㄹ. 공포정치`,
    options: ['ㄱ-ㄴ-ㄷ-ㄹ', 'ㄴ-ㄱ-ㄷ-ㄹ', 'ㄱ-ㄷ-ㄴ-ㄹ', 'ㄷ-ㄴ-ㄱ-ㄹ'],
    answer: 1,
    explanation:
      '프랑스 혁명은 삼부회 소집, 바스티유 함락, 권리선언의 공표, 그리고 훨씬 뒤의 공포정치 순으로 전개된다.',
    wrongExplanation: '권리선언은 바스티유 함락보다 뒤이며, 공포정치는 가장 뒤이다.',
    keyword: '프랑스 혁명 전개 순서',
    tags: ['9주차', '프랑스혁명', '순서배열', '권리선언'],
    isActive: true,
  },
  {
    id: 'V3-W09-009',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명 (1).pdf',
    type: 'matching_choice',
    difficulty: 'hard',
    question: '다음 인물과 관련된 설명으로 적절한 것은?',
    options: [
      '로베스피에르 — 생도맹그의 독립혁명을 이끈 선구자',
      '투생 루베르튀르 — 생도맹그의 노예반란을 독립혁명 수준으로 성장시킨 인물',
      '나폴레옹 — 인간과 시민의 권리선언의 한계를 식민지에서 폭로한 인물',
      '장자크 데살린 — 1791년 헌법을 통해 입헌군주제를 정착시킨 인물',
    ],
    answer: 2,
    explanation:
      '투생 루베르튀르는 아이티 혁명의 선구자이자 노예반란을 독립혁명의 차원으로 끌어올린 핵심 인물로 제시된다.',
    wrongExplanation: '1번, 3번, 4번은 각각 인물과 사건의 연결이 뒤바뀌어 있다.',
    keyword: '투생 루베르튀르',
    tags: ['9주차', '아이티혁명', '인물연결', '투생루베르튀르'],
    isActive: true,
  },
  {
    id: 'V3-W09-010',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'matching_choice',
    difficulty: 'hard',
    question: '다음 개념과 설명의 연결로 적절한 것은?',
    options: [
      '상킬로트 — 입헌군주제 질서를 온건하게 지지한 세력',
      '1791년 헌법 — 공포정치의 대표적 통치법',
      '개선문 — 아이티 혁명의 기억을 보존하는 상징물',
      '인간과 시민의 권리선언 — 공포정치보다 앞서 제시된 혁명의 규범적 선언',
    ],
    answer: 4,
    explanation:
      '권리선언은 프랑스 혁명 초기에 제시된 규범적 선언이며 공포정치보다 이르다. 나머지는 개념의 성격이 뒤바뀌어 있다.',
    wrongExplanation:
      '1번 상킬로트는 급진 대중과 연결되고, 2번의 1791년 헌법은 입헌군주제 국면, 3번의 개선문은 나폴레옹 제국 상징이다.',
    keyword: '인간과 시민의 권리선언',
    tags: ['9주차', '프랑스혁명', '개념연결', '권리선언'],
    isActive: true,
  },
  {
    id: 'V3-W09-011',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽 (1).pdf',
    type: 'negative_choice',
    difficulty: 'hard',
    question: '다음 중 공포정치와 직접 연결되기 어려운 것은?',
    options: ['혁명재판소', '최고 가격제', '1791년 헌법', '반혁명 혐의자 체포법'],
    answer: 3,
    explanation:
      '1791년 헌법은 입헌군주제의 산물로, 공포정치와 직접 연결되는 조치가 아니다. 나머지는 모두 공포정치기의 급진적 통치와 관련된다.',
    wrongExplanation: '1번, 2번, 4번은 공포정치와 연결되는 제도·조치들이다.',
    keyword: '공포정치',
    tags: ['9주차', '프랑스혁명', '부정형', '공포정치'],
    isActive: true,
  },
  {
    id: 'V3-W09-012',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(02차시)_인물_나폴레옹 (1).pdf',
    type: 'negative_choice',
    difficulty: 'hard',
    question: '다음 중 프랑스 혁명의 3대 기본 정신에 속하지 않는 것은?',
    options: ['공화', '자유', '평등', '박애'],
    answer: 1,
    explanation:
      '강의노트에서 프랑스 혁명의 3대 기본 정신은 자유, 평등, 박애로 제시된다. 공화는 중요한 정치 형태이지만 이 3대 정신 자체는 아니다.',
    wrongExplanation: '2번, 3번, 4번은 모두 3대 기본 정신에 포함된다.',
    keyword: '자유 평등 박애',
    tags: ['9주차', '프랑스혁명', '부정형', '자유평등박애'],
    isActive: true,
  },
  {
    id: 'V3-W09-013',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명 (1).pdf',
    type: 'quote_choice',
    difficulty: 'hard',
    question:
      "다음 설명이 가리키는 것으로 가장 적절한 것은?\n\n'보편적 인간을 선언한 혁명의 언어가 있었지만, 식민지의 흑인과 유색인은 그 범주에서 곧바로 승인되지 않았다. 이 모순은 카리브 해의 혁명에서 가장 급진적으로 드러났다.'",
    options: ['빈 체제', '아이티 혁명', '러시아 원정', '7년전쟁'],
    answer: 2,
    explanation:
      '이 설명은 아이티 혁명을 통해 드러난 인권선언의 한계를 가리킨다. 강의노트는 식민지 현실에서 보편주의가 균열되는 지점을 아이티 혁명으로 제시한다.',
    wrongExplanation: '1번, 3번, 4번은 식민지 인종질서와 권리담론의 모순을 직접 가리키지 않는다.',
    keyword: '아이티 혁명',
    tags: ['9주차', '사료형', '아이티혁명', '보편주의'],
    isActive: true,
  },
  {
    id: 'V3-W09-014',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(02차시)_인물_나폴레옹 (1).pdf',
    type: 'quote_choice',
    difficulty: 'hard',
    question:
      "다음 설명이 가리키는 인물로 가장 적절한 것은?\n\n'그는 혁명을 끝낸 인물로 비판되기도 하지만, 동시에 혁명의 일부 성과를 헌정과 제도의 언어로 굳혔다는 점에서 계승자로도 해석된다. 제국의 위엄을 과시하는 상징물도 남겼다.'",
    options: ['로베스피에르', '루이 16세', '투생 루베르튀르', '나폴레옹'],
    answer: 4,
    explanation:
      '혁명의 종결자/계승자라는 이중 평가는 나폴레옹을 가리킨다. 개선문 역시 나폴레옹 제국의 상징으로 강의노트에서 다루어진다.',
    wrongExplanation: '1번은 공포정치, 2번은 구체제 군주, 3번은 아이티 혁명 인물이다.',
    keyword: '나폴레옹',
    tags: ['9주차', '사료형', '나폴레옹', '개선문'],
    isActive: true,
  },
  {
    id: 'V3-W09-015',
    version: 'V3',
    week: 9,
    source: '[강의노트] 세계사_09주차(02차시)_인물_나폴레옹 (1).pdf / [강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명 (1).pdf',
    type: 'comparison_choice',
    difficulty: 'hard',
    question: '다음 중 나폴레옹과 아이티 혁명을 함께 놓고 볼 때 강의노트의 관점에 가장 부합하는 비교는?',
    options: [
      '둘 다 유럽 내부의 자유주의 헌정 질서를 안정화한 과정이었다.',
      '둘 다 식민지 질서를 강화해 인권선언의 범위를 축소한 사건이었다.',
      '나폴레옹은 혁명의 성과를 유럽 권력의 제도 속에 흡수했고, 아이티 혁명은 그 보편주의가 식민지에서 얼마나 배제적이었는지 폭로했다.',
      '둘 다 입헌군주제를 수립함으로써 혁명의 급진성을 차단했다.',
    ],
    answer: 3,
    explanation:
      '강의노트의 핵심 대비는 유럽 본국의 혁명 성과가 제도화되는 과정과, 식민지에서 그 보편주의의 한계가 폭로되는 과정의 대비이다. 나폴레옹과 아이티 혁명을 함께 보면 이 긴장이 선명하다.',
    wrongExplanation: '1번, 2번, 4번은 둘을 지나치게 동일한 사건으로 처리해 강의노트의 대비 구조를 놓친다.',
    keyword: '나폴레옹과 아이티 혁명 비교',
    tags: ['9주차', '비교형', '나폴레옹', '아이티혁명'],
    isActive: true,
  },
];

const WEEK_10_V3: Question[] = [
  {
    id: 'V3-W10-001',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf',
    type: 'single_choice',
    difficulty: 'hard',
    question: '1848년 독일 자유주의 혁명의 정치적 실험을 가장 직접적으로 보여주는 것은?',
    options: ['보름스 의회', '베를린 의회', '프랑크푸르트 의회', '바이마르 의회'],
    answer: 3,
    explanation:
      '프랑크푸르트 의회는 1848년 독일 지역의 자유주의·민족주의 흐름을 제도화하려는 시도로 강의노트에서 제시된다.',
    wrongExplanation: '1번은 종교개혁 맥락, 4번은 20세기 독일, 2번은 강의노트의 해당 맥락과 다르다.',
    keyword: '프랑크푸르트 의회',
    tags: ['10주차', '1848혁명', '독일', '프랑크푸르트의회'],
    isActive: true,
  },
  {
    id: 'V3-W10-002',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf',
    type: 'single_choice',
    difficulty: 'hard',
    question: '다음 중 강의노트가 제시한 19세기 도시화의 결과로 보기 가장 어려운 것은?',
    options: ['도시화만으로 삶의 질이 전반적으로 향상되었다는 서술', '중산층의 교외 이주', '출퇴근의 등장', '도시정비의 가속화'],
    answer: 1,
    explanation:
      '강의노트는 19세기 도시화를 단순한 생활 향상으로 보지 않는다. 위생, 빈곤, 노동 문제를 동반하는 복합적 변화로 다룬다.',
    wrongExplanation: '2번, 3번, 4번은 모두 19세기 도시적 삶의 변화로 정리된다.',
    keyword: '19세기 도시화',
    tags: ['10주차', '도시화', '중산층', '도시정비'],
    isActive: true,
  },
  {
    id: 'V3-W10-003',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf',
    type: 'single_choice',
    difficulty: 'hard',
    question: '강의노트 기준에서 영국 산업혁명의 핵심 조건으로 보기 가장 어려운 것은?',
    options: ['풍부한 석탄', '식민지와 해외 시장', '탄탄한 자본 축적', '숙련 장인 집단 자체의 우월성'],
    answer: 4,
    explanation:
      '강의노트는 산업혁명의 핵심 배경으로 석탄, 자본력, 시장을 강조한다. 전통적 장인 집단의 숙련 자체를 결정적 원인으로 전면화하지 않는다.',
    wrongExplanation: '1번, 2번, 3번은 산업혁명 배경으로 반복적으로 제시된다.',
    keyword: '영국 산업혁명 원인',
    tags: ['10주차', '산업혁명', '영국', '원인'],
    isActive: true,
  },
  {
    id: 'V3-W10-004',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf',
    type: 'combo_choice',
    difficulty: 'hard',
    question: `다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 옳은 것을 모두 고른 것은?\n\nㄱ. 1848년 2월 혁명은 프랑스 제2공화정 수립과 연결된다.\nㄴ. 프랑크푸르트 의회는 독일 자유주의·민족주의의 정치적 실험이었다.\nㄷ. 1848년 혁명은 유럽의 군주정 질서를 더욱 안정적으로 강화하기 위해 일어난 운동이었다.\nㄹ. 1848년의 혁명 정세는 프랑스와 독일을 전혀 무관한 별개 현상으로만 보게 만든다.`,
    options: ['ㄱ, ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄹ', 'ㄱ, ㄴ, ㄷ'],
    answer: 2,
    explanation:
      '프랑스의 2월 혁명과 독일의 프랑크푸르트 의회는 모두 1848년의 자유주의·민족주의 흐름 속에 놓인다. ㄷ, ㄹ은 모두 그 성격을 잘못 이해한 진술이다.',
    wrongExplanation: 'ㄷ은 혁명의 취지를 뒤집은 진술이고, ㄹ은 동시대 유럽 정세의 연동성을 지운다.',
    keyword: '1848년 혁명',
    tags: ['10주차', '1848혁명', '제2공화정', '프랑크푸르트의회'],
    isActive: true,
  },
  {
    id: 'V3-W10-005',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf',
    type: 'combo_choice',
    difficulty: 'hard',
    question: `다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 옳은 것을 모두 고른 것은?\n\nㄱ. 백화점의 등장은 19세기 도시 소비문화의 일부로 읽힌다.\nㄴ. 도시 공간은 계층과 기능의 분화 없이 평준화되었다.\nㄷ. 중간계급은 근면·성실·책임 같은 가치를 내세웠다.\nㄹ. 여성상품의 유행 역시 도시 소비문화의 확장과 연결된다.`,
    options: ['ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄷ, ㄹ', 'ㄱ, ㄴ, ㄷ'],
    answer: 3,
    explanation:
      '강의노트는 도시 소비문화의 확대 속에서 백화점과 여성상품을 언급하며, 중간계급의 가치로 근면·성실을 제시한다. 도시 공간은 평준화가 아니라 분화되었다.',
    wrongExplanation: 'ㄴ이 틀리므로 1번, 2번, 4번은 성립하지 않는다.',
    keyword: '도시 소비문화',
    tags: ['10주차', '도시화', '백화점', '부르주아'],
    isActive: true,
  },
  {
    id: 'V3-W10-006',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf',
    type: 'combo_choice',
    difficulty: 'hard',
    question: `다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 옳은 것을 모두 고른 것은?\n\nㄱ. 산업혁명은 증기기관, 공장제, 대량생산과 직접 연결된다.\nㄴ. 산업혁명의 역사적 파급은 유럽의 세계 주도와 무관하다.\nㄷ. 산업혁명은 근대적 삶의 공간 형성과도 연결된다.\nㄹ. 산업혁명은 후대 사회주의적 문제의식과도 간접적으로 이어진다.`,
    options: ['ㄱ, ㄷ, ㄹ', 'ㄱ, ㄴ', 'ㄴ, ㄹ', 'ㄱ, ㄴ, ㄷ'],
    answer: 1,
    explanation:
      '강의노트는 산업혁명을 생산체계의 변동뿐 아니라 근대적 삶의 공간 형성, 유럽의 세계적 우위, 사회문제의 심화와 연결한다. ㄴ은 틀리다.',
    wrongExplanation: 'ㄴ이 틀리므로 2번, 3번, 4번은 성립하지 않는다.',
    keyword: '산업혁명의 의의',
    tags: ['10주차', '산업혁명', '대량생산', '근대공간'],
    isActive: true,
  },
  {
    id: 'V3-W10-007',
    version: 'V3',
    week: 10,
    source:
      '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf / [강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf / [강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf',
    type: 'sequence_choice',
    difficulty: 'hard',
    question: `다음 흐름을 발생 순서대로 올바르게 배열한 것은?\n\nㄱ. 산업혁명의 본격화\nㄴ. 1848년 2월 혁명\nㄷ. 프랑크푸르트 의회\nㄹ. 인상파 미술의 등장`,
    options: ['ㄴ-ㄱ-ㄷ-ㄹ', 'ㄱ-ㄷ-ㄴ-ㄹ', 'ㄴ-ㄷ-ㄱ-ㄹ', 'ㄱ-ㄴ-ㄷ-ㄹ'],
    answer: 4,
    explanation:
      '산업혁명은 1848년보다 앞서고, 프랑스 2월 혁명과 프랑크푸르트 의회는 1848년의 연동된 정치 사건이며, 인상파는 그보다 뒤의 미술사 흐름이다.',
    wrongExplanation: '프랑크푸르트 의회는 1848년 2월 혁명과 같은 연도 맥락이지만 산업혁명보다 먼저일 수는 없다.',
    keyword: '19세기 유럽 전개 순서',
    tags: ['10주차', '산업혁명', '1848혁명', '인상파'],
    isActive: true,
  },
  {
    id: 'V3-W10-008',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf',
    type: 'sequence_choice',
    difficulty: 'hard',
    question: `다음 미술사 흐름을 순서대로 올바르게 배열한 것은?\n\nㄱ. 앵그르의 고전주의적 지향\nㄴ. 들라크루아의 낭만주의적 흐름\nㄷ. 쿠르베·밀레의 사실주의\nㄹ. 마네를 거쳐 인상파의 출현`,
    options: ['ㄱ-ㄷ-ㄴ-ㄹ', 'ㄱ-ㄴ-ㄷ-ㄹ', 'ㄴ-ㄱ-ㄷ-ㄹ', 'ㄷ-ㄴ-ㄱ-ㄹ'],
    answer: 2,
    explanation:
      '강의노트의 미술사 전개는 대체로 고전주의, 낭만주의, 사실주의, 그리고 마네를 거쳐 인상파로 이어지는 흐름으로 정리된다.',
    wrongExplanation: '들라크루아와 쿠르베/밀레, 그리고 마네의 위치가 뒤섞이면 강의노트의 흐름과 어긋난다.',
    keyword: '19세기 미술사 흐름',
    tags: ['10주차', '인상파', '고전주의', '사실주의'],
    isActive: true,
  },
  {
    id: 'V3-W10-009',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf',
    type: 'matching_choice',
    difficulty: 'hard',
    question: '다음 개념과 설명의 연결로 적절한 것은?',
    options: [
      '제2공화정 — 보불전쟁 이후의 프랑스 체제',
      '프랑크푸르트 의회 — 종교개혁기 루터 재판과 직결된 기구',
      '프랑크푸르트 의회 — 독일 자유주의 혁명을 현실 정치 질서로 옮기려 한 실험',
      '제2공화정 — 나폴레옹 1세의 제정 체제를 가리키는 명칭',
    ],
    answer: 3,
    explanation:
      '프랑크푸르트 의회는 독일 자유주의·민족주의 세력이 정치 현실화를 시도한 기구이다. 제2공화정은 1848년 프랑스의 체제 변화와 연결된다.',
    wrongExplanation: '1번과 4번은 제2공화정 시기를 잘못 잡았고, 2번은 보름스 의회와 혼동한 것이다.',
    keyword: '제2공화정과 프랑크푸르트 의회',
    tags: ['10주차', '1848혁명', '개념연결', '제2공화정'],
    isActive: true,
  },
  {
    id: 'V3-W10-010',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf',
    type: 'matching_choice',
    difficulty: 'hard',
    question: '다음 인물과 설명의 연결로 적절한 것은?',
    options: [
      '마네 — 전통 살롱 미술을 흔들며 인상파의 시작점으로 다루어지는 인물',
      '밀레 — 대표적 인상파 화가',
      '앵그르 — 도시의 속도와 거친 붓질을 전면화한 인상주의자',
      '카바넬 — 인상파의 집단전시를 주도한 핵심 화가',
    ],
    answer: 1,
    explanation:
      '강의노트는 마네를 전통 아카데미 미술과 다른 근대적 표현의 출발점, 곧 인상파의 시작과 연결한다.',
    wrongExplanation: '2번의 밀레는 사실주의, 3번의 앵그르는 고전주의, 4번의 카바넬은 관전파 쪽 맥락이다.',
    keyword: '마네',
    tags: ['10주차', '인상파', '마네', '인물연결'],
    isActive: true,
  },
  {
    id: 'V3-W10-011',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf',
    type: 'negative_choice',
    difficulty: 'hard',
    question: '다음 중 강의노트가 제시한 부르주아 가치에 속하지 않는 것은?',
    options: ['성실함', '근면함', '남성다움', '세련됨'],
    answer: 4,
    explanation:
      '강의노트의 정리 기준에서 부르주아지는 근면·성실·책임·남성적 가장 역할과 연결된다. 세련됨은 그 자체로 핵심 가치로 제시되지 않는다.',
    wrongExplanation: '1번, 2번, 3번은 모두 중간계급의 자기표상과 연결된다.',
    keyword: '부르주아 가치',
    tags: ['10주차', '부르주아', '중간계급', '부정형'],
    isActive: true,
  },
  {
    id: 'V3-W10-012',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf',
    type: 'negative_choice',
    difficulty: 'hard',
    question: '다음 중 산업혁명의 역사적 의의로 보기 가장 어려운 것은?',
    options: ['유럽의 세계 주도 가능성 확대', '인구의 급성장 자체를 핵심 의의로 보는 해석', '근대적 삶의 공간 형성', '후대 사회문제와 운동의 배경 제공'],
    answer: 2,
    explanation:
      '강의노트는 산업혁명의 의의를 생산·공간·세계질서·사회문제의 변화에서 찾는다. 인구의 급성장 자체를 핵심 의의로 설정하지는 않는다.',
    wrongExplanation: '1번, 3번, 4번은 산업혁명의 구조적 파급과 연결된다.',
    keyword: '산업혁명의 의의',
    tags: ['10주차', '산업혁명', '부정형', '근대사회'],
    isActive: true,
  },
  {
    id: 'V3-W10-013',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf',
    type: 'quote_choice',
    difficulty: 'hard',
    question:
      "다음 설명이 가리키는 미술사 흐름으로 가장 적절한 것은?\n\n'도시의 순간, 변화의 속도, 빛의 인상, 거친 붓질, 개성과 독창성을 중시한다.'",
    options: ['고전주의', '낭만주의', '인상파', '신고전주의'],
    answer: 3,
    explanation: '강의노트는 인상파의 특징으로 변화와 속도, 도시의 일상, 거친 붓질과 순간의 인상을 제시한다.',
    wrongExplanation: '1번, 2번, 4번은 각각 다른 미학적 중심을 가진 흐름이다.',
    keyword: '인상파 특징',
    tags: ['10주차', '사료형', '인상파', '미술사'],
    isActive: true,
  },
  {
    id: 'V3-W10-014',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf',
    type: 'quote_choice',
    difficulty: 'hard',
    question:
      "다음 설명이 가리키는 것으로 가장 적절한 것은?\n\n'석탄, 자본, 해외시장, 공장제와 증기동력이 결합하면서 영국에서 먼저 폭발적으로 전개된 변화'",
    options: ['산업혁명', '2월 혁명', '도시 개조', '인상파 운동'],
    answer: 1,
    explanation:
      '이 설명은 영국 산업혁명의 핵심 조건과 전개를 요약한 것이다. 강의노트는 석탄, 자본력, 시장, 공장제를 반복적으로 묶어 제시한다.',
    wrongExplanation: '2번, 3번, 4번은 각각 정치혁명, 도시화, 미술운동이다.',
    keyword: '산업혁명',
    tags: ['10주차', '사료형', '산업혁명', '영국'],
    isActive: true,
  },
  {
    id: 'V3-W10-015',
    version: 'V3',
    week: 10,
    source: '[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf',
    type: 'comparison_choice',
    difficulty: 'hard',
    question: '다음 중 앵그르와 마네를 구분하는 설명으로 가장 적절한 것은?',
    options: [
      '앵그르는 산업혁명기의 도시문화를 그렸고, 마네는 왕정복고기의 종교화를 그렸다.',
      '앵그르는 사실주의 농민화, 마네는 신고전주의 역사화를 대표한다.',
      '앵그르는 공장제의 시각적 기록에 치중했고, 마네는 제2공화정의 정치전단을 제작했다.',
      '앵그르는 선명한 윤곽과 질서를 중시하는 고전적 지향, 마네는 전통 관전 체계를 흔드는 근대적 전환의 고리로 읽힌다.',
    ],
    answer: 4,
    explanation:
      '강의노트는 앵그르를 고전주의적 질서의 대표로, 마네를 인상파로 넘어가는 근대적 전환점으로 배치한다. 두 사람의 차이는 바로 이 미술사적 위치의 차이이다.',
    wrongExplanation: '1번, 2번, 3번은 모두 두 인물의 성격을 잘못 섞은 진술이다.',
    keyword: '앵그르와 마네 비교',
    tags: ['10주차', '비교형', '앵그르', '마네'],
    isActive: true,
  },
];

const WEEK_11_V3: Question[] = [
  {
    id: "V3-W11-001",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 후반기 유럽에서 민족주의가 수행한 역할에 대한 설명으로 가장 적절한 것은?",
    options: ["유럽의 지도를 다시 그리는 강력한 사회적 신념체계로 작동하였다.", "산업혁명 이전의 수공업 질서를 복원하려는 경제적 반동으로 기능하였다.", "제국주의 팽창을 중단시키는 평화주의적 국제 질서로 정착하였다.", "식민지 주민의 정치적 주권을 즉각 승인하는 보편적 해방 원리로만 작용하였다."],
    answer: 1,
    explanation: "강의노트는 민족주의를 19세기 유럽에서 강력한 사회적 신념체계로 제시한다. 또한 민족주의가 유럽의 지도를 다시 그리는 힘으로 작동했음을 강조한다.",
    wrongExplanation: "2번은 산업혁명 이전 질서 복원이 핵심이 아니므로 틀렸다. 3번은 제국주의와 전쟁의 긴장을 설명하지 못한다. 4번은 식민지 해방 원리로만 단순화해 부적절하다.",
    keyword: "민족주의",
    tags: ["11주차", "민족주의", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W11-002",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 이탈리아와 독일의 통일 과정에 대한 설명으로 옳은 것은?",
    options: ["이탈리아 통일은 비스마르크의 철혈정책에 의해 주도되었다.", "독일 통일은 프로이센 중심의 전쟁과 정치적 통합 과정을 통해 전개되었다.", "양국의 통일은 모두 교황권 강화와 로마 교회의 직접 통치 확대를 목적으로 하였다.", "이탈리아와 독일은 1848년 혁명 직후 동시에 완성된 단일 국민국가가 되었다."],
    answer: 2,
    explanation: "강의노트는 독일 통일을 프로이센 중심의 정치·군사적 통합 과정으로 제시한다. 덴마크 전쟁, 오스트리아와의 전쟁, 프랑스와의 전쟁이 통일 과정과 연결된다.",
    wrongExplanation: "1번은 이탈리아와 독일의 주도 인물을 혼동했다. 3번은 국민국가 형성과 교황권 강화를 혼동했다. 4번은 통일 완성 시기가 부정확하다.",
    keyword: "독일 통일",
    tags: ["11주차", "독일 통일", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W11-003",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "제1차 세계대전의 성격으로 보기 어려운 것은?",
    options: ["참호전과 장기전의 성격이 강했다.", "국가 전체가 동원되는 총력전의 양상을 보였다.", "제한된 왕조 간 분쟁으로 단기간에 종결되었다.", "전쟁을 경험한 세대에게 상실과 충격을 남겼다."],
    answer: 3,
    explanation: "강의노트는 제1차 세계대전을 참호전, 총력전, 상실의 세대와 연결한다. 따라서 제한된 왕조 간 단기전으로 보는 설명은 부적절하다.",
    wrongExplanation: "1번, 2번, 4번은 강의노트의 제1차 세계대전 설명과 부합한다.",
    keyword: "제1차 세계대전",
    tags: ["11주차", "제1차 세계대전", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W11-004",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(02차시)_테마탐구_신사와뱀파이어.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 영국 제국주의와 신사 담론의 관계에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 신사는 귀족적 전통과 중간계급의 부상 속에서 형성된 이상적 남성상이었다.\nㄴ. 신사 담론은 식민지 주민과 본국 시민 사이의 경계를 완전히 해체하였다.\nㄷ. 빅토리아 시대의 신사는 관리된 육체와 진중한 태도, 유능한 관리자의 이미지와 연결되었다.\nㄹ. 제국주의적 팽창은 신사를 제국을 운영할 수 있는 인물상으로 부각시켰다.",
    options: ["ㄱ, ㄴ", "ㄴ, ㄷ", "ㄴ, ㄹ", "ㄱ, ㄷ, ㄹ"],
    answer: 4,
    explanation: "강의노트는 신사를 귀족적 전통과 중간계급의 부상 속에서 형성된 이미지로 설명한다. 또한 관리된 육체, 진중한 태도, 유능한 관리자라는 표현을 통해 제국 운영과 신사 담론의 결합을 보여준다.",
    wrongExplanation: "ㄴ은 틀렸다. 강의노트는 식민지 주민과 본국 시민의 경계가 해체되었다기보다 제국주의적 위계가 형성되었음을 보여준다.",
    keyword: "신사 담론",
    tags: ["11주차", "신사", "제국주의", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W11-005",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 르완다와 키갈리에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 키갈리는 르완다의 수도로 제시된다.\nㄴ. 르완다는 1994년 제노사이드의 기억과 결합되어 설명된다.\nㄷ. 강의노트는 오늘날의 키갈리를 내전이 계속되는 폐허로만 규정한다.\nㄹ. 키갈리 제노사이드 추모관은 기억과 치유의 맥락에서 다루어진다.",
    options: ["ㄱ, ㄴ, ㄹ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "강의노트는 키갈리를 르완다의 수도로 제시하고, 1994년 제노사이드 및 그 이후의 기억·치유와 연결한다. 키갈리 제노사이드 추모관도 이 맥락에서 다루어진다.",
    wrongExplanation: "ㄷ은 틀렸다. 오늘날의 키갈리는 단순한 내전 지속 공간으로만 설명되지 않는다.",
    keyword: "키갈리",
    tags: ["11주차", "르완다", "키갈리", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W11-006",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 제1차 세계대전의 배경과 전개에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 독일의 통일은 유럽 세력균형의 변화와 연결되었다.\nㄴ. 제국주의적 경쟁은 전쟁의 긴장을 높이는 요인으로 제시된다.\nㄷ. 발칸 지역의 긴장은 전쟁 발발 배경과 무관하였다.\nㄹ. 전쟁은 참호전과 총력전의 방식으로 장기화되었다.",
    options: ["ㄱ, ㄷ", "ㄱ, ㄴ, ㄹ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
    answer: 2,
    explanation: "강의노트는 독일 통일, 제국주의 경쟁, 발칸 지역의 긴장을 제1차 세계대전의 배경과 연결한다. 전쟁의 전개에서는 참호전과 총력전이 강조된다.",
    wrongExplanation: "ㄷ은 틀렸다. 발칸 지역의 긴장은 제1차 세계대전 발발 배경과 연결된다.",
    keyword: "제1차 세계대전 배경",
    tags: ["11주차", "제1차 세계대전", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W11-007",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 독일제국 수립\nㄴ. 오스트리아-프로이센 전쟁\nㄷ. 덴마크 전쟁\nㄹ. 프랑스-프로이센 전쟁",
    options: ["ㄱ-ㄴ-ㄷ-ㄹ", "ㄴ-ㄷ-ㄹ-ㄱ", "ㄷ-ㄴ-ㄹ-ㄱ", "ㄹ-ㄷ-ㄴ-ㄱ"],
    answer: 3,
    explanation: "독일 통일 과정은 덴마크 전쟁, 오스트리아-프로이센 전쟁, 프랑스-프로이센 전쟁, 독일제국 수립의 흐름으로 제시된다.",
    wrongExplanation: "다른 배열은 독일 통일 과정에서 전쟁과 제국 수립의 순서를 뒤섞었다.",
    keyword: "독일 통일 순서",
    tags: ["11주차", "독일 통일", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W11-008",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 벨기에의 르완다 위임통치\nㄴ. 독일의 르완다 지배\nㄷ. 르완다 독립\nㄹ. 1994년 르완다 제노사이드",
    options: ["ㄱ-ㄴ-ㄷ-ㄹ", "ㄴ-ㄷ-ㄱ-ㄹ", "ㄹ-ㄷ-ㄴ-ㄱ", "ㄴ-ㄱ-ㄷ-ㄹ"],
    answer: 4,
    explanation: "르완다 역사는 독일 지배, 벨기에 위임통치, 르완다 독립, 1994년 제노사이드의 흐름으로 제시된다.",
    wrongExplanation: "1번은 독일 지배와 벨기에 지배의 순서를 뒤바꾸었다. 2번은 독립 시기를 잘못 배치했다. 3번은 제노사이드를 가장 앞에 두어 틀렸다.",
    keyword: "르완다 역사 순서",
    tags: ["11주차", "르완다", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W11-009",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 인물·개념과 설명의 연결로 옳은 것은?",
    options: ["비스마르크 — 독일 문제는 연설이나 다수결이 아니라 철과 피로 해결된다고 본 인물", "가리발디 — 프로이센 중심의 독일제국 수립을 주도한 철혈재상", "투치 — 영국 3C 정책의 세 거점 중 하나", "피터팬 — 제1차 세계대전의 직접 원인을 제공한 발칸 민족주의 조직"],
    answer: 1,
    explanation: "비스마르크의 ‘철과 피’ 표현은 프로이센 중심 독일 통일의 권력정치적 성격을 보여준다.",
    wrongExplanation: "2번은 가리발디와 비스마르크를 혼동했다. 3번은 르완다 민족 구성과 영국 제국주의 정책을 혼동했다. 4번은 문학 작품과 전쟁 원인을 잘못 연결했다.",
    keyword: "비스마르크",
    tags: ["11주차", "비스마르크", "연결형"],
    isActive: true
  },
  {
    id: "V3-W11-010",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(02차시)_테마탐구_신사와뱀파이어.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 작품과 강의노트의 해석이 바르게 연결된 것은?",
    options: ["『로빈슨 크루소』 — 빅토리아 시대 신사의 욕망과 공포를 보여주는 핵심 사례", "『드라큘라』 — 역식민화와 제국 내부의 불안이 투영된 텍스트", "『농담』 — 영국 중간계급의 신사 형성 과정을 묘사한 소설", "『빌러비드』 — 르완다 제노사이드 이후 가차차 법정을 직접 다룬 작품"],
    answer: 2,
    explanation: "강의노트는 브램 스토커의 『드라큘라』를 역식민화의 공포와 연결해 설명한다. 이는 제국주의 시대 영국 신사 담론의 욕망과 불안을 드러내는 사례이다.",
    wrongExplanation: "1번은 18세기 작품과 19세기 신사 담론을 직접 연결해 부적절하다. 3번은 14주차 『농담』과 혼동했다. 4번은 『빌러비드』의 주제를 잘못 연결했다.",
    keyword: "드라큘라",
    tags: ["11주차", "신사와 뱀파이어", "연결형"],
    isActive: true
  },
  {
    id: "V3-W11-011",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "제국주의와 식민지 경영에 대한 설명으로 적절하지 않은 것은?",
    options: ["제국주의는 기술과 군사력의 우위, 문명화 사명 담론과 결합하였다.", "대영제국은 ‘해가 지지 않는 나라’라는 표현으로 설명된다.", "식민지 경영은 본국과 식민지 사이의 정치적 위계를 제거하려는 평등주의 제도로 제시된다.", "식민지는 제국의 경제적·정치적 확장 구조 속에서 이해된다."],
    answer: 3,
    explanation: "강의노트는 제국주의를 기술과 군사력, 문명화 사명, 영국 제국의 확장과 연결한다. 식민지 경영은 평등주의 제도가 아니라 지배와 위계의 구조이다.",
    wrongExplanation: "1번, 2번, 4번은 강의노트의 제국주의 설명과 부합한다.",
    keyword: "제국주의",
    tags: ["11주차", "제국주의", "부정형"],
    isActive: true
  },
  {
    id: "V3-W11-012",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "르완다 제노사이드와 그 이후의 대응에 대한 설명으로 적절하지 않은 것은?",
    options: ["1994년 르완다에서 대규모 학살이 발생하였다.", "제노사이드 이후 기억과 치유의 문제가 중요한 과제로 제시되었다.", "가차차는 공동체 차원의 재판과 화해 과정으로 다루어진다.", "벨기에 식민통치는 후투와 투치를 구분하지 않는 완전한 평등 통치로 설명된다."],
    answer: 4,
    explanation: "강의노트는 벨기에 식민통치가 르완다 사회의 민족 구분과 권력구조에 영향을 주었다고 설명한다. 따라서 완전한 평등 통치라는 설명은 부적절하다.",
    wrongExplanation: "1번, 2번, 3번은 1994년 르완다 제노사이드와 그 이후 기억·치유 과정에 대한 설명으로 적절하다.",
    keyword: "르완다 제노사이드",
    tags: ["11주차", "르완다", "부정형"],
    isActive: true
  },
  {
    id: "V3-W11-013",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“이것은 19세기 유럽에서 혈연이나 언어만의 문제가 아니라, 정치적 공동체와 국가 형성의 상상력을 조직하는 강력한 신념체계로 나타났다.”",
    options: ["민족주의", "신자유주의", "수정자본주의", "스파이 활동"],
    answer: 1,
    explanation: "설명은 11주차 1차시의 민족주의 설명과 대응한다. 강의노트는 민족주의를 19세기 유럽에서 강력한 사회적 신념체계로 다룬다.",
    wrongExplanation: "2번은 15주차 세계화·신자유주의 주제이다. 3번은 대공황 이후 국가 개입 경제와 관련된다. 4번은 14주차 냉전 정보전 주제이다.",
    keyword: "민족주의",
    tags: ["11주차", "민족주의", "사료형"],
    isActive: true
  },
  {
    id: "V3-W11-014",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“식민통치 이후 발생한 대규모 폭력의 기억을 보존하고, 죽은 자에 대한 추모와 살아남은 자들의 치유를 동시에 수행하는 장소로 제시된다.”",
    options: ["베벨 광장의 비어있는 도서관", "르완다 키갈리 제노사이드 추모관", "브란덴부르크 문", "월 스트리트"],
    answer: 2,
    explanation: "설명은 키갈리 강의노트의 제노사이드 추모관과 맞다. 이 장소는 르완다 제노사이드의 기억과 치유를 상징하는 공간으로 다루어진다.",
    wrongExplanation: "1번은 베를린의 분서 사건 기억 공간이다. 3번은 베를린의 정치·역사 상징이다. 4번은 뉴욕의 경제 중심지이다.",
    keyword: "키갈리 제노사이드 추모관",
    tags: ["11주차", "키갈리", "사료형"],
    isActive: true
  },
  {
    id: "V3-W11-015",
    version: "V3",
    week: 11,
    source: "[강의노트] 세계사_11주차(02차시)_테마탐구_신사와뱀파이어.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "영국의 3C 정책과 관련된 설명으로 가장 적절한 것은?",
    options: ["카이로, 캔버라, 캘커타를 연결하는 태평양 중심의 연방 구상이었다.", "케이프타운, 카이로, 콩고를 잇는 독일의 아프리카 횡단 정책이었다.", "케이프타운, 카이로, 캘커타를 연결하는 영국 제국주의적 공간 구상이었다.", "코르시카, 칸, 칼레를 연결하여 프랑스 본토 통합을 꾀한 민족주의 정책이었다."],
    answer: 3,
    explanation: "강의노트의 3C 정책은 케이프타운, 카이로, 캘커타를 연결하는 영국 제국주의 구상으로 제시된다. 이는 대영제국의 공간적 확장과 식민지 네트워크를 상징한다.",
    wrongExplanation: "1번은 캔버라가 들어가 틀렸다. 2번은 콩고와 독일을 끼워 넣은 오답이다. 4번은 프랑스 본토 통합과 연결한 잘못된 설명이다.",
    keyword: "3C 정책",
    tags: ["11주차", "영국 제국주의", "장소·상징형"],
    isActive: true
  },
];

const WEEK_12_V3: Question[] = [
  {
    id: "V3-W12-001",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베르사유 체제에 대한 설명으로 가장 적절한 것은?",
    options: ["독일에 대한 전쟁책임과 배상, 영토 상실을 포함한 전후 질서였다.", "유럽 모든 국가가 동등하게 전쟁 책임을 나누는 평등 조약이었다.", "독일의 군비 확장과 해외 식민지 보유를 보장한 강화 체제였다.", "제2차 세계대전 이후 독일 분단을 공식화한 냉전기 조약이었다."],
    answer: 1,
    explanation: "강의노트는 베르사유 조약을 독일에 대한 전쟁책임, 영토와 식민지 상실, 배상금 지급과 연결한다. 이 조약은 평화보다 장기적 긴장을 남긴 전후 질서로 제시된다.",
    wrongExplanation: "2번은 독일 책임 부과를 지운 설명이다. 3번은 베르사유 체제의 실제 방향과 반대이다. 4번은 제2차 세계대전 이후 냉전 질서와 혼동했다.",
    keyword: "베르사유 체제",
    tags: ["12주차", "베르사유 체제", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W12-002",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "대공황의 결과로 적절한 것은?",
    options: ["국가의 경제 개입이 약화되고 자유방임이 절대 원칙으로 확립되었다.", "실업과 경제 불안이 확산되며 정치적 극단주의가 성장할 조건이 만들어졌다.", "독일의 배상금 부담이 사라지며 바이마르 공화국이 안정화되었다.", "식민지 체제가 해체되어 제국주의 경쟁이 즉시 종식되었다."],
    answer: 2,
    explanation: "강의노트는 대공황을 은행과 기업의 도산, 실업자의 폭증, 경제 붕괴와 연결한다. 이러한 경제위기는 독일 정치 불안과 파시즘·나치즘 성장의 배경이 되었다.",
    wrongExplanation: "1번은 대공황 이후 국가 개입이 강화된 흐름과 맞지 않는다. 3번은 독일 정치 불안의 심화를 설명하지 못한다. 4번은 식민지 경쟁의 즉각적 종식을 말해 부적절하다.",
    keyword: "대공황",
    tags: ["12주차", "대공황", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W12-003",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "파시즘과 나치즘의 성격에 대한 설명으로 적절하지 않은 것은?",
    options: ["자유민주주의와 공산주의에 대한 반감을 포함하였다.", "강한 민족주의와 지도자 중심의 정치 양식을 보였다.", "개인주의와 다원주의를 확대하는 민주주의적 운동으로 전개되었다.", "이탈리아와 독일에서 전후 불안과 사회적 위기를 배경으로 성장하였다."],
    answer: 3,
    explanation: "강의노트는 파시즘과 나치즘을 자유민주주의, 공산주의, 개인주의에 반대하는 정치운동으로 제시한다. 따라서 개인주의와 다원주의를 확대했다는 설명은 틀렸다.",
    wrongExplanation: "1번, 2번, 4번은 파시즘과 나치즘의 형성 배경 및 성격과 부합한다.",
    keyword: "파시즘과 나치즘",
    tags: ["12주차", "파시즘", "나치즘", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W12-004",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 히틀러와 나치즘의 성장 요인으로 옳은 것을 모두 고른 것은?\nㄱ. 바이마르 공화국에 대한 불만\nㄴ. 베르사유 조약에 대한 거부감\nㄷ. 대공황 이후 경제적 불안\nㄹ. 식민지 주민의 자치권 보장을 위한 반제국주의 노선",
    options: ["ㄱ, ㄹ", "ㄴ, ㄹ", "ㄷ, ㄹ", "ㄱ, ㄴ, ㄷ"],
    answer: 4,
    explanation: "강의노트는 히틀러와 나치즘의 성공 요인을 바이마르 공화국 불신, 베르사유 조약에 대한 반감, 경제위기와 연결한다. ㄹ은 나치즘의 성격과 맞지 않는다.",
    wrongExplanation: "ㄹ은 틀렸다. 나치즘은 반제국주의적 자치권 보장 운동이 아니라 독일 민족공동체, 외부 팽창, 내부 정화의 논리와 연결된다.",
    keyword: "나치즘 성장 요인",
    tags: ["12주차", "히틀러", "나치즘", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W12-005",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 홀로코스트의 전개에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 차별과 배제에서 추방, 강제이송, 절멸로 이어지는 단계가 제시된다.\nㄴ. 뉘른베르크법은 유대인 차별의 제도화와 관련된다.\nㄷ. 최종해결책은 유대인을 독일 시민으로 완전히 동화시키려는 정책이었다.\nㄹ. 바르샤바 게토와 수용소는 유대인 탄압 과정과 연결된다.",
    options: ["ㄱ, ㄴ, ㄹ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "강의노트는 홀로코스트를 차별에서 추방, 강제이송, 절멸로 이어지는 과정으로 제시한다. 뉘른베르크법, 게토, 수용소, 최종해결책은 유대인 탄압의 단계와 관련된다.",
    wrongExplanation: "ㄷ은 틀렸다. 최종해결책은 동화가 아니라 절멸 정책을 뜻한다.",
    keyword: "홀로코스트",
    tags: ["12주차", "홀로코스트", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W12-006",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 베를린의 역사적 의미에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 베를린은 프로이센, 독일제국, 나치 독일, 분단 독일의 역사와 연결된다.\nㄴ. 베를린 장벽은 전후 독일 분단과 냉전 질서를 상징한다.\nㄷ. 베를린은 기억 조형물을 통해 과거의 폭력과 책임을 현재화하는 공간으로 다루어진다.\nㄹ. 베를린의 기념조형물은 모두 군사적 승리만을 기념하기 위해 세워진다.",
    options: ["ㄱ, ㄹ", "ㄱ, ㄴ, ㄷ", "ㄴ, ㄹ", "ㄷ, ㄹ"],
    answer: 2,
    explanation: "강의노트는 베를린을 도시의 역사, 베를린 장벽, 기념조형물, 과거 기억의 방식과 함께 다룬다. 베를린은 독일 현대사의 폭력과 분단, 기억의 정치가 응축된 공간이다.",
    wrongExplanation: "ㄹ은 틀렸다. 베를린의 기억 조형물은 승리만이 아니라 추모, 경고, 반성의 성격을 갖는다.",
    keyword: "베를린",
    tags: ["12주차", "베를린", "기억", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W12-007",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 뉘른베르크법 제정\nㄴ. 수권법 제정\nㄷ. 제2차 세계대전 발발\nㄹ. 하이퍼 인플레이션",
    options: ["ㄱ-ㄴ-ㄷ-ㄹ", "ㄴ-ㄱ-ㄹ-ㄷ", "ㄹ-ㄴ-ㄱ-ㄷ", "ㄷ-ㄹ-ㄴ-ㄱ"],
    answer: 3,
    explanation: "하이퍼 인플레이션은 1920년대 초, 수권법은 1933년, 뉘른베르크법은 1935년, 제2차 세계대전 발발은 1939년이다.",
    wrongExplanation: "다른 배열은 바이마르 위기, 나치 권력 장악, 유대인 차별 제도화, 전쟁 발발의 순서를 뒤섞었다.",
    keyword: "나치 독일 사건 순서",
    tags: ["12주차", "히틀러", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W12-008",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 만주 침공\nㄴ. 진주만 공격\nㄷ. 연합군 원자폭탄 투하\nㄹ. 일본의 중국 침략 확대",
    options: ["ㄴ-ㄱ-ㄹ-ㄷ", "ㄹ-ㄷ-ㄱ-ㄴ", "ㄷ-ㄱ-ㄴ-ㄹ", "ㄱ-ㄹ-ㄴ-ㄷ"],
    answer: 4,
    explanation: "일본 제국주의의 확장은 만주 침공, 중국 침략 확대, 진주만 공격, 원폭 투하의 흐름으로 제시된다.",
    wrongExplanation: "1번은 진주만 공격을 너무 앞에 두었다. 2번은 원폭 투하를 중간에 배치했다. 3번은 원폭 투하를 가장 먼저 두어 틀렸다.",
    keyword: "일본 제국주의 순서",
    tags: ["12주차", "일본 제국주의", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W12-009",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전 (1).pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 인물·개념과 설명의 연결로 옳은 것은?",
    options: ["무솔리니 — 이탈리아 파시즘과 검은 셔츠단의 정치적 부상", "케인스 — 독일 제3제국의 인종법 제정을 주도한 나치 당수", "히틀러 — 영국의 전시 지도자로 나치즘 격퇴를 상징", "수권법 — 미국 뉴딜 정책의 실업구제 법안"],
    answer: 1,
    explanation: "강의노트는 파시즘의 대두를 이탈리아 무솔리니와 연결한다. 검은 셔츠단, 로마 진군, 독재화 과정은 이탈리아 파시즘의 핵심 전개이다.",
    wrongExplanation: "2번은 케인스와 나치 인종법을 잘못 연결했다. 3번은 히틀러와 영국 지도자를 혼동했다. 4번 수권법은 독일 나치 독재체제 확립과 관련된다.",
    keyword: "무솔리니",
    tags: ["12주차", "파시즘", "연결형"],
    isActive: true
  },
  {
    id: "V3-W12-010",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 장소·조형물과 그것이 환기하는 기억의 연결로 옳은 것은?",
    options: ["브란덴부르크 문 — 1933년 나치 분서 사건만을 기념하는 지하 도서관", "베벨 광장의 비어있는 도서관 — 나치의 분서 사건을 상기시키는 기억 공간", "월 스트리트 — 베를린 장벽 붕괴를 직접 기념하는 독일 통일 조형물", "타임스퀘어 — 홀로코스트 희생자를 위한 콘크리트 추모비군"],
    answer: 2,
    explanation: "베벨 광장의 비어있는 도서관은 1933년 나치 분서 사건을 기억하게 하는 공간으로 제시된다.",
    wrongExplanation: "1번은 브란덴부르크 문과 비어있는 도서관을 혼동했다. 3번과 4번은 15주차 뉴욕 장소와 12주차 베를린 기억 공간을 뒤섞은 오답이다.",
    keyword: "베벨 광장",
    tags: ["12주차", "베를린", "연결형"],
    isActive: true
  },
  {
    id: "V3-W12-011",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나치즘의 성공 요인에 대한 설명으로 보기 어려운 것은?",
    options: ["베르사유 체제에 대한 독일 사회의 반감", "대공황 이후 경제적 불안과 실업의 확대", "자본주의와 공산주의의 완전한 조화를 목표로 한 중도 통합 노선", "바이마르 공화국에 대한 불신과 정치적 위기의 심화"],
    answer: 3,
    explanation: "나치즘은 자유민주주의와 공산주의를 모두 거부하는 극단적 정치운동으로 설명된다. 자본주의와 공산주의의 조화를 목표로 한 중도 통합 노선이라는 설명은 부적절하다.",
    wrongExplanation: "1번, 2번, 4번은 나치즘 성장의 배경으로 강의노트에서 제시되는 요소와 연결된다.",
    keyword: "나치즘 성공 요인",
    tags: ["12주차", "나치즘", "부정형"],
    isActive: true
  },
  {
    id: "V3-W12-012",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린 유대인 추모공간에 대한 설명으로 적절하지 않은 것은?",
    options: ["콘크리트 조형물이 반복적으로 배치되어 있다.", "방문자가 공간을 통과하며 불안과 기억을 체험하도록 구성된다.", "베를린의 과거 기억을 현재 도시 공간 속에 배치한다.", "조성 과정에서 어떤 논쟁도 없이 일방적 찬성 속에 설치되었다."],
    answer: 4,
    explanation: "강의노트는 베를린의 기념조형물을 기억의 방식과 논쟁의 대상으로 다룬다. 베를린 유대인 추모공간이 논쟁 없이 설치되었다는 설명은 적절하지 않다.",
    wrongExplanation: "1번, 2번, 3번은 해당 추모공간의 성격과 부합한다.",
    keyword: "베를린 유대인 추모공간",
    tags: ["12주차", "베를린", "부정형"],
    isActive: true
  },
  {
    id: "V3-W12-013",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“이 법은 독일의 의회 민주주의를 형식적으로 남겨 둔 채, 히틀러 정권이 입법권을 장악하고 독재체제를 제도화하는 데 중요한 역할을 하였다.”",
    options: ["수권법", "대서양 헌장", "뉘른베르크법", "베르사유 조약"],
    answer: 1,
    explanation: "수권법은 히틀러가 의회를 우회하여 독재권력을 확립하는 핵심 장치로 제시된다.",
    wrongExplanation: "2번은 제2차 세계대전 중 연합국 원칙과 관련된다. 3번은 유대인 차별 제도화와 관련된다. 4번은 제1차 세계대전 이후 독일에 부과된 전후 질서이다.",
    keyword: "수권법",
    tags: ["12주차", "히틀러", "사료형"],
    isActive: true
  },
  {
    id: "V3-W12-014",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“희생자가 살던 장소 앞에 작은 명패를 설치해, 일상적 보행 속에서 학살의 기억과 마주하게 만드는 기억 실천이다.”",
    options: ["노이에 바헤", "슈톨퍼슈타인 프로젝트", "브란덴부르크 문", "베를린 장벽"],
    answer: 2,
    explanation: "슈톨퍼슈타인 프로젝트는 나치 희생자의 거주지 앞에 작은 명패를 설치하는 방식의 기억 프로젝트이다.",
    wrongExplanation: "1번은 다른 성격의 국가적 추모공간이다. 3번은 베를린의 정치적 상징이다. 4번은 냉전과 분단의 상징이다.",
    keyword: "슈톨퍼슈타인 프로젝트",
    tags: ["12주차", "베를린", "사료형"],
    isActive: true
  },
  {
    id: "V3-W12-015",
    version: "V3",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린의 기념조형물에 대한 강의노트의 관점으로 가장 적절한 것은?",
    options: ["기념조형물은 군사 승리를 선전하는 전통적 국가 조형물만을 의미한다.", "기념조형물은 과거 사건의 기억을 현재 도시 공간에서 삭제하기 위한 장치이다.", "기념조형물은 추모, 경고, 기억의 정치가 도시 공간에 물질화된 형식으로 이해된다.", "기념조형물은 역사적 책임보다 관광 소비를 위해서만 존재한다."],
    answer: 3,
    explanation: "강의노트는 베를린의 기념조형물을 과거를 기억하는 방식과 연결한다. 나치즘, 전쟁, 분단의 기억을 도시 공간 속에서 환기하는 조형물들이 중요하게 다루어진다.",
    wrongExplanation: "1번은 조형물의 의미를 군사 승리로만 제한했다. 2번은 기억을 삭제한다고 하여 반대이다. 4번은 역사적 책임과 기억의 기능을 무시한다.",
    keyword: "기념조형물",
    tags: ["12주차", "베를린", "장소·상징형"],
    isActive: true
  },
];

const WEEK_13_V3: Question[] = [
  {
    id: "V3-W13-001",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "미국의 ‘명백한 운명’에 대한 설명으로 가장 적절한 것은?",
    options: ["대서양에서 태평양까지 미국의 영토 팽창을 정당화한 관념이다.", "노예해방을 통해 흑인과 백인의 완전한 평등을 즉시 실현한 원리이다.", "미국이 유럽 식민지 질서를 보존해야 한다는 보수적 외교 이념이다.", "남북전쟁 이후 남부의 분리를 헌법적으로 승인한 원칙이다."],
    answer: 1,
    explanation: "강의노트는 1840년대 미국의 영토 팽창을 ‘명백한 운명’과 연결한다. 이는 미국이 대륙을 가로질러 팽창하는 것을 운명처럼 정당화한 관념이다.",
    wrongExplanation: "2번은 노예해방과 혼동했다. 3번은 미국 팽창주의와 맞지 않는다. 4번은 남북전쟁의 연방 유지 목표와 반대이다.",
    keyword: "명백한 운명",
    tags: ["13주차", "미국", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W13-002",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "러시아혁명 이전 러시아 사회에 대한 설명으로 옳은 것은?",
    options: ["농민 다수가 자영농으로 안정된 정치적 권리를 누렸다.", "브나로드 운동은 지식인들이 농민을 새 시대의 주역으로 보며 민중 속으로 들어간 흐름과 관련된다.", "알렉산드르 3세는 급진적 자유주의 개혁을 지속적으로 추진하였다.", "볼셰비키는 의회주의적 개혁만을 목표로 한 온건 보수파였다."],
    answer: 2,
    explanation: "강의노트는 러시아혁명의 배경에서 농노해방, 지식인과 농민의 관계, 브나로드 운동을 제시한다. 브나로드 운동은 지식인들이 민중 속으로 들어가 사회 변화를 모색한 흐름이다.",
    wrongExplanation: "1번은 러시아 농민 현실을 지나치게 안정적으로 묘사했다. 3번은 알렉산드르 3세의 보수적 성격과 맞지 않는다. 4번은 볼셰비키의 혁명적 성격을 지웠다.",
    keyword: "브나로드 운동",
    tags: ["13주차", "러시아혁명", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W13-003",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린 시대의 경제정책에 대한 설명으로 적절하지 않은 것은?",
    options: ["5개년 계획을 통해 중공업 중심의 경제개발을 추진하였다.", "농업 집단화를 통해 농민과 농촌을 통제하려 하였다.", "시장 자율과 소농 중심의 자유경제를 확대하는 방향으로 일관되게 나아갔다.", "콜라크의 청산과 집단농장화는 농촌 통제와 연결된다."],
    answer: 3,
    explanation: "강의노트는 스탈린 시대를 중공업 국가화, 5개년 계획, 집단농장화와 연결한다. 시장 자율과 소농 중심의 자유경제 확대는 스탈린 체제의 핵심 방향과 반대이다.",
    wrongExplanation: "1번, 2번, 4번은 스탈린 경제정책의 주요 특징과 부합한다.",
    keyword: "스탈린 경제정책",
    tags: ["13주차", "스탈린", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W13-004",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 남북전쟁과 노예해방에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 링컨의 핵심 목표는 연방의 유지를 포함하였다.\nㄴ. 노예해방선언은 남북전쟁의 전개 속에서 등장하였다.\nㄷ. 남북전쟁 이후 곧바로 인종차별이 완전히 사라졌다.\nㄹ. 전쟁은 미국 국민국가의 성격과 노예제 문제를 함께 드러냈다.",
    options: ["ㄱ, ㄷ", "ㄴ, ㄷ", "ㄷ, ㄹ", "ㄱ, ㄴ, ㄹ"],
    answer: 4,
    explanation: "강의노트는 남북전쟁을 연방 유지와 노예해방 문제의 결합으로 다룬다. 다만 전쟁 이후 인종차별이 즉시 완전히 해소되었다고 볼 수는 없다.",
    wrongExplanation: "ㄷ은 틀렸다. 남북전쟁과 노예해방 이후에도 인종차별과 흑인 공동체의 역사적 고통은 지속적으로 문제화된다.",
    keyword: "남북전쟁",
    tags: ["13주차", "남북전쟁", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W13-005",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 『빌러비드』에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 토니 모리슨은 흑인 공동체의 역사적 기억에 관심을 가진 작가로 제시된다.\nㄴ. 『빌러비드』는 노예제의 집단 트라우마와 기억을 다룬다.\nㄷ. 작품은 르완다 제노사이드 이후 가차차 재판을 중심 사건으로 삼는다.\nㄹ. 마거릿 가너 사건은 작품의 배경과 관련된다.",
    options: ["ㄱ, ㄴ, ㄹ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "강의노트는 토니 모리슨을 흑인 공동체의 대표적 작가로 다루며, 『빌러비드』를 노예제의 기억과 트라우마를 다룬 작품으로 제시한다. 마거릿 가너 사건도 작품 배경과 관련된다.",
    wrongExplanation: "ㄷ은 틀렸다. 가차차 재판은 르완다 제노사이드 이후의 기억·치유 문제와 관련되며 『빌러비드』의 중심 사건이 아니다.",
    keyword: "빌러비드",
    tags: ["13주차", "토니 모리슨", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W13-006",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 스탈린 체제에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 스탈린은 소련을 중앙집권적 국가로 바꾸는 과정과 관련된다.\nㄴ. 대숙청은 당과 군, 사회 전반에 광범위한 공포를 남겼다.\nㄷ. 영구혁명론은 스탈린의 대표 노선으로 제시된다.\nㄹ. 홀로도모르는 우크라이나 대기근의 기억과 연결된다.",
    options: ["ㄱ, ㄷ", "ㄱ, ㄴ, ㄹ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
    answer: 2,
    explanation: "강의노트는 스탈린 체제를 중앙집권화, 대숙청, 5개년 계획, 홀로도모르와 연결한다. 영구혁명론은 스탈린보다 트로츠키와 관련되는 노선이다.",
    wrongExplanation: "ㄷ은 틀렸다. 스탈린은 일국사회주의 노선과 더 직접적으로 연결된다.",
    keyword: "스탈린 체제",
    tags: ["13주차", "스탈린", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W13-007",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 러시아 2월혁명\nㄴ. 피의 일요일\nㄷ. 러시아 내전의 본격화\nㄹ. 제1차 세계대전 발발",
    options: ["ㄱ-ㄴ-ㄹ-ㄷ", "ㄹ-ㄴ-ㄱ-ㄷ", "ㄴ-ㄹ-ㄱ-ㄷ", "ㄷ-ㄱ-ㄴ-ㄹ"],
    answer: 3,
    explanation: "피의 일요일은 1905년, 제1차 세계대전은 1914년, 러시아 2월혁명은 1917년, 내전은 혁명 이후 본격화된다.",
    wrongExplanation: "다른 배열은 1905년 혁명, 세계대전, 1917년 혁명, 내전의 선후관계를 뒤섞었다.",
    keyword: "러시아혁명 순서",
    tags: ["13주차", "러시아혁명", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W13-008",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 5개년 계획 시작\nㄴ. 스탈린 권력 장악\nㄷ. 대숙청의 정점\nㄹ. 독일의 소련 침공",
    options: ["ㄱ-ㄷ-ㄴ-ㄹ", "ㄷ-ㄹ-ㄱ-ㄴ", "ㄹ-ㄴ-ㄱ-ㄷ", "ㄴ-ㄱ-ㄷ-ㄹ"],
    answer: 4,
    explanation: "스탈린 권력 장악, 5개년 계획, 대숙청의 정점, 독일의 소련 침공 순서로 이해할 수 있다.",
    wrongExplanation: "1번은 대숙청을 권력 장악보다 앞뒤로 잘못 배치했다. 2번은 대숙청과 독일 침공을 과도하게 앞당겼다. 3번은 독일 침공을 가장 앞에 두어 틀렸다.",
    keyword: "스탈린 시대 순서",
    tags: ["13주차", "스탈린", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W13-009",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 인물·개념과 설명의 연결로 옳은 것은?",
    options: ["토니 모리슨 — 노예제의 기억과 흑인 공동체의 트라우마를 문학적으로 탐구한 작가", "스탈린 — 미국의 서부 팽창을 명백한 운명으로 정당화한 대통령", "링컨 — 5개년 계획과 집단농장화를 추진한 소련 지도자", "마거릿 가너 — 독일 제3제국의 수권법을 제정한 정치가"],
    answer: 1,
    explanation: "토니 모리슨은 『빌러비드』를 통해 노예제의 기억과 흑인 공동체의 역사적 트라우마를 다룬 작가로 제시된다.",
    wrongExplanation: "2번은 스탈린과 미국 팽창주의를 혼동했다. 3번은 링컨과 스탈린의 정책을 뒤섞었다. 4번은 마거릿 가너 사건과 나치 독일을 잘못 연결했다.",
    keyword: "토니 모리슨",
    tags: ["13주차", "빌러비드", "연결형"],
    isActive: true
  },
  {
    id: "V3-W13-010",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 개념과 설명의 연결로 옳은 것은?",
    options: ["중간항해 — 유럽의 민족주의 혁명가들이 빈 체제에 맞서 벌인 비밀 결사 운동", "중간항해 — 대서양 노예무역에서 아프리카 포로들이 아메리카로 강제로 이동한 항해", "브나로드 — 나치 독일이 유대인을 절멸시키기 위해 제시한 최종해결책", "홀로도모르 — 미국 남북전쟁에서 북부가 남부를 봉쇄한 해상 작전"],
    answer: 2,
    explanation: "중간항해는 대서양 노예무역에서 아프리카 포로들이 아메리카로 끌려가는 항해를 뜻한다. 『빌러비드』 강의노트는 노예제의 폭력과 기억을 설명하는 맥락에서 이를 다룬다.",
    wrongExplanation: "1번은 유럽 민족주의 운동과 혼동했다. 3번은 브나로드와 홀로코스트를 뒤섞었다. 4번은 홀로도모르와 남북전쟁을 잘못 연결했다.",
    keyword: "중간항해",
    tags: ["13주차", "노예제", "연결형"],
    isActive: true
  },
  {
    id: "V3-W13-011",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『빌러비드』의 주제로 보기 어려운 것은?",
    options: ["노예제가 남긴 집단 트라우마", "흑인 여성 노예의 삶과 모성의 문제", "신남부 시대 백인 지주층의 산업화 전략", "미국 흑인 공동체의 역사적 경험과 기억"],
    answer: 3,
    explanation: "『빌러비드』는 노예제의 기억, 흑인 공동체의 트라우마, 흑인 여성 노예의 삶을 중심으로 다룬다. 신남부 시대 백인 지주층의 산업화 전략은 핵심 주제와 거리가 있다.",
    wrongExplanation: "1번, 2번, 4번은 『빌러비드』의 주제와 직접 관련된다.",
    keyword: "빌러비드 주제",
    tags: ["13주차", "빌러비드", "부정형"],
    isActive: true
  },
  {
    id: "V3-W13-012",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린에 대한 설명으로 적절하지 않은 것은?",
    options: ["조지아 출신으로 러시아 제국의 변방성과 연결된다.", "젊은 시절 혁명사상과 조직 활동에 참여하였다.", "5개년 계획과 집단농장화, 대숙청의 시대를 대표한다.", "레닌은 사망 직전까지 스탈린을 아무런 우려 없이 후계자로 지지하였다."],
    answer: 4,
    explanation: "강의노트는 스탈린의 생애와 권력 장악 과정을 다루면서 레닌과의 관계를 단순한 총애 관계로만 설명하지 않는다. 스탈린은 레닌 사후 권력투쟁 속에서 권력을 장악하였다.",
    wrongExplanation: "1번, 2번, 3번은 스탈린의 출신, 혁명 활동, 정책적 특징과 부합한다.",
    keyword: "스탈린 생애",
    tags: ["13주차", "스탈린", "부정형"],
    isActive: true
  },
  {
    id: "V3-W13-013",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“미국의 서부 진출을 단순한 영토 확장이 아니라 역사적 사명처럼 정당화한 관념으로, 1840년대 대규모 영토 팽창과 함께 제시된다.”",
    options: ["명백한 운명", "프롤레타리아 독재", "일국사회주의", "브나로드 운동"],
    answer: 1,
    explanation: "설명은 미국의 서부 팽창과 연결된 ‘명백한 운명’을 가리킨다. 강의노트는 1840년대 미국의 대규모 영토 확장을 이 개념과 함께 제시한다.",
    wrongExplanation: "2번은 러시아혁명과 레닌주의 맥락이다. 3번은 스탈린 노선과 관련된다. 4번은 러시아 지식인의 민중 운동이다.",
    keyword: "명백한 운명",
    tags: ["13주차", "미국", "사료형"],
    isActive: true
  },
  {
    id: "V3-W13-014",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“강제적 곡물 수탈과 집단화의 맥락 속에서 우크라이나에서 발생한 대규모 기근으로, 스탈린 시대의 어두운 기억으로 다루어진다.”",
    options: ["대숙청", "홀로도모르", "코민테른", "중간항해"],
    answer: 2,
    explanation: "설명은 홀로도모르를 가리킨다. 강의노트는 홀로도모르를 스탈린 시대의 폭력과 억압, 우크라이나 기근의 기억으로 제시한다.",
    wrongExplanation: "1번은 정치적 숙청과 처형·수용소를 뜻한다. 3번은 국제 공산주의 조직과 관련된다. 4번은 대서양 노예무역의 항해를 뜻한다.",
    keyword: "홀로도모르",
    tags: ["13주차", "스탈린", "사료형"],
    isActive: true
  },
  {
    id: "V3-W13-015",
    version: "V3",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "레닌과 스탈린의 노선을 비교한 설명으로 가장 적절한 것은?",
    options: ["레닌은 영구혁명론을 제도화했고, 스탈린은 프랑스 혁명 계승을 주장하였다.", "레닌은 미국 남북전쟁을 지도했고, 스탈린은 노예해방선언을 발표하였다.", "레닌은 신경제정책과 볼셰비키 혁명 체제와 연결되고, 스탈린은 일국사회주의와 중앙집권적 소련 체제 강화와 연결된다.", "레닌과 스탈린은 모두 제국주의 영국의 3C 정책을 설계한 인물이었다."],
    answer: 3,
    explanation: "강의노트는 레닌을 러시아혁명, 신경제정책, 소련의 시작과 연결하고, 스탈린을 일국사회주의, 5개년 계획, 중앙집권 체제와 연결한다.",
    wrongExplanation: "1번은 레닌과 스탈린의 노선을 뒤섞었다. 2번은 미국사와 소련사를 혼동했다. 4번은 영국 제국주의 정책과 소련 지도자를 잘못 연결했다.",
    keyword: "레닌과 스탈린 비교",
    tags: ["13주차", "레닌", "스탈린", "비교형"],
    isActive: true
  },
];

const WEEK_14_V3: Question[] = [
  {
    id: "V3-W14-001",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "냉전에 대한 설명으로 가장 적절한 것은?",
    options: ["미국과 소련을 중심으로 군사·정치·이념적 대립이 장기화된 국제질서였다.", "19세기 민족주의 혁명이 유럽 군주제를 모두 복원한 체제였다.", "제1차 세계대전 직후 독일에만 적용된 전후 배상 체제였다.", "대서양 노예무역의 항로를 둘러싼 영국과 프랑스의 해상 경쟁이었다."],
    answer: 1,
    explanation: "강의노트는 냉전을 미국과 소련 중심의 대립 질서로 설명한다. 냉전은 직접적 전면전이 아니라 이념, 군사, 지역분쟁, 정보전이 결합된 장기적 세계질서였다.",
    wrongExplanation: "2번은 19세기 유럽 민족주의와 혼동했다. 3번은 베르사유 체제와 관련된다. 4번은 노예무역과 제국주의 경쟁을 잘못 연결했다.",
    keyword: "냉전",
    tags: ["14주차", "냉전", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W14-002",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "냉전기 탈식민화와 민족해방에 대한 설명으로 옳은 것은?",
    options: ["탈식민화는 유럽 제국주의 강화와 함께 식민지 독립을 전면 금지하였다.", "인도와 파키스탄의 독립은 아시아 지역의 탈식민화 흐름 속에서 제시된다.", "냉전기 탈식민화는 미국과 소련의 대립과 아무 관련 없이 유럽 내부 문제로만 전개되었다.", "제3세계의 형성은 베르사유 조약의 독일 배상금 문제만을 뜻한다."],
    answer: 2,
    explanation: "강의노트는 1947년 인도와 파키스탄의 독립을 탈식민화와 민족해방의 사례로 제시한다. 이 과정은 아시아와 아프리카에서 제3세계가 형성되는 흐름과 연결된다.",
    wrongExplanation: "1번은 독립 흐름과 반대이다. 3번은 냉전 질서와 탈식민화의 상호 관련을 지운다. 4번은 제3세계를 전후 독일 문제와 혼동했다.",
    keyword: "탈식민화",
    tags: ["14주차", "탈식민화", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W14-003",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "밀란 쿤데라의 『농담』에 대한 설명으로 적절하지 않은 것은?",
    options: ["냉전기 체코슬로바키아와 스탈린주의적 사회주의 체제를 배경으로 한다.", "개인의 사소한 농담이 정치적 억압과 삶의 파탄으로 이어지는 구조를 보여준다.", "미국 남북전쟁 직후 흑인 노예제의 집단 트라우마를 직접 재현한 작품이다.", "역사와 실존, 우연한 사건이 개인의 삶을 어떻게 뒤흔드는지 질문한다."],
    answer: 3,
    explanation: "『농담』은 밀란 쿤데라의 작품으로, 체코슬로바키아와 공산주의 체제의 억압, 개인의 삶과 역사 사이의 관계를 다룬다. 흑인 노예제의 트라우마를 다룬 작품은 『빌러비드』이다.",
    wrongExplanation: "1번, 2번, 4번은 『농담』 강의노트의 작품 해석과 부합한다.",
    keyword: "농담",
    tags: ["14주차", "밀란 쿤데라", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W14-004",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 냉전의 종식과 관련된 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 페레스트로이카와 글라스노스트는 소련 체제 변화와 연결된다.\nㄴ. 베를린 장벽 붕괴는 동유럽 사회주의권의 변화와 관련된다.\nㄷ. 소련 해체는 냉전 종식의 흐름 속에서 제시된다.\nㄹ. 문화대혁명은 냉전 종식 이후 2000년대 중국에서 시작되었다.",
    options: ["ㄱ, ㄹ", "ㄴ, ㄹ", "ㄷ, ㄹ", "ㄱ, ㄴ, ㄷ"],
    answer: 4,
    explanation: "강의노트는 페레스트로이카와 글라스노스트, 베를린 장벽 붕괴, 소련 해체를 냉전 종식의 흐름으로 제시한다.",
    wrongExplanation: "ㄹ은 틀렸다. 문화대혁명은 냉전 종식 이후 2000년대 사건이 아니다.",
    keyword: "냉전 종식",
    tags: ["14주차", "냉전", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W14-005",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 냉전기 정보기관에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. CIA는 미국의 중앙정보국으로 해외 정보수집과 비밀공작과 연결된다.\nㄴ. KGB는 소련의 국가보안위원회로 국내 보안과 해외 정보활동을 수행하였다.\nㄷ. MI6는 영국의 해외 정보기관으로 제시된다.\nㄹ. 슈타지는 르완다 제노사이드 이후 가차차 재판을 담당한 법원이다.",
    options: ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄹ", "ㄴ, ㄹ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "강의노트는 CIA, KGB, MI6, 슈타지를 냉전기 주요 정보기관으로 제시한다. CIA는 미국, KGB는 소련, MI6는 영국, 슈타지는 동독과 관련된다.",
    wrongExplanation: "ㄹ은 틀렸다. 슈타지는 동독의 국가안전부이며 르완다의 가차차 재판과 관련되지 않는다.",
    keyword: "정보기관",
    tags: ["14주차", "스파이", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W14-006",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 『농담』의 역사적 해석으로 옳은 것을 모두 고른 것은?\nㄱ. 루드비크의 사소한 농담은 정치적 의심과 처벌로 이어진다.\nㄴ. 작품은 장난과 권력, 개인의 실존 사이의 긴장을 보여준다.\nㄷ. 작품은 냉전기 공산주의 체제의 억압적 분위기와 연결된다.\nㄹ. 작품은 인터넷 혁명의 등장과 월드와이드웹의 확산을 중심 소재로 삼는다.",
    options: ["ㄱ, ㄹ", "ㄱ, ㄴ, ㄷ", "ㄴ, ㄹ", "ㄷ, ㄹ"],
    answer: 2,
    explanation: "『농담』은 사소한 농담이 체제 속에서 정치적 문제로 확대되며 개인의 삶을 파괴하는 과정을 다룬다. 강의노트는 이를 냉전기 공산주의 체제와 개인의 실존 문제로 해석한다.",
    wrongExplanation: "ㄹ은 틀렸다. 인터넷 혁명과 월드와이드웹은 15주차 오늘날의 세계 주제이다.",
    keyword: "농담의 역사적 해석",
    tags: ["14주차", "농담", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W14-007",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 베를린 장벽 붕괴\nㄴ. 인도와 파키스탄의 독립\nㄷ. 소련 해체\nㄹ. 소련의 아프가니스탄 침공",
    options: ["ㄱ-ㄴ-ㄷ-ㄹ", "ㄹ-ㄴ-ㄱ-ㄷ", "ㄴ-ㄹ-ㄱ-ㄷ", "ㄷ-ㄱ-ㄴ-ㄹ"],
    answer: 3,
    explanation: "인도와 파키스탄 독립은 1947년, 소련의 아프가니스탄 침공은 1979년, 베를린 장벽 붕괴는 1989년, 소련 해체는 1991년이다.",
    wrongExplanation: "다른 배열은 탈식민화, 냉전기 지역분쟁, 냉전 붕괴의 선후관계를 뒤섞었다.",
    keyword: "냉전 사건 순서",
    tags: ["14주차", "냉전", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W14-008",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 이스라엘 건국과 UN 승인\nㄴ. 팔레스타인 해방기구 출범\nㄷ. 1차 인티파다\nㄹ. 오슬로 협정",
    options: ["ㄴ-ㄱ-ㄷ-ㄹ", "ㄹ-ㄷ-ㄴ-ㄱ", "ㄷ-ㄱ-ㄴ-ㄹ", "ㄱ-ㄴ-ㄷ-ㄹ"],
    answer: 4,
    explanation: "강의노트는 이스라엘 건국을 1948년, 팔레스타인 해방기구 출범을 1964년, 1차 인티파다를 1987년, 오슬로 협정을 1993년으로 제시한다.",
    wrongExplanation: "1번은 PLO를 이스라엘 건국보다 앞에 두었다. 2번은 오슬로 협정을 가장 앞에 배치했다. 3번은 인티파다를 지나치게 앞당겼다.",
    keyword: "이스라엘 팔레스타인 순서",
    tags: ["14주차", "이스라엘", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W14-009",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 기관과 설명의 연결로 옳은 것은?",
    options: ["CIA — 1947년 창설된 미국 중앙정보국으로 해외 정보수집과 비밀공작을 수행", "KGB — 영국의 대외정보기관으로 제임스 본드의 소속 기관", "MI6 — 동독의 국가안전부로 광범위한 내부 감시를 담당", "슈타지 — 소련의 국가보안위원회로 굴라그 운영만을 전담"],
    answer: 1,
    explanation: "CIA는 미국의 중앙정보국으로, 냉전기 정보전과 비밀공작의 대표 기관으로 제시된다.",
    wrongExplanation: "2번은 KGB와 MI6를 혼동했다. 3번은 MI6와 슈타지를 바꾸었다. 4번은 슈타지를 소련 KGB와 혼동했다.",
    keyword: "CIA",
    tags: ["14주차", "스파이", "연결형"],
    isActive: true
  },
  {
    id: "V3-W14-010",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 작품·인물과 설명의 연결로 옳은 것은?",
    options: ["토니 모리슨 — 체코슬로바키아 공산주의 체제의 농담 사건을 다룬 작가", "밀란 쿤데라 — 『농담』을 통해 냉전기 인간 실존과 체제의 억압을 탐구한 작가", "브램 스토커 — 소련의 5개년 계획과 홀로도모르를 묘사한 작가", "찰스 디킨스 — CIA 이중간첩 색출 작전을 기록한 정보기관 책임자"],
    answer: 2,
    explanation: "밀란 쿤데라는 『농담』의 작가로, 강의노트는 이 작품을 냉전기 공산주의 체제와 개인의 삶, 우연과 역사성의 관계로 해석한다.",
    wrongExplanation: "1번은 토니 모리슨과 밀란 쿤데라를 혼동했다. 3번은 브램 스토커와 스탈린 시대를 잘못 연결했다. 4번은 찰스 디킨스와 냉전 정보전을 뒤섞었다.",
    keyword: "밀란 쿤데라",
    tags: ["14주차", "농담", "연결형"],
    isActive: true
  },
  {
    id: "V3-W14-011",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스파이와 냉전 정보전에 대한 설명으로 적절하지 않은 것은?",
    options: ["냉전기 스파이는 강대국 간 직접 전쟁을 대신하는 정보전의 한 양상을 보여준다.", "정보기관은 적대 진영의 정보를 수집하고 비밀공작을 수행할 수 있다.", "스파이 활동은 냉전과 무관한 중세 봉건제의 장원 관리 방식만을 뜻한다.", "케임브리지 5인조 사건은 이념과 정보활동의 결합을 보여주는 사례로 다루어진다."],
    answer: 3,
    explanation: "강의노트는 스파이를 냉전기 강대국 정보전과 연결해 설명한다. 장원 관리 방식만을 뜻한다는 설명은 주제와 무관하다.",
    wrongExplanation: "1번, 2번, 4번은 스파이의 세계와 냉전 정보전의 성격에 맞는 설명이다.",
    keyword: "냉전 정보전",
    tags: ["14주차", "스파이", "부정형"],
    isActive: true
  },
  {
    id: "V3-W14-012",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "냉전기 베트남전과 아프가니스탄전 설명으로 적절하지 않은 것은?",
    options: ["베트남전은 냉전기 이념 대립과 탈식민화의 문제가 결합된 전쟁으로 제시된다.", "아프가니스탄전은 소련의 개입과 장기적 지역분쟁의 맥락에서 다루어진다.", "두 전쟁은 냉전이 유럽 안에서만 진행되었음을 입증하는 사례이다.", "두 전쟁은 냉전의 대립이 제3세계 지역전쟁으로 확산되는 양상을 보여준다."],
    answer: 3,
    explanation: "강의노트는 베트남과 아프가니스탄을 냉전의 주요 지역전쟁 사례로 제시한다. 따라서 냉전이 유럽 내부에서만 진행되었다는 설명은 틀렸다.",
    wrongExplanation: "1번, 2번, 4번은 냉전의 세계적 확산과 지역분쟁의 성격을 설명하는 데 적절하다.",
    keyword: "냉전 지역분쟁",
    tags: ["14주차", "냉전", "부정형"],
    isActive: true
  },
  {
    id: "V3-W14-013",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“동독의 국가안전부로, 시민 감시와 내부 통제를 통해 냉전기 사회주의 국가의 감시체제를 상징하는 기관으로 제시된다.”",
    options: ["슈타지", "CIA", "MI6", "가차차"],
    answer: 1,
    explanation: "설명은 동독의 슈타지를 가리킨다. 강의노트는 슈타지를 세계 각국의 정보기관 중 하나로 제시하며, 동독의 내부 감시체제와 연결한다.",
    wrongExplanation: "2번은 미국 정보기관, 3번은 영국 정보기관, 4번은 르완다의 공동체 재판과 관련된다.",
    keyword: "슈타지",
    tags: ["14주차", "스파이", "사료형"],
    isActive: true
  },
  {
    id: "V3-W14-014",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 작품으로 가장 적절한 것은?\n“한 개인의 농담이 체제의 의심 속에서 정치적 죄로 변형되고, 삶의 경로 전체를 바꾸는 사건으로 확대된다.”",
    options: ["『빌러비드』", "『농담』", "『드라큘라』", "『위대한 유산』"],
    answer: 2,
    explanation: "설명은 밀란 쿤데라의 『농담』에 해당한다. 강의노트는 이 작품을 개인의 농담, 체제의 권력, 실존의 파괴라는 구조로 해석한다.",
    wrongExplanation: "1번은 미국 노예제의 기억과 트라우마를 다룬다. 3번은 역식민화의 공포와 관련된다. 4번은 신사 욕망과 계급 상승 문제와 관련된다.",
    keyword: "농담",
    tags: ["14주차", "밀란 쿤데라", "사료형"],
    isActive: true
  },
  {
    id: "V3-W14-015",
    version: "V3",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "냉전기 정보전과 『농담』이 공통적으로 보여주는 시대적 특징으로 가장 적절한 것은?",
    options: ["국가권력의 약화와 개인 사생활의 완전한 자율성 확대", "식민지 해방 이후 모든 정치적 폭력이 즉각 사라진 세계", "이념 대립과 국가권력이 개인의 삶과 일상에 깊숙이 개입한 시대", "인터넷과 소셜미디어가 국제정치를 지배한 21세기 정보사회"],
    answer: 3,
    explanation: "냉전기 정보전은 국가 간 이념 대립 속에서 감시와 비밀공작이 강화된 양상을 보여준다. 『농담』 역시 정치권력과 이념이 개인의 사적 말과 삶을 통제하는 상황을 보여준다.",
    wrongExplanation: "1번은 냉전기의 감시와 통제를 설명하지 못한다. 2번은 탈식민 이후 지역분쟁을 지운다. 4번은 15주차 인터넷 혁명과 21세기 세계의 주제이다.",
    keyword: "냉전과 개인",
    tags: ["14주차", "냉전", "농담", "비교형"],
    isActive: true
  },
];

const WEEK_15_V3: Question[] = [
  {
    id: "V3-W15-001",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "68혁명에 대한 설명으로 가장 적절한 것은?",
    options: ["대학생과 청년문화를 중심으로 권위주의적 질서와 기존 사회규범에 문제를 제기한 운동이었다.", "베르사유 조약의 독일 배상금을 확정하기 위한 전후 국제회의였다.", "미국 남북전쟁 이후 노예해방선언을 법제화한 수정헌법이었다.", "제1차 세계대전 중 참호전을 종결하기 위한 군사작전이었다."],
    answer: 1,
    explanation: "강의노트는 1968년 프랑스에서 학생운동과 노동운동이 결합한 흐름을 68혁명으로 다룬다. 이는 권위주의적 질서와 기존 사회의 억압을 비판하는 시대적 운동으로 제시된다.",
    wrongExplanation: "2번은 제1차 세계대전 이후 전후처리 문제이다. 3번은 미국 남북전쟁 이후 문제이다. 4번은 제1차 세계대전 전개와 관련된다.",
    keyword: "68혁명",
    tags: ["15주차", "68혁명", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W15-002",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "신자유주의에 대한 설명으로 옳은 것은?",
    options: ["시장의 역할을 축소하고 국가가 모든 생산과 분배를 직접 통제하는 체제이다.", "1970년대 이후 위기 속에서 국가 개입 축소, 금융세계화, 시장 경쟁 확대와 연결된다.", "19세기 민족주의 혁명에서 국민국가 형성을 거부한 반국가주의 운동이다.", "홀로코스트 기억을 보존하기 위해 베를린에 조성된 기념조형물이다."],
    answer: 2,
    explanation: "강의노트는 1973년 오일쇼크 이후 케인스주의의 한계와 신자유주의의 등장을 연결한다. 신자유주의는 국가 역할 축소, 시장 기능 강화, 금융세계화와 관련된다.",
    wrongExplanation: "1번은 계획경제적 설명이다. 3번은 19세기 민족주의와 혼동했다. 4번은 베를린 기억 조형물과 연결한 오답이다.",
    keyword: "신자유주의",
    tags: ["15주차", "신자유주의", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W15-003",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "팬데믹과 사회변동에 대한 설명으로 적절하지 않은 것은?",
    options: ["코로나19는 2019년 말 등장 이후 세계적 확산을 보였다.", "팬데믹은 사회적 거리두기, 비대면 수업, 재택근무 확산과 연결된다.", "팬데믹은 사회와 경제의 디지털 전환과 아무 관련 없이 순수한 군사 사건으로만 다루어진다.", "인포데믹과 코로나 블루는 팬데믹 이후 사회적 변화의 사례로 제시된다."],
    answer: 3,
    explanation: "강의노트는 팬데믹을 감염병 확산뿐 아니라 사회변동과 연결한다. 비대면 수업, 재택근무, 코로나 블루, 인포데믹 등이 핵심 사례이다.",
    wrongExplanation: "1번, 2번, 4번은 강의노트의 팬데믹 설명과 부합한다.",
    keyword: "팬데믹과 사회변동",
    tags: ["15주차", "팬데믹", "단일 정답형"],
    isActive: true
  },
  {
    id: "V3-W15-004",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 15주차 1차시의 ‘오늘날의 세계’ 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 대중문화의 성장과 68혁명이 함께 다루어진다.\nㄴ. 세계화와 신자유주의는 1970년대 이후 경제질서 변화와 연결된다.\nㄷ. 인터넷 혁명은 1991년 월드와이드웹의 등장과 관련된다.\nㄹ. EU의 성립은 19세기 이탈리아 통일 과정의 직접 결과로만 설명된다.",
    options: ["ㄱ, ㄹ", "ㄴ, ㄹ", "ㄷ, ㄹ", "ㄱ, ㄴ, ㄷ"],
    answer: 4,
    explanation: "15주차 1차시는 대중문화, 68혁명, 세계화와 신자유주의, 인터넷 혁명, EU의 성립 등을 20세기 말~21세기 세계의 변화로 제시한다.",
    wrongExplanation: "ㄹ은 틀렸다. EU는 전후 유럽 통합과 마스트리히트 조약 등 현대 유럽 질서와 관련된다.",
    keyword: "오늘날의 세계",
    tags: ["15주차", "세계화", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W15-005",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 뉴욕과 9.11에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 뉴욕은 UN 본부, 월 스트리트, 타임스퀘어 등 정치·경제·문화의 중심지로 제시된다.\nㄴ. 자유의 여신상은 자유와 세계무역센터의 상징으로 다루어진다.\nㄷ. 9.11은 테러의 역사와 미국의 대응을 설명하는 핵심 사건이다.\nㄹ. 월 스트리트는 르완다 제노사이드 추모관의 다른 이름이다.",
    options: ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄹ", "ㄴ, ㄹ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "15주차 2차시는 뉴욕을 정치·경제·문화 중심지로 설명하고, 자유의 여신상과 9.11을 함께 다룬다. 9.11은 테러의 역사와 미국의 대응, 자유의 회복 문제와 연결된다.",
    wrongExplanation: "ㄹ은 틀렸다. 월 스트리트는 뉴욕의 경제 중심지이며 르완다 제노사이드 추모관과 무관하다.",
    keyword: "뉴욕과 9.11",
    tags: ["15주차", "뉴욕", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W15-006",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 팬데믹의 역사와 사회변동에 대한 설명으로 옳은 것을 모두 고른 것은?\nㄱ. 유스티니아누스 역병, 흑사병, 천연두는 팬데믹의 역사적 사례로 제시된다.\nㄴ. 에드워드 제너는 백신의 등장과 관련된다.\nㄷ. 팬데믹은 인간과 질병의 관계뿐 아니라 사회적 거리두기와 디지털 전환을 촉진한다.\nㄹ. 코로나19는 14세기 유럽에서만 발생한 흑사병의 다른 이름이다.",
    options: ["ㄱ, ㄹ", "ㄱ, ㄴ, ㄷ", "ㄴ, ㄹ", "ㄷ, ㄹ"],
    answer: 2,
    explanation: "강의노트는 팬데믹의 역사로 유스티니아누스 역병, 흑사병, 천연두를 제시하고, 에드워드 제너를 백신의 등장과 연결한다. 코로나19는 현대의 세계적 감염병 확산과 사회변동의 사례이다.",
    wrongExplanation: "ㄹ은 틀렸다. 코로나19는 2019년 이후 세계적으로 확산된 감염병이지 흑사병의 다른 이름이 아니다.",
    keyword: "팬데믹의 역사",
    tags: ["15주차", "팬데믹", "ㄱㄴㄷㄹ 조합형"],
    isActive: true
  },
  {
    id: "V3-W15-007",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 월드와이드웹 등장\nㄴ. 마스트리히트 조약\nㄷ. 9.11 테러\nㄹ. 코로나19 유행",
    options: ["ㄴ-ㄱ-ㄷ-ㄹ", "ㄹ-ㄷ-ㄴ-ㄱ", "ㄱ-ㄴ-ㄷ-ㄹ", "ㄷ-ㄱ-ㄴ-ㄹ"],
    answer: 3,
    explanation: "강의노트는 월드와이드웹 등장을 1991년, 마스트리히트 조약을 1992년, 9.11을 2001년, 코로나19 유행을 2019년 이후로 제시한다.",
    wrongExplanation: "다른 배열은 인터넷 혁명, 유럽 통합, 테러, 팬데믹의 순서를 뒤섞었다.",
    keyword: "현대 세계 사건 순서",
    tags: ["15주차", "오늘날의 세계", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W15-008",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 발생한 순서대로 올바르게 배열한 것은?\nㄱ. 68혁명\nㄴ. 오일쇼크 이후 신자유주의의 부상\nㄷ. EU 성립\nㄹ. 인터넷 혁명의 시작",
    options: ["ㄴ-ㄱ-ㄷ-ㄹ", "ㄹ-ㄷ-ㄱ-ㄴ", "ㄷ-ㄱ-ㄴ-ㄹ", "ㄱ-ㄴ-ㄹ-ㄷ"],
    answer: 4,
    explanation: "68혁명은 1968년, 신자유주의의 부상은 1970년대 이후, 인터넷 혁명의 시작은 1991년 월드와이드웹 등장, EU 성립은 1992년 마스트리히트 조약과 연결된다.",
    wrongExplanation: "1번은 신자유주의를 68혁명보다 앞에 두었다. 2번은 인터넷과 EU를 지나치게 앞당겼다. 3번은 EU 성립을 68혁명보다 앞에 두어 틀렸다.",
    keyword: "68혁명 신자유주의 인터넷 EU",
    tags: ["15주차", "오늘날의 세계", "순서 배열형"],
    isActive: true
  },
  {
    id: "V3-W15-009",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 장소와 설명의 연결로 옳은 것은?",
    options: ["월 스트리트 — 뉴욕의 경제 중심지로 금융과 자본주의의 상징", "타임스퀘어 — 냉전기 동독의 비밀경찰 본부", "UN 본부 — 1933년 나치 분서 사건을 기억하는 지하 도서관", "그라운드 제로 — 영국 제국주의의 3C 정책을 상징하는 항구"],
    answer: 1,
    explanation: "15주차 2차시 강의노트는 월 스트리트를 뉴욕의 경제 중심지로 제시한다. 뉴욕은 정치, 경제, 문화가 결합된 세계도시로 설명된다.",
    wrongExplanation: "2번은 슈타지와 동독을 뉴욕 장소와 혼동했다. 3번은 베벨 광장의 비어있는 도서관과 UN 본부를 뒤섞었다. 4번은 그라운드 제로와 영국 3C 정책을 잘못 연결했다.",
    keyword: "월 스트리트",
    tags: ["15주차", "뉴욕", "연결형"],
    isActive: true
  },
  {
    id: "V3-W15-010",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 인물·개념과 설명의 연결로 옳은 것은?",
    options: ["에드워드 제너 — 나치 독일의 수권법 제정을 주도한 정치가", "에드워드 제너 — 백신의 등장과 천연두 예방의 역사와 연결되는 인물", "아마농 루주 — 미국 9.11 테러 이후 알카에다 해체를 주도한 정보기관", "인포데믹 — 19세기 독일 통일을 이끈 철혈정책의 다른 이름"],
    answer: 2,
    explanation: "강의노트는 팬데믹의 역사에서 에드워드 제너를 백신의 등장과 연결한다. 이는 질병과 인간 사회의 대응을 설명하는 중요한 사례이다.",
    wrongExplanation: "1번은 에드워드 제너와 히틀러 시대를 혼동했다. 3번은 68혁명의 구호와 테러 대응을 뒤섞었다. 4번은 인포데믹과 독일 통일을 잘못 연결했다.",
    keyword: "에드워드 제너",
    tags: ["15주차", "팬데믹", "연결형"],
    isActive: true
  },
  {
    id: "V3-W15-011",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "9.11과 테러의 역사에 대한 설명으로 적절하지 않은 것은?",
    options: ["9.11은 미국 본토를 겨냥한 대규모 테러로 제시된다.", "테러의 역사는 개인 암살에서 조직적·국제적 폭력으로 확대되는 흐름 속에서 설명된다.", "9.11 이후 미국의 대응은 아프가니스탄과 이라크 전쟁 등과 연결된다.", "9.11은 18세기 유럽의 계몽사상가들이 일반적 이성을 주장한 철학 논쟁이다."],
    answer: 4,
    explanation: "9.11은 2001년 미국에서 발생한 테러 사건으로, 강의노트는 테러의 역사와 미국의 대응을 함께 다룬다. 18세기 계몽사상 논쟁이라는 설명은 전혀 다른 주제이다.",
    wrongExplanation: "1번, 2번, 3번은 15주차 뉴욕 강의노트의 9.11 설명과 부합한다.",
    keyword: "9.11 테러",
    tags: ["15주차", "뉴욕", "부정형"],
    isActive: true
  },
  {
    id: "V3-W15-012",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "EU의 성립에 대한 설명으로 적절하지 않은 것은?",
    options: ["유럽 통합의 흐름 속에서 마스트리히트 조약과 연결된다.", "경제적·정치적 통합의 확대를 통해 유럽 공동체의 성격을 강화하였다.", "냉전 이후 유럽 질서 재편의 한 축으로 이해될 수 있다.", "미국 남북전쟁 중 연방 유지를 위해 링컨이 발표한 군사 명령이었다."],
    answer: 4,
    explanation: "EU의 성립은 유럽 통합의 흐름과 관련되며, 마스트리히트 조약이 중요한 계기로 제시된다. 링컨의 남북전쟁 시기 군사 명령과는 관련이 없다.",
    wrongExplanation: "1번, 2번, 3번은 EU 성립과 현대 유럽 질서를 설명하는 데 적절하다.",
    keyword: "EU 성립",
    tags: ["15주차", "EU", "부정형"],
    isActive: true
  },
  {
    id: "V3-W15-013",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“1991년 등장한 월드와이드웹을 계기로 정보의 생산과 유통 방식이 크게 바뀌고, 세계가 새로운 방식으로 연결되는 변화를 뜻한다.”",
    options: ["인터넷 혁명", "브나로드 운동", "홀로도모르", "베르사유 체제"],
    answer: 1,
    explanation: "설명은 15주차 1차시의 인터넷 혁명을 가리킨다. 강의노트는 1991년 월드와이드웹의 등장을 인터넷 혁명의 시작과 연결한다.",
    wrongExplanation: "2번은 러시아 지식인의 민중운동이다. 3번은 우크라이나 대기근이다. 4번은 제1차 세계대전 이후 전후 질서이다.",
    keyword: "인터넷 혁명",
    tags: ["15주차", "인터넷 혁명", "사료형"],
    isActive: true
  },
  {
    id: "V3-W15-014",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 설명이 가리키는 것으로 가장 적절한 것은?\n“감염병 자체의 확산과 함께 잘못된 정보, 과잉 정보, 공포가 결합되어 사회적 불안을 증폭시키는 현상으로 제시된다.”",
    options: ["스탈린주의", "인포데믹", "민족주의", "명백한 운명"],
    answer: 2,
    explanation: "인포데믹은 팬데믹 시기 잘못된 정보와 과잉 정보가 확산되어 사회적 불안을 증폭시키는 현상이다. 강의노트는 팬데믹과 사회변동의 한 사례로 이를 제시한다.",
    wrongExplanation: "1번은 소련 스탈린 체제와 관련된다. 3번은 19세기 국민국가 형성의 이념이다. 4번은 미국의 서부 팽창 정당화 관념이다.",
    keyword: "인포데믹",
    tags: ["15주차", "팬데믹", "사료형"],
    isActive: true
  },
  {
    id: "V3-W15-015",
    version: "V3",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf / [강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "뉴욕과 팬데믹 강의노트가 공통적으로 보여주는 현대 세계의 특징으로 가장 적절한 것은?",
    options: ["국가 간 교류가 줄어들면서 지역사회가 외부와 완전히 단절된 세계", "19세기 국민국가 형성이 모든 현대 문제를 완전히 해결한 세계", "세계적 연결성이 테러, 감염병, 정보 확산, 도시 상징과 함께 작동하는 시대", "냉전기 정보기관의 활동이 사라져 감시와 정보 문제가 더 이상 존재하지 않는 시대"],
    answer: 3,
    explanation: "뉴욕 강의노트는 9.11과 세계도시의 상징성을, 팬데믹 강의노트는 감염병과 정보 확산, 비대면 사회를 다룬다. 두 강의는 모두 현대 세계의 높은 연결성과 그로 인한 위험·변화를 보여준다.",
    wrongExplanation: "1번은 세계화와 연결성을 설명하지 못한다. 2번은 현대 문제를 19세기 민족주의로 과도하게 환원했다. 4번은 현대 정보 문제와 팬데믹 시기 정보 확산을 무시한다.",
    keyword: "현대 세계의 연결성",
    tags: ["15주차", "뉴욕", "팬데믹", "비교형"],
    isActive: true
  },
];

const V3_QUESTION_BANK: Question[] = [
  ...WEEK_09_V3,
  ...WEEK_10_V3,
  ...WEEK_11_V3,
  ...WEEK_12_V3,
  ...WEEK_13_V3,
  ...WEEK_14_V3,
  ...WEEK_15_V3,
];

const V4_QUESTION_BANK: Question[] = [
  q({
    id: "V4-W09-001",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "프랑스 혁명 전개 과정에서 가장 먼저 일어난 사건은?",
    options: ["바스티유 감옥 함락", "인간과 시민의 권리 선언", "삼부회 소집", "공포정치의 전개"],
    answer: 3,
    explanation: "프랑스 혁명은 재정 위기 속에서 삼부회가 소집되며 정치적 위기가 표면화되었다. 바스티유 감옥 함락과 인권선언, 공포정치는 모두 그 이후의 사건이다.",
    wrongExplanation: "1은 삼부회 소집 이후 민중 봉기의 상징이고, 2는 혁명 초기의 선언이며, 4는 급진화된 혁명 국면이다.",
    keyword: "프랑스 혁명 전개 순서",
    tags: ["프랑스 혁명", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W09-002",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "공포정치 시기의 특징으로 보기 어려운 것은?",
    options: ["혁명재판소의 활용", "최고가격제의 실시", "인간과 시민의 권리 선언 반포", "반혁명 혐의자에 대한 탄압"],
    answer: 3,
    explanation: "인간과 시민의 권리 선언은 1789년 혁명 초기의 산물이다. 공포정치 시기에는 혁명재판소, 최고가격제, 반혁명 세력 탄압이 두드러졌다.",
    wrongExplanation: "1, 2, 4는 공포정치의 급진적 통치 방식과 관련된다.",
    keyword: "공포정치",
    tags: ["프랑스 혁명", "공포정치"],
    isActive: true
  }),
  q({
    id: "V4-W09-003",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "미국 독립혁명 관련 사건을 빠른 순서대로 배열한 것은?",
    options: ["7년전쟁-보스턴 차 사건-대륙회의-파리조약", "보스턴 차 사건-7년전쟁-파리조약-대륙회의", "대륙회의-7년전쟁-보스턴 차 사건-파리조약", "파리조약-대륙회의-보스턴 차 사건-7년전쟁"],
    answer: 1,
    explanation: "7년전쟁 이후 보스턴 차 사건과 대륙회의를 거쳐 파리조약으로 이어진다.",
    wrongExplanation: "다른 배열은 순서가 맞지 않는다.",
    keyword: "미국 독립혁명",
    tags: ["미국 독립혁명", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W09-004",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "프랑스 혁명의 보편주의가 실제로 제한되었음을 보여주는 기준으로 가장 적절하지 않은 것은?",
    options: ["성별", "인종", "재산", "언어적 취향"],
    answer: 4,
    explanation: "프랑스 혁명의 인권 담론은 보편성을 내세웠지만 실제로는 성별, 인종, 재산 조건에 의해 제한되었다. 언어적 취향은 강의노트의 핵심 제한 기준으로 제시되지 않는다.",
    wrongExplanation: "1, 2, 3은 혁명기 인권 보편성의 한계를 보여주는 기준이다.",
    keyword: "인권선언의 한계",
    tags: ["인권선언", "보편주의의 한계"],
    isActive: true
  }),
  q({
    id: "V4-W09-005",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹이 프랑스 혁명의 성과를 계승한 측면으로 가장 적절한 것은?",
    options: ["혁명 이전 신분질서를 전면 복구하였다", "법과 제도를 통해 혁명의 일부 성과를 제도화하였다", "공포정치를 그대로 부활시켰다", "왕정복고 세력과 결합하여 혁명 정신을 폐기하였다"],
    answer: 2,
    explanation: "나폴레옹은 혁명을 종식시킨 인물이면서도 혁명의 성과를 법과 제도 속에 일부 제도화한 인물로 평가된다. 특히 나폴레옹 법전은 혁명 이후 질서의 제도화를 상징한다.",
    wrongExplanation: "1과 4는 혁명 계승과 반대되는 설명이고, 3은 나폴레옹 체제를 공포정치와 동일시한 오류이다.",
    keyword: "나폴레옹과 혁명 계승",
    tags: ["나폴레옹", "혁명 계승"],
    isActive: true
  }),
  q({
    id: "V4-W09-006",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹의 이미지 변천에 대한 설명으로 적절하지 않은 것은?",
    options: ["초기에는 새로운 질서의 중심이라는 이미지가 유포되었다", "러시아 원정 이후 프랑스 안팎에서 부정적 이미지가 강화되었다", "왕정복고기에는 나폴레옹에 대한 향수가 커졌다", "세인트헬레나 유배 직후부터 일관된 국민영웅으로 숭배되었다고 보는 것은 이미지 변천의 복합성을 지운 설명이다"],
    answer: 4,
    explanation: "세인트헬레나 유배 직후부터 일관된 국민영웅으로 숭배되었다고 보는 것은 이미지 변천의 복합성을 지운 설명이다.",
    wrongExplanation: "1, 2, 3은 강의노트의 이미지 변천 흐름과 부합한다.",
    keyword: "나폴레옹 이미지",
    tags: ["나폴레옹", "이미지 변천"],
    isActive: true
  }),
  q({
    id: "V4-W09-007",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹 시대와 관련된 사건을 빠른 순서대로 배열한 것은?",
    options: ["툴롱 전투-브뤼메르 쿠데타-러시아 원정-세인트헬레나 유배", "브뤼메르 쿠데타-툴롱 전투-세인트헬레나 유배-러시아 원정", "러시아 원정-툴롱 전투-브뤼메르 쿠데타-세인트헬레나 유배", "세인트헬레나 유배-러시아 원정-브뤼메르 쿠데타-툴롱 전투"],
    answer: 1,
    explanation: "나폴레옹은 툴롱 전투를 통해 군사적 명성을 얻었고, 브뤼메르 쿠데타로 권력을 장악했다. 이후 러시아 원정 실패를 겪고 최종적으로 세인트헬레나에 유배되었다.",
    wrongExplanation: "2, 3, 4는 초기 군사적 부상과 최종 유배의 순서를 뒤섞은 것이다.",
    keyword: "나폴레옹 사건 순서",
    tags: ["나폴레옹", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W09-008",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 프랑스 혁명의 3대 정신에 해당하지 않는 것은?",
    options: ["자유", "평등", "박애", "공화"],
    answer: 4,
    explanation: "프랑스 혁명의 3대 정신은 자유, 평등, 박애이다.",
    wrongExplanation: "공화는 중요하지만 3대 정신 그 자체는 아니다.",
    keyword: "자유 평등 박애",
    tags: ["프랑스 혁명", "혁명 정신"],
    isActive: true
  }),
  q({
    id: "V4-W09-014",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(02차시)_인물_나폴레옹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나폴레옹이 건설을 명령한 기념물로, 제국의 군사적 영광과 로마적 상징성을 드러낸 것은?",
    options: ["콩코르드 광장의 오벨리스크", "개선문", "바스티유 감옥", "베르사유 궁전"],
    answer: 2,
    explanation: "개선문은 나폴레옹 제국의 군사적 영광을 기념하고 로마 제국적 상징성을 드러내기 위해 건설된 기념물이다.",
    wrongExplanation: "1은 이집트적 상징물이고, 3은 혁명 이전 억압의 상징이며, 4는 절대왕정의 상징에 가깝다.",
    keyword: "나폴레옹 개선문",
    tags: ["나폴레옹", "장소와 상징"],
    isActive: true
  }),
  q({
    id: "V4-W09-015",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "아이티 혁명에 대한 설명으로 적절하지 않은 것은?",
    options: ["식민지 노예들이 혁명의 주체로 등장하였다", "프랑스 혁명의 보편주의를 식민지 현실에서 시험하게 만들었다", "백인 대농장주의 이해관계를 온전히 보존하는 방향으로 전개되었다", "노예제와 인종 질서의 모순을 폭로하였다"],
    answer: 3,
    explanation: "아이티 혁명은 백인 대농장주의 이해관계를 보존한 사건이 아니다.",
    wrongExplanation: "나머지는 혁명의 역사적 의미와 부합한다.",
    keyword: "아이티 혁명 의미",
    tags: ["아이티 혁명", "부정형"],
    isActive: true
  }),
  q({
    id: "V4-W10-001",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1848년 독일 지역에서 자유주의적 통일 논의를 제도화하려 했던 기구는?",
    options: ["프랑크푸르트 의회", "빈 회의", "베를린 회의", "바이마르 국민의회"],
    answer: 1,
    explanation: "프랑크푸르트 의회는 1848년 혁명 속에서 독일 통일과 헌정 질서를 논의한 대표적 기구이다. 이는 자유주의와 민족주의의 결합을 보여준다.",
    wrongExplanation: "2는 나폴레옹 이후 국제질서 재편, 3은 제국주의 국제회의, 4는 20세기 독일 공화국과 관련된다.",
    keyword: "프랑크푸르트 의회",
    tags: ["1848년 혁명", "독일 통일"],
    isActive: true
  }),
  q({
    id: "V4-W10-002",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1848년 2월 혁명의 결과 프랑스에서 수립된 체제는?",
    options: ["제1제정", "제2공화정", "7월 왕정", "제3공화정"],
    answer: 2,
    explanation: "1848년 2월 혁명은 7월 왕정을 붕괴시키고 제2공화정을 수립하게 했다. 이는 19세기 자유주의 혁명의 대표적 전개이다.",
    wrongExplanation: "1은 나폴레옹 1세 시기이고, 3은 혁명으로 붕괴한 체제이며, 4는 보불전쟁 이후 등장한다.",
    keyword: "제2공화정",
    tags: ["1848년 혁명", "프랑스"],
    isActive: true
  }),
  q({
    id: "V4-W10-004",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 빠른 순서대로 배열한 것은?",
    options: ["빈 체제 성립-7월 혁명-2월 혁명-프랑크푸르트 의회", "2월 혁명-빈 체제 성립-7월 혁명-프랑크푸르트 의회", "7월 혁명-프랑크푸르트 의회-빈 체제 성립-2월 혁명", "프랑크푸르트 의회-2월 혁명-7월 혁명-빈 체제 성립"],
    answer: 1,
    explanation: "나폴레옹 전쟁 이후 빈 체제가 성립했고, 이후 1830년 7월 혁명과 1848년 2월 혁명이 전개되었다. 프랑크푸르트 의회는 1848년 혁명의 흐름 속에서 등장했다.",
    wrongExplanation: "2, 3, 4는 빈 체제의 시기와 1848년 혁명의 순서를 뒤섞고 있다.",
    keyword: "19세기 전반 혁명 순서",
    tags: ["19세기 유럽", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W11-006",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 독일 통일을 주도한 철혈재상은 누구인가?",
    options: ["마치니", "가리발디", "비스마르크", "카보우르"],
    answer: 3,
    explanation: "비스마르크는 프로이센 중심의 독일 통일을 주도한 정치가로 철혈재상이라 불린다. 그는 현실정치와 군사력을 활용해 통일을 추진했다.",
    wrongExplanation: "1, 2, 4는 이탈리아 통일과 관련된 인물이다.",
    keyword: "비스마르크",
    tags: ["독일 통일", "비스마르크"],
    isActive: true
  }),
  q({
    id: "V4-W11-007",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(02차시)_테마탐구_신사와뱀파이어.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "위대한 유산을 통해 신사가 되고자 하는 욕망과 그 모호함을 묘사한 작가는?",
    options: ["브램 스토커", "찰스 디킨스", "제임스 매튜 배리", "제인 오스틴"],
    answer: 2,
    explanation: "위대한 유산은 찰스 디킨스의 작품으로, 19세기 영국 사회의 계급 상승 욕망과 신사 개념의 모호함을 보여준다.",
    wrongExplanation: "1은 드라큘라, 3은 피터팬과 관련되며, 4는 19세기 초 영국 소설과 관련된다.",
    keyword: "찰스 디킨스",
    tags: ["신사 담론", "찰스 디킨스"],
    isActive: true
  }),
  q({
    id: "V4-W11-008",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(02차시)_테마탐구_신사와뱀파이어.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 영국의 신사 담론과 직접 연결되기 어려운 작품은?",
    options: ["드라큘라", "위대한 유산", "피터팬", "로빈슨 크루소"],
    answer: 4,
    explanation: "로빈슨 크루소는 18세기 작품으로, 강의노트의 19세기 영국 신사 담론과 직접 연결되는 작품으로 보기 어렵다.",
    wrongExplanation: "1, 2, 3은 신사, 제국, 남성성, 불안의 문제와 연결되어 다루어질 수 있다.",
    keyword: "영국 신사 담론",
    tags: ["신사 담론", "영국 문학"],
    isActive: true
  }),
  q({
    id: "V4-W12-001",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "파시즘이 일반적으로 반대한 사상으로 보기 어려운 것은?",
    options: ["자유민주주의", "공산주의", "개인주의", "인종주의"],
    answer: 4,
    explanation: "파시즘은 자유민주주의, 공산주의, 개인주의를 배격하는 성격이 강했다. 반면 인종주의는 파시즘, 특히 나치즘과 결합될 수 있었다.",
    wrongExplanation: "1, 2, 3은 파시즘이 반대한 대표적 사고방식이다.",
    keyword: "파시즘",
    tags: ["파시즘", "인종주의"],
    isActive: true
  }),
  q({
    id: "V4-W12-002",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "대공황 이후의 변화로 보기 어려운 것은?",
    options: ["국가의 경제 개입 확대", "수정자본주의적 대응", "작은 정부론의 일방적 강화", "파시즘 세력의 성장"],
    answer: 3,
    explanation: "대공황 이후에는 시장의 자동 조정에 대한 신뢰가 약화되고 국가 개입의 필요성이 부각되었다. 따라서 작은 정부론이 일방적으로 강화되었다고 보기 어렵다.",
    wrongExplanation: "1, 2, 4는 대공황 이후의 정치경제적 변화와 연결된다.",
    keyword: "대공황",
    tags: ["대공황", "수정자본주의"],
    isActive: true
  }),
  q({
    id: "V4-W12-003",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "히틀러의 나치당이 독일 대중의 본격적 주목을 받게 된 주요 계기는?",
    options: ["대공황", "빈 체제", "미국 독립혁명", "베를린 장벽 붕괴"],
    answer: 1,
    explanation: "대공황은 독일 사회의 경제적 불안과 정치적 혼란을 심화시켰고, 나치당이 대중적 지지를 확대하는 배경이 되었다.",
    wrongExplanation: "2는 19세기 초 유럽질서, 3은 18세기 미국사, 4는 냉전 종식 국면과 관련된다.",
    keyword: "대공황과 나치",
    tags: ["나치즘", "대공황"],
    isActive: true
  }),
  q({
    id: "V4-W12-004",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "제1차 세계대전 패전 이후 제3제국 성립 전까지 독일에 존재한 국가 체제는?",
    options: ["바이마르 공화국", "제2제정", "빈 체제", "프랑크푸르트 국민국가"],
    answer: 1,
    explanation: "제1차 세계대전 이후 독일에는 바이마르 공화국이 성립했고, 나치가 권력을 장악하기 전까지 독일의 공화정 체제로 존재했다.",
    wrongExplanation: "2는 독일 제국 시기와 관련되고, 3은 국제질서이며, 4는 1848년 독일 통일 논의와 관련된다.",
    keyword: "바이마르 공화국",
    tags: ["바이마르 공화국", "나치즘"],
    isActive: true
  }),
  q({
    id: "V4-W12-005",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나치즘 성공의 배경으로 보기 어려운 것은?",
    options: ["대공황의 사회적 혼란", "공산주의에 대한 반감", "민족주의적 동원", "자본주의 자체에 대한 일관된 혁명적 적대"],
    answer: 4,
    explanation: "나치즘은 공산주의에 대한 반감, 민족주의, 대공황의 혼란을 배경으로 성장했다. 자본주의 자체에 대한 일관된 혁명적 적대를 핵심 배경으로 보기는 어렵다.",
    wrongExplanation: "1, 2, 3은 나치즘의 대중적 부상과 관련된다.",
    keyword: "나치즘 배경",
    tags: ["나치즘", "히틀러"],
    isActive: true
  }),
  q({
    id: "V4-W12-006",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "나치 독일의 유대인 정책에서 최종해결책이 의미한 것은?",
    options: ["유대인의 완전한 멸절", "유대인의 자치권 승인", "바이마르 헌법 복원", "유대인의 독일 정치 참여 확대"],
    answer: 1,
    explanation: "나치의 최종해결책은 유대인을 조직적으로 절멸하려는 정책을 의미한다. 이는 홀로코스트의 핵심과 연결된다.",
    wrongExplanation: "2, 3, 4는 나치의 유대인 탄압 정책과 정반대이거나 무관한 설명이다.",
    keyword: "최종해결책",
    tags: ["홀로코스트", "나치즘"],
    isActive: true
  }),
  q({
    id: "V4-W12-007",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "일본 제국주의 확장 과정에서 비교적 늦은 국면에 해당하는 사건은?",
    options: ["진주만 공격", "메이지 유신", "프랑스 혁명", "빈 체제 성립"],
    answer: 1,
    explanation: "진주만 공격은 일본 제국주의가 태평양 전쟁으로 확대되는 국면과 관련된다. 이는 일본의 대외 팽창이 세계대전의 전면적 충돌로 이어지는 사건이다.",
    wrongExplanation: "2는 일본 근대화의 출발점이고, 3과 4는 유럽사의 다른 시기 사건이다.",
    keyword: "일본 제국주의",
    tags: ["일본 제국주의", "태평양 전쟁"],
    isActive: true
  }),
  q({
    id: "V4-W12-008",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "희생자가 살던 공간에 작은 명패를 설치해 일상 속 기억을 환기하는 프로젝트는?",
    options: ["슈톨퍼슈타인 프로젝트", "마셜 플랜", "코민포름", "마스트리흐트 조약"],
    answer: 1,
    explanation: "슈톨퍼슈타인 프로젝트는 나치 희생자의 거주지 앞에 작은 추모 명패를 설치해 일상 공간에서 기억을 환기하는 방식이다.",
    wrongExplanation: "2는 전후 유럽 부흥, 3은 냉전기 공산권 조직, 4는 유럽연합 형성과 관련된다.",
    keyword: "슈톨퍼슈타인",
    tags: ["베를린", "기억 문화"],
    isActive: true
  }),
  q({
    id: "V4-W12-009",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베벨 광장의 비어 있는 도서관이 상기시키는 사건은?",
    options: ["1933년 나치 지지 대학생들의 분서", "베를린 장벽 붕괴", "프랑크푸르트 의회 개최", "이스라엘 건국"],
    answer: 1,
    explanation: "베벨 광장의 비어 있는 도서관은 1933년 나치 지지 대학생들의 분서 사건을 기억하게 하는 추모 공간이다.",
    wrongExplanation: "2는 냉전 종식, 3은 1848년 혁명, 4는 중동 문제와 관련된다.",
    keyword: "베벨 광장",
    tags: ["베를린", "분서"],
    isActive: true
  }),
  q({
    id: "V4-W12-010",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린의 기억 문화에 대한 설명으로 적절하지 않은 것은?",
    options: ["홀로코스트의 기억을 도시 공간 속에서 환기한다", "기념물은 성찰과 반성을 요구하는 방식으로 설계될 수 있다", "모든 기념물은 웅장하고 권위적일수록 높은 평가를 받는다", "가해의 역사를 기억하는 방식이 중요한 문제로 제기된다"],
    answer: 3,
    explanation: "현대 베를린의 기억 문화는 반드시 웅장하고 권위적인 기념물만을 높이 평가하지 않는다. 성찰과 반성, 일상 속 기억의 방식이 중요하게 다루어진다.",
    wrongExplanation: "1, 2, 4는 베를린 기억 문화의 핵심 문제의식과 연결된다.",
    keyword: "베를린 기억 문화",
    tags: ["베를린", "기념물"],
    isActive: true
  }),
  q({
    id: "V4-W12-011",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 파시즘과 관련된 설명을 모두 고른 것은?\nㄱ. 자유민주주의에 대한 반감\nㄴ. 공산주의에 대한 반감\nㄷ. 폭력적 대중동원\nㄹ. 개인주의의 절대적 존중",
    options: ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄹ", "ㄴ, ㄷ, ㄹ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "파시즘은 자유민주주의와 공산주의를 반대하고 폭력적 대중동원과 권위주의적 질서를 강조한다. 개인주의의 절대적 존중은 파시즘의 성격과 맞지 않는다.",
    wrongExplanation: "2, 3, 4는 ㄹ을 포함하거나 핵심 요소를 누락한다.",
    keyword: "파시즘 특징",
    tags: ["파시즘", "조합형"],
    isActive: true
  }),
  q({
    id: "V4-W12-012",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(01차시)_100장면_2차세계대전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 사건을 빠른 순서대로 배열한 것은?",
    options: ["대공황-나치당 성장-제2차 세계대전 발발-홀로코스트의 본격화", "제2차 세계대전 발발-대공황-나치당 성장-홀로코스트의 본격화", "홀로코스트의 본격화-대공황-제2차 세계대전 발발-나치당 성장", "나치당 성장-홀로코스트의 본격화-대공황-제2차 세계대전 발발"],
    answer: 1,
    explanation: "대공황은 나치당 성장의 배경이 되었고, 이후 독일의 침략과 제2차 세계대전 발발로 이어졌다. 홀로코스트의 본격화는 전쟁 과정에서 심화되었다.",
    wrongExplanation: "2, 3, 4는 대공황과 전쟁 발발의 선후 관계를 뒤섞고 있다.",
    keyword: "제2차 세계대전 전개",
    tags: ["제2차 세계대전", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W12-013",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(02차시)_인물_히틀러.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "히틀러와 나치즘을 설명하는 문장으로 가장 적절한 것은?",
    options: ["히틀러는 자유주의적 다원주의를 확대하는 방식으로 집권했다", "히틀러는 대공황 이후 불안과 민족주의를 동원해 권력을 확대했다", "히틀러는 바이마르 공화국의 민주주의를 안정적으로 계승했다", "히틀러는 유대인을 독일 국민공동체의 핵심으로 포섭했다"],
    answer: 2,
    explanation: "히틀러와 나치당은 대공황 이후의 불안, 민족주의, 반공주의, 선전과 동원을 통해 성장했다. 이는 바이마르 공화국의 위기와 연결된다.",
    wrongExplanation: "1과 3은 나치즘의 반민주적 성격을 왜곡하고, 4는 나치의 반유대주의와 정반대이다.",
    keyword: "히틀러와 나치즘",
    tags: ["히틀러", "나치즘"],
    isActive: true
  }),
  q({
    id: "V4-W12-014",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린 유대인 추모공간에 대한 설명으로 적절하지 않은 것은?",
    options: ["홀로코스트의 기억을 현재 도시 공간 속에 배치한다", "독일 사회의 가해 책임과 기억 문제를 드러낸다", "조성 과정에서 논쟁과 비판이 존재했다", "설치 과정에서 비판이나 반대가 전혀 없었다"],
    answer: 4,
    explanation: "조성 과정에는 여러 논쟁과 비판이 있었다.",
    wrongExplanation: "다른 선택지는 추모공간의 의미와 부합한다.",
    keyword: "베를린 유대인 추모공간",
    tags: ["베를린", "홀로코스트 기억"],
    isActive: true
  }),
  q({
    id: "V4-W13-014",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린에 대한 설명으로 적절하지 않은 것은?",
    options: ["조지아 출신이다", "본명은 이오세브 주가슈빌리이다", "젊은 시절 혁명 사상에 영향을 받았다", "레닌은 죽을 때까지 스탈린을 전적으로 총애했다"],
    answer: 4,
    explanation: "레닌은 말년에 스탈린에 대해 비판적 견해를 보였다. 따라서 죽을 때까지 전적으로 총애했다는 설명은 적절하지 않다.",
    wrongExplanation: "1, 2, 3은 스탈린의 생애와 관련된 설명이다.",
    keyword: "스탈린 생애",
    tags: ["스탈린", "레닌"],
    isActive: true
  }),
  q({
    id: "V4-W13-015",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린 시대의 특징으로 보기 어려운 것은?",
    options: ["중앙집권국가로의 변신", "대숙청", "나치즘에 대한 저항", "영구혁명론의 채택"],
    answer: 4,
    explanation: "영구혁명론은 트로츠키와 관련된 노선이다. 스탈린은 일국사회주의 노선을 내세웠다.",
    wrongExplanation: "1, 2, 3은 스탈린 시대를 설명하는 요소로 다루어진다.",
    keyword: "스탈린 시대",
    tags: ["스탈린", "체제"],
    isActive: true
  }),
  q({
    id: "V4-W14-007",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "미국 CIA에 대한 설명으로 적절한 것은?",
    options: ["1947년에 창설된 미국의 중앙정보국이다", "1909년에 창설된 영국 대외정보기관이다", "동독 전 인민 감시 프로젝트를 수행한 조직이다", "1917년 체카에서 출발한 소련 정보기관이다"],
    answer: 1,
    explanation: "CIA는 1947년에 창설된 미국 중앙정보국이다. 냉전기에는 비밀작전과 체제 전복 시도와 관련되어 다루어진다.",
    wrongExplanation: "2는 MI6, 3은 슈타지, 4는 소련 정보기관 계열과 관련된다.",
    keyword: "CIA",
    tags: ["CIA", "정보기관"],
    isActive: true
  }),
  q({
    id: "V4-W14-008",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 정보기관과 국가의 연결로 적절하지 않은 것은?",
    options: ["CIA-미국", "KGB-소련", "MI6-영국", "슈타지-프랑스"],
    answer: 4,
    explanation: "슈타지는 동독의 국가보안부로, 프랑스 정보기관이 아니다. CIA는 미국, KGB는 소련, MI6는 영국의 정보기관이다.",
    wrongExplanation: "1, 2, 3은 정보기관과 국가의 연결이 적절하다.",
    keyword: "정보기관",
    tags: ["스파이", "정보기관"],
    isActive: true
  }),
  q({
    id: "V4-W14-009",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "케임브리지 5인조 사례가 보여주는 냉전기 스파이 활동의 특징으로 가장 적절한 것은?",
    options: ["이념과 정보기관 내부 침투가 결합될 수 있음을 보여준다", "스파이는 언제나 공개 의회 토론을 통해 활동했다", "냉전기에는 정보 유출이 국제정치에 영향을 미치지 않았다", "스파이 활동은 군사기술과 무관한 문화교류에 한정되었다"],
    answer: 1,
    explanation: "케임브리지 5인조는 영국 엘리트 내부에서 활동하며 소련에 정보를 제공한 사례로 다루어진다. 이는 냉전기 이념, 정보, 체제 경쟁의 결합을 보여준다.",
    wrongExplanation: "2는 비밀 첩보의 성격과 맞지 않고, 3과 4는 냉전기 정보 유출의 의미를 축소한다.",
    keyword: "케임브리지 5인조",
    tags: ["스파이", "케임브리지 5인조"],
    isActive: true
  }),
  q({
    id: "V4-W14-010",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "농담의 작가 밀란 쿤데라에 대한 설명으로 적절한 것은?",
    options: ["체코 출신 작가로, 공산주의 체제와 인간의 삶을 소설적으로 다루었다", "프랑스 혁명기의 자코뱅 지도자였다", "나치 독일의 선전 장관이었다", "미국 남북전쟁의 대통령이었다"],
    answer: 1,
    explanation: "밀란 쿤데라는 체코 출신 작가로, 농담을 통해 스탈린주의 시대와 개인의 삶, 기억과 망각의 문제를 다루었다.",
    wrongExplanation: "2는 로베스피에르 등과 관련되고, 3은 괴벨스, 4는 링컨과 관련된다.",
    keyword: "밀란 쿤데라",
    tags: ["농담", "밀란 쿤데라"],
    isActive: true
  }),
  q({
    id: "V4-W14-011",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "농담에서 루드비크가 몰락하게 되는 직접적 계기는?",
    options: ["여자친구에게 보낸 가벼운 농담이 트로츠키주의로 해석되었기 때문이다", "이스라엘 건국을 직접 주도했기 때문이다", "미국 CIA 요원으로 활동했기 때문이다", "영국 산업혁명을 방해했기 때문이다"],
    answer: 1,
    explanation: "루드비크는 여자친구 마르케타에게 보낸 가벼운 농담 때문에 트로츠키주의자로 몰리고 공개재판과 축출을 겪는다. 이 사건은 전체주의 체제 속 언어와 권력의 폭력을 보여준다.",
    wrongExplanation: "2, 3, 4는 작품의 줄거리와 무관하다.",
    keyword: "루드비크 농담",
    tags: ["농담", "루드비크"],
    isActive: true
  }),
  q({
    id: "V4-W14-012",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "농담의 시대적 배경으로 적절하지 않은 것은?",
    options: ["체코슬로바키아의 공산화", "스탈린주의적 통제", "프라하의 봄과 소련 개입의 맥락", "미국 독립혁명의 대륙회의"],
    answer: 4,
    explanation: "농담은 체코슬로바키아의 공산화와 스탈린주의적 시대 분위기, 프라하의 봄 전후의 맥락과 관련된다. 미국 독립혁명의 대륙회의는 작품의 시대적 배경이 아니다.",
    wrongExplanation: "1, 2, 3은 강의노트에서 작품 이해의 배경으로 다루어진다.",
    keyword: "농담 시대적 배경",
    tags: ["농담", "체코슬로바키아"],
    isActive: true
  }),
  q({
    id: "V4-W15-011",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "코로나19에 대한 설명으로 가장 적절한 것은?",
    options: ["SARS-CoV-2에 의해 발생하며 2019년 중국 우한에서 처음 발견되었다", "18세기 프랑스 혁명 중 처음 발견되었다", "나폴레옹 법전의 별칭이다", "산업혁명기의 증기기관 이름이다"],
    answer: 1,
    explanation: "코로나19는 SARS-CoV-2에 의해 발생하며, 강의노트는 2019년 12월 중국 후베이성 우한에서 처음 발견된 것으로 설명한다.",
    wrongExplanation: "2, 3, 4는 코로나19와 무관한 역사적 개념이다.",
    keyword: "코로나19 SARS-CoV-2",
    tags: ["코로나19", "팬데믹"],
    isActive: true
  }),
  q({
    id: "V4-W15-012",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "세계보건기구가 코로나19를 팬데믹으로 선언한 시기로 강의노트에서 제시된 것은?",
    options: ["2020년 3월", "1918년 11월", "1947년 3월", "1992년 12월"],
    answer: 1,
    explanation: "강의노트는 2020년 3월 WHO가 코로나19 팬데믹을 선언했다고 설명한다. 이는 코로나19가 전 세계적 감염병 위기로 확산되었음을 의미한다.",
    wrongExplanation: "2는 스페인 독감과 제1차 세계대전 시기, 3은 냉전 초기, 4는 유럽연합 성립 과정과 관련된다.",
    keyword: "WHO 팬데믹 선언",
    tags: ["코로나19", "WHO"],
    isActive: true
  }),
  q({
    id: "V4-W09-009",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "혁명 이전 생도맹그 사회에서 가장 큰 인구 비중을 차지한 집단은?",
    options: ["백인 대농장주", "유색인 자유민", "흑인 노예", "프랑스 파견 관료"],
    answer: 3,
    explanation: "생도맹그는 플랜테이션 경제를 기반으로 했고, 흑인 노예가 인구의 압도적 다수를 차지했다. 이 구조가 아이티 혁명의 사회적 배경이 되었다.",
    wrongExplanation: "1, 2, 4는 생도맹그 사회의 구성 요소였지만 가장 큰 인구 집단은 아니었다.",
    keyword: "생도맹그 인구 구성",
    tags: ["아이티 혁명", "생도맹그"],
    isActive: true
  }),
  q({
    id: "V4-W09-010",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "생도맹그의 노예반란을 독립혁명으로 성장시킨 인물로 가장 적절한 것은?",
    options: ["장자크 데살린", "투생 루베르튀르", "샤를 르클레르", "로베스피에르"],
    answer: 2,
    explanation: "투생 루베르튀르는 생도맹그의 노예반란을 정치적·군사적 혁명으로 발전시킨 핵심 인물이다. 그는 아이티 혁명의 선구자로 다루어진다.",
    wrongExplanation: "1은 아이티 독립의 후속 국면과 관련되고, 3은 프랑스 측 인물이며, 4는 프랑스 혁명 내부의 급진파 인물이다.",
    keyword: "투생 루베르튀르",
    tags: ["아이티 혁명", "인물"],
    isActive: true
  }),
  q({
    id: "V4-W09-011",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "아이티 혁명이 프랑스 혁명과 연결되면서도 그 한계를 드러내는 이유로 가장 적절한 것은?",
    options: ["프랑스 혁명이 유럽 군주정을 완전히 보존했기 때문이다", "인권의 보편성을 말하면서도 식민지 노예와 유색인을 배제했기 때문이다", "아이티 혁명이 종교개혁을 계승했기 때문이다", "생도맹그가 서인도제도와 무관한 내륙 식민지였기 때문이다"],
    answer: 2,
    explanation: "아이티 혁명은 프랑스 혁명의 자유와 평등 담론을 식민지 노예 문제로 확장시켰다. 동시에 프랑스 혁명의 보편주의가 실제로는 인종과 노예제 문제에서 제한되었음을 드러냈다.",
    wrongExplanation: "1은 혁명 성격을 왜곡한 설명이고, 3은 강의노트의 연결축이 아니며, 4는 지리적으로 틀린 설명이다.",
    keyword: "아이티 혁명과 인권",
    tags: ["아이티 혁명", "인권선언"],
    isActive: true
  }),
  q({
    id: "V4-W09-012",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(03차시)_테마탐구_아이티혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 서인도제도와 관련된 지역으로 보기 어려운 것은?",
    options: ["자메이카", "쿠바", "도미니카 공화국", "코스타리카"],
    answer: 4,
    explanation: "아이티, 자메이카, 쿠바, 도미니카 공화국은 서인도제도와 관련된다. 코스타리카는 중앙아메리카의 국가로 서인도제도 국가로 보기 어렵다.",
    wrongExplanation: "1, 2, 3은 카리브해·서인도제도 맥락에서 함께 언급될 수 있다.",
    keyword: "서인도제도",
    tags: ["아이티 혁명", "서인도제도"],
    isActive: true
  }),
  q({
    id: "V4-W09-013",
    version: "V4",
    week: 9,
    source: "[강의노트] 세계사_09주차(01차시)_100장면_18세기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 프랑스 혁명 급진화와 관련된 것을 모두 고른 것은?\nㄱ. 자코뱅\nㄴ. 상킬로트\nㄷ. 공포정치\nㄹ. 빈 체제",
    options: ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄹ", "ㄴ, ㄹ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "자코뱅, 상킬로트, 공포정치는 프랑스 혁명의 급진화와 관련된다. 빈 체제는 나폴레옹 몰락 이후 유럽 질서 재편과 관련된다.",
    wrongExplanation: "2, 3, 4는 빈 체제를 혁명 급진화 국면에 포함하는 오류가 있다.",
    keyword: "자코뱅 상킬로트 공포정치",
    tags: ["프랑스 혁명", "조합형"],
    isActive: true
  }),
  q({
    id: "V4-W10-003",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "빈 체제의 성격에 대한 설명으로 가장 적절한 것은?",
    options: ["혁명과 민족주의를 적극 장려한 급진적 국제질서였다", "나폴레옹 이후 보수적 복고와 세력균형을 지향한 질서였다", "산업혁명 노동자 계급의 정치권력을 보장한 질서였다", "프랑스 혁명의 공화주의를 유럽 전역에 확산시킨 질서였다"],
    answer: 2,
    explanation: "빈 체제는 나폴레옹 전쟁 이후 유럽의 보수적 질서를 회복하고 세력균형을 유지하려 했다. 자유주의와 민족주의의 확산은 오히려 빈 체제에 대한 도전으로 작용했다.",
    wrongExplanation: "1과 4는 빈 체제의 보수성을 반대로 설명한 것이고, 3은 산업혁명 이후 사회문제를 빈 체제의 핵심 목적으로 오해한 것이다.",
    keyword: "빈 체제",
    tags: ["빈 체제", "보수주의"],
    isActive: true
  }),
  q({
    id: "V4-W10-005",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "영국 산업혁명의 배경으로 보기 어려운 것은?",
    options: ["풍부한 석탄", "축적된 자본", "식민지와 해외시장", "길드적 수공업 질서의 영구적 보존"],
    answer: 4,
    explanation: "산업혁명은 전통적 길드·수공업 질서의 보존이 아니라 기계제 생산과 공장제의 확대와 관련된다. 석탄, 자본, 시장은 영국 산업혁명의 중요한 배경이다.",
    wrongExplanation: "1, 2, 3은 산업혁명이 영국에서 먼저 전개될 수 있었던 조건과 관련된다.",
    keyword: "영국 산업혁명 배경",
    tags: ["산업혁명", "영국"],
    isActive: true
  }),
  q({
    id: "V4-W10-006",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "산업혁명의 결과로 나타난 도시적 삶에 대한 설명으로 적절하지 않은 것은?",
    options: ["출퇴근이라는 생활 리듬이 강화되었다", "도시 공간은 계층과 기능에 따라 분화되었다", "중산층은 교외 주거지를 선호하기도 했다", "도시화는 모든 계층의 삶의 질을 균등하게 향상시켰다"],
    answer: 4,
    explanation: "산업혁명과 도시화는 근대적 생활공간을 형성했지만 빈곤, 위생, 노동 문제도 동반했다. 따라서 모든 계층의 삶의 질이 균등하게 향상되었다고 보기 어렵다.",
    wrongExplanation: "1, 2, 3은 19세기 도시화와 생활방식 변화의 특징이다.",
    keyword: "도시화",
    tags: ["산업혁명", "도시화"],
    isActive: true
  }),
  q({
    id: "V4-W10-007",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 산업혁명과 직접 관련된 것을 모두 고른 것은?\nㄱ. 증기기관\nㄴ. 공장제\nㄷ. 대량생산\nㄹ. 장원제의 안정화",
    options: ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄹ", "ㄴ, ㄷ, ㄹ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "증기기관, 공장제, 대량생산은 산업혁명의 핵심 요소이다. 장원제의 안정화는 중세적 농업 질서와 관련된 표현으로 산업혁명의 핵심 개념이 아니다.",
    wrongExplanation: "2, 3, 4는 장원제를 산업혁명 요소로 포함하고 있어 틀렸다.",
    keyword: "산업혁명 핵심 개념",
    tags: ["산업혁명", "조합형"],
    isActive: true
  }),
  q({
    id: "V4-W10-008",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "산업혁명의 역사적 의의로 가장 적절하지 않은 것은?",
    options: ["근대적 삶의 공간을 형성하였다", "유럽의 세계적 우위를 가능하게 했다", "노동문제와 사회주의 사상의 배경을 제공했다", "봉건적 신분질서를 오히려 강화하는 데 집중되었다"],
    answer: 4,
    explanation: "산업혁명은 생산 방식과 사회 구조를 변화시키며 근대 사회의 조건을 만들었다. 봉건적 신분질서를 강화하는 것을 핵심 의의로 보기는 어렵다.",
    wrongExplanation: "1, 2, 3은 산업혁명의 장기적 파급 효과와 관련된다.",
    keyword: "산업혁명의 의의",
    tags: ["산업혁명", "역사적 의의"],
    isActive: true
  }),
  q({
    id: "V4-W10-009",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 유럽 미술의 중심지로 강의노트에서 강조된 도시는?",
    options: ["런던", "파리", "베를린", "빈"],
    answer: 2,
    explanation: "19세기 유럽 미술의 중심지는 파리로 다루어진다. 살롱전과 근대적 미술 흐름이 파리를 중심으로 전개되었다.",
    wrongExplanation: "1, 3, 4도 유럽의 중요한 도시이지만 강의노트의 19세기 미술 중심지로 제시된 곳은 파리이다.",
    keyword: "파리 미술 중심지",
    tags: ["인상파", "파리"],
    isActive: true
  }),
  q({
    id: "V4-W10-010",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "인상파 미술의 특징으로 보기 어려운 것은?",
    options: ["도시의 일상과 순간적 인상을 포착하였다", "빛과 색채의 변화에 주목하였다", "거친 붓터치와 개성적 표현을 활용하였다", "아카데미적 윤곽과 역사화의 규범만을 절대화하였다"],
    answer: 4,
    explanation: "인상파는 아카데미 미술의 규범을 벗어나 빛, 색, 순간적 인상, 도시 일상을 중시했다. 따라서 아카데미적 규범만을 절대화했다는 설명은 부적절하다.",
    wrongExplanation: "1, 2, 3은 인상파 미술의 핵심 특징과 관련된다.",
    keyword: "인상파 특징",
    tags: ["인상파", "미술사"],
    isActive: true
  }),
  q({
    id: "V4-W10-011",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "인상파의 출발과 관련하여 강의노트에서 중요하게 다루어진 인물은?",
    options: ["마네", "밀레", "앵그르", "카바넬"],
    answer: 1,
    explanation: "마네는 전통적 살롱 미술과 다른 근대적 주제와 표현을 제시하며 인상파의 출발점과 관련된 인물로 다루어진다.",
    wrongExplanation: "2는 사실주의 농민화, 3과 4는 아카데미적·관전파 미술과 더 밀접하다.",
    keyword: "마네",
    tags: ["인상파", "마네"],
    isActive: true
  }),
  q({
    id: "V4-W10-012",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 인상파 화가로 보기 어려운 인물은?",
    options: ["모네", "피사로", "밀레", "르누아르"],
    answer: 3,
    explanation: "밀레는 농민의 삶을 주제로 한 사실주의 화가로 분류된다. 모네, 피사로, 르누아르는 인상파와 관련된 화가이다.",
    wrongExplanation: "1, 2, 4는 인상파 미술과 직접적으로 연결된다.",
    keyword: "밀레와 인상파",
    tags: ["인상파", "화가 비교"],
    isActive: true
  }),
  q({
    id: "V4-W10-013",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(01차시)_100장면_19세기 전반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "19세기 전반 유럽의 혁명과 산업화가 함께 보여주는 변화로 가장 적절한 것은?",
    options: ["정치적 자유주의와 사회경제적 근대화가 동시에 긴장을 만들었다", "왕정복고 질서가 아무런 도전 없이 안정화되었다", "도시와 공장은 정치 변화와 무관한 주변 현상에 머물렀다", "민족주의는 오직 식민지 해방운동으로만 등장하였다"],
    answer: 1,
    explanation: "19세기 전반 유럽에서는 자유주의·민족주의 혁명과 산업화·도시화가 함께 전개되며 새로운 긴장을 만들었다. 이는 빈 체제의 보수적 질서와 충돌했다.",
    wrongExplanation: "2는 1830년과 1848년 혁명을 설명하지 못하고, 3은 산업화의 정치사회적 의미를 축소하며, 4는 유럽 민족주의를 지나치게 좁힌다.",
    keyword: "19세기 전반 유럽 변화",
    tags: ["19세기 유럽", "비교형"],
    isActive: true
  }),
  q({
    id: "V4-W10-014",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(02차시)_테마탐구_산업혁명.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "산업혁명 이후 부르주아지가 강조한 가치와 거리가 먼 것은?",
    options: ["근면", "성실", "책임 있는 가장의 역할", "세습 귀족적 향락"],
    answer: 4,
    explanation: "부르주아지는 근면, 성실, 책임, 자기관리와 같은 도덕적 가치를 강조했다. 세습 귀족적 향락은 부르주아적 자기정당화의 핵심 가치와 거리가 있다.",
    wrongExplanation: "1, 2, 3은 중간계급의 가치와 연결된다.",
    keyword: "부르주아 가치",
    tags: ["산업혁명", "부르주아"],
    isActive: true
  }),
  q({
    id: "V4-W10-015",
    version: "V4",
    week: 10,
    source: "[강의노트] 세계사_10주차(03차시)_테마탐구_인상파미술.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "인상파 미술이 19세기 도시문화와 연결되는 이유로 가장 적절한 것은?",
    options: ["중세 성당 장식만을 반복했기 때문이다", "도시의 일상, 속도, 여가, 시각 경험을 회화의 주제로 삼았기 때문이다", "왕실 초상화만을 공식적으로 제작했기 때문이다", "종교적 교리 해석을 미술의 유일한 목적으로 삼았기 때문이다"],
    answer: 2,
    explanation: "인상파는 근대 도시의 일상과 변화하는 시각 경험을 포착했다. 이는 19세기 도시문화와 미술의 결합을 보여준다.",
    wrongExplanation: "1, 3, 4는 인상파의 근대적 주제와 표현을 설명하지 못한다.",
    keyword: "인상파와 도시문화",
    tags: ["인상파", "도시문화"],
    isActive: true
  }),
  q({
    id: "V4-W11-001",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "세계에서 가장 먼저 여성에게 전국 단위 참정권을 인정한 국가로 강의노트에서 다루어진 곳은?",
    options: ["영국", "프랑스", "뉴질랜드", "미국"],
    answer: 3,
    explanation: "뉴질랜드는 여성 참정권의 역사에서 세계 최초의 사례로 다루어진다. 이는 19세기 후반 이후 시민권 확대의 흐름과 연결된다.",
    wrongExplanation: "1, 2, 4는 여성 참정권 인정 시기가 뉴질랜드보다 늦다.",
    keyword: "여성 참정권",
    tags: ["여성 참정권", "19세기 후반"],
    isActive: true
  }),
  q({
    id: "V4-W11-002",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "제국주의에 대한 설명으로 적절하지 않은 것은?",
    options: ["식민지는 원료 공급지와 상품시장으로 활용되었다", "경제적 이해관계가 제국주의의 중요한 배경이었다", "영국과 프랑스가 대표적 제국주의 국가로 등장하였다", "식민지와 본국은 대등한 상호 호혜 관계를 안정적으로 형성하였다"],
    answer: 4,
    explanation: "제국주의는 강대국이 식민지를 정치·경제적으로 지배하고 이용한 구조였다. 따라서 본국과 식민지가 대등한 상호 호혜 관계였다는 설명은 부적절하다.",
    wrongExplanation: "1, 2, 3은 제국주의의 경제적·정치적 성격과 관련된다.",
    keyword: "제국주의",
    tags: ["제국주의", "식민지"],
    isActive: true
  }),
  q({
    id: "V4-W11-003",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "영국 제국주의의 3C 정책에 해당하지 않는 도시는?",
    options: ["카이로", "케이프타운", "캘커타", "캔버라"],
    answer: 4,
    explanation: "영국의 3C 정책은 카이로, 케이프타운, 캘커타를 잇는 제국주의 구상이다. 캔버라는 이 구상의 세 거점에 포함되지 않는다.",
    wrongExplanation: "1, 2, 3은 3C 정책의 핵심 도시이다.",
    keyword: "3C 정책",
    tags: ["제국주의", "영국"],
    isActive: true
  }),
  q({
    id: "V4-W11-004",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "제1차 세계대전의 특징으로 보기 어려운 것은?",
    options: ["총력전", "참호전", "전면전", "단기전"],
    answer: 4,
    explanation: "제1차 세계대전은 장기화된 총력전·참호전·전면전의 성격을 보였다. 단기전은 전쟁의 실제 양상과 맞지 않는다.",
    wrongExplanation: "1, 2, 3은 제1차 세계대전의 대표적 특징이다.",
    keyword: "제1차 세계대전",
    tags: ["제1차 세계대전", "전쟁 양상"],
    isActive: true
  }),
  q({
    id: "V4-W11-005",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "삼국협상에 속하지 않는 국가는?",
    options: ["러시아", "영국", "독일", "프랑스"],
    answer: 3,
    explanation: "삼국협상은 영국, 프랑스, 러시아를 중심으로 형성되었다. 독일은 삼국동맹 측의 중심 국가였다.",
    wrongExplanation: "1, 2, 4는 삼국협상의 구성국이다.",
    keyword: "삼국협상",
    tags: ["제1차 세계대전", "동맹 체제"],
    isActive: true
  }),
  q({
    id: "V4-W11-009",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(02차시)_테마탐구_신사와뱀파이어.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "신사의 이상적 이미지와 가장 거리가 먼 것은?",
    options: ["절제된 태도", "관리된 육체", "유능한 관리자", "향락과 사치의 과시"],
    answer: 4,
    explanation: "신사는 절제, 자기관리, 책임감, 유능함의 이미지와 연결된다. 향락과 사치의 과시는 신사 담론의 이상적 이미지와 거리가 있다.",
    wrongExplanation: "1, 2, 3은 신사의 이상화된 특성과 연결된다.",
    keyword: "신사 이미지",
    tags: ["신사 담론", "남성성"],
    isActive: true
  }),
  q({
    id: "V4-W11-010",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "르완다의 수도는 어디인가?",
    options: ["아디스아바바", "키갈리", "마푸투", "튀니스"],
    answer: 2,
    explanation: "키갈리는 르완다의 수도이다. 강의노트에서는 르완다의 역사와 현재 도시 이미지가 함께 다루어진다.",
    wrongExplanation: "1은 에티오피아, 3은 모잠비크, 4는 튀니지의 수도이다.",
    keyword: "키갈리",
    tags: ["키갈리", "르완다"],
    isActive: true
  }),
  q({
    id: "V4-W11-011",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "르완다를 가장 먼저 식민 지배한 유럽 국가는?",
    options: ["독일", "벨기에", "프랑스", "영국"],
    answer: 1,
    explanation: "르완다는 먼저 독일의 식민 지배를 받았고, 이후 벨기에의 지배를 받았다. 이 지배 변화는 르완다의 식민지적 민족 분류와 연결된다.",
    wrongExplanation: "2는 독일 이후의 지배국이고, 3과 4는 이 문항의 정답이 아니다.",
    keyword: "르완다 식민 지배",
    tags: ["르완다", "식민지배"],
    isActive: true
  }),
  q({
    id: "V4-W11-012",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "벨기에가 르완다 식민통치를 위해 우대한 집단은?",
    options: ["후투", "투치", "트와", "호텐토트"],
    answer: 2,
    explanation: "벨기에는 식민통치 과정에서 투치족을 우대하며 통치 구조를 강화했다. 이는 이후 르완다 사회의 갈등을 심화시키는 배경이 되었다.",
    wrongExplanation: "1과 3은 르완다의 민족 구성과 관련되지만 식민통치에서 우대된 집단은 아니며, 4는 르완다의 전통적 민족 구성에 속하지 않는다.",
    keyword: "투치 우대",
    tags: ["르완다", "투치"],
    isActive: true
  }),
  q({
    id: "V4-W11-013",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "르완다의 전통적 민족 구성에 속하지 않는 것은?",
    options: ["후투", "투치", "트와", "호텐토트"],
    answer: 4,
    explanation: "르완다의 대표적 민족 구성은 후투, 투치, 트와로 설명된다. 호텐토트는 르완다의 전통적 민족 구성에 해당하지 않는다.",
    wrongExplanation: "1, 2, 3은 르완다의 민족 구성과 관련된다.",
    keyword: "르완다 민족 구성",
    tags: ["르완다", "민족 구성"],
    isActive: true
  }),
  q({
    id: "V4-W11-014",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(03차시)_장소_키갈리.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "현재 키갈리의 이미지로 보기 어려운 것은?",
    options: ["친환경 도시", "신산업 육성", "여행하기 비교적 안전한 도시", "내전이 현재 진행 중인 도시"],
    answer: 4,
    explanation: "현재 키갈리는 친환경 정책, 신산업 육성, 비교적 안전한 도시 이미지로 설명된다. 현재 내전이 진행 중인 도시라는 설명은 강의노트의 현재 키갈리 이미지와 맞지 않는다.",
    wrongExplanation: "1, 2, 3은 현재 키갈리를 설명하는 요소로 다루어진다.",
    keyword: "현재 키갈리",
    tags: ["키갈리", "현재 도시 이미지"],
    isActive: true
  }),
  q({
    id: "V4-W11-015",
    version: "V4",
    week: 11,
    source: "[강의노트] 세계사_11주차(01차시)_100장면_19세기 후반기 유럽.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 보기의 ㄱ, ㄴ, ㄷ, ㄹ 중 제국주의와 관련된 설명을 모두 고른 것은?\nㄱ. 식민지는 원료 공급지로 활용되었다.\nㄴ. 식민지는 상품시장으로 기능했다.\nㄷ. 제국주의는 경제적 이해관계와 연결된다.\nㄹ. 식민지 지배는 본국과 식민지의 평등한 협약이었다.",
    options: ["ㄱ, ㄴ, ㄷ", "ㄱ, ㄹ", "ㄴ, ㄷ, ㄹ", "ㄷ, ㄹ"],
    answer: 1,
    explanation: "식민지는 원료 공급지와 상품시장으로 활용되었고, 제국주의에는 경제적 이해관계가 존재했다. 식민지 지배를 평등한 협약으로 보는 것은 제국주의의 지배 구조를 왜곡한다.",
    wrongExplanation: "2, 3, 4는 ㄹ을 포함하거나 핵심 설명을 누락하고 있어 틀렸다.",
    keyword: "제국주의 구조",
    tags: ["제국주의", "조합형"],
    isActive: true
  }),
  q({
    id: "V4-W12-015",
    version: "V4",
    week: 12,
    source: "[강의노트] 세계사_12주차(03차시)_장소_베를린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베를린을 기억의 도시로 이해할 때 가장 적절한 설명은?",
    options: ["가해의 역사를 은폐하기보다 도시 공간 속에서 반복적으로 성찰하게 만든다", "근대 도시의 기능을 모두 제거하고 중세적 질서만 보존한다", "식민지 시장 확보를 위한 영국의 3C 정책을 상징한다", "나폴레옹 제국의 개선문 건설을 직접 기념한다"],
    answer: 1,
    explanation: "베를린은 홀로코스트와 나치즘의 기억을 도시 공간 속에 배치하며 가해의 역사에 대한 성찰을 요구하는 장소로 다루어진다.",
    wrongExplanation: "2는 베를린의 현대적 기억 문화와 맞지 않고, 3은 영국 제국주의, 4는 나폴레옹과 관련된다.",
    keyword: "베를린 기억의 도시",
    tags: ["베를린", "장소와 상징"],
    isActive: true
  }),
  q({
    id: "V4-W13-001",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "미국사의 ‘명백한 운명’이 의미하는 것으로 가장 적절한 것은?",
    options: ["나치즘에 대한 승리", "대서양에서 태평양까지 이어지는 영토 팽창의 정당화", "노예제의 즉각적 폐지", "소련식 계획경제의 수용"],
    answer: 2,
    explanation: "명백한 운명은 미국이 대륙을 가로질러 서부로 팽창하는 것이 운명이라는 관념이다. 이는 미국의 영토 확장 이데올로기와 관련된다.",
    wrongExplanation: "1, 3, 4는 명백한 운명의 직접적 의미가 아니다.",
    keyword: "명백한 운명",
    tags: ["미국", "영토 팽창"],
    isActive: true
  }),
  q({
    id: "V4-W13-002",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "남북전쟁에서 링컨이 우선적으로 내세운 목표로 가장 적절한 것은?",
    options: ["연방의 유지", "남부의 독립 승인", "인종차별의 즉각적 완전 철폐", "서유럽 식민지 획득"],
    answer: 1,
    explanation: "링컨의 남북전쟁 초기 핵심 목표는 연방의 보존이었다. 노예해방은 전쟁 과정에서 중요한 의미를 갖게 되었지만, 초기의 기본 목표는 연방 유지였다.",
    wrongExplanation: "2는 링컨의 목표와 반대이고, 3은 전쟁 초기 목표를 과도하게 확대하며, 4는 문항과 무관하다.",
    keyword: "남북전쟁",
    tags: ["미국", "링컨"],
    isActive: true
  }),
  q({
    id: "V4-W13-003",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "러시아 혁명 이전 지식인들이 농민 속으로 들어가려 한 운동은?",
    options: ["브나로드 운동", "마셜 플랜", "트루먼 독트린", "뉴딜 정책"],
    answer: 1,
    explanation: "브나로드 운동은 러시아 지식인들이 민중, 특히 농민에게 들어가 사회 변화를 모색한 운동이다.",
    wrongExplanation: "2와 3은 냉전 초기 미국의 대외정책이고, 4는 미국 대공황 대응 정책이다.",
    keyword: "브나로드 운동",
    tags: ["러시아 혁명", "농민"],
    isActive: true
  }),
  q({
    id: "V4-W13-004",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "레닌의 정책이나 혁명 노선으로 보기 어려운 것은?",
    options: ["신경제정책", "프롤레타리아 독재", "코민테른", "일국사회주의"],
    answer: 4,
    explanation: "일국사회주의는 레닌보다는 스탈린 시기와 관련된 노선이다. 신경제정책, 프롤레타리아 독재, 코민테른은 레닌 및 볼셰비키 혁명 체제와 관련된다.",
    wrongExplanation: "1, 2, 3은 레닌 시기와 연결되는 개념이다.",
    keyword: "레닌",
    tags: ["레닌", "러시아 혁명"],
    isActive: true
  }),
  q({
    id: "V4-W13-005",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(01차시)_100장면_미국과 소련.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "러시아 혁명의 전개 과정에서 가장 늦게 일어난 사건은?",
    options: ["피의 일요일", "제1차 세계대전 발발", "2월 혁명", "러시아 내전의 본격화"],
    answer: 4,
    explanation: "피의 일요일은 1905년, 제1차 세계대전은 1914년, 2월 혁명은 1917년에 일어났다. 러시아 내전은 혁명 이후 본격화되었다.",
    wrongExplanation: "1, 2, 3은 러시아 내전의 본격화보다 앞선 사건이다.",
    keyword: "러시아 혁명 순서",
    tags: ["러시아 혁명", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W13-006",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『빌러비드』의 작가 토니 모리슨에 대한 설명으로 적절하지 않은 것은?",
    options: ["노벨문학상을 수상했다", "흑인 공동체의 역사적 기억에 관심을 가졌다", "사랑과 그 부재를 다룬 작가로 평가된다", "현재 현역으로 활동하는 작가이다"],
    answer: 4,
    explanation: "토니 모리슨은 2019년에 사망했으므로 현재 현역으로 활동하는 작가라고 볼 수 없다. 강의노트에서는 흑인 공동체의 기억과 트라우마를 다룬 작가로 다루어진다.",
    wrongExplanation: "1, 2, 3은 토니 모리슨에 대한 설명으로 적절하다.",
    keyword: "토니 모리슨",
    tags: ["빌러비드", "토니 모리슨"],
    isActive: true
  }),
  q({
    id: "V4-W13-007",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "다음 중 토니 모리슨의 작품이 아닌 것은?",
    options: ["『가장 푸른 눈』", "『재즈』", "『하녀 이야기』", "『낙원』"],
    answer: 3,
    explanation: "『하녀 이야기』는 토니 모리슨이 아니라 마거릿 애트우드의 작품이다. 『가장 푸른 눈』, 『재즈』, 『낙원』은 토니 모리슨의 작품이다.",
    wrongExplanation: "1, 2, 4는 토니 모리슨의 작품이다.",
    keyword: "토니 모리슨 작품",
    tags: ["토니 모리슨", "작품"],
    isActive: true
  }),
  q({
    id: "V4-W13-008",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『빌러비드』에서 다루지 않는 주제로 가장 적절한 것은?",
    options: ["노예제가 남긴 집단 트라우마", "흑인 여성 노예의 삶", "미국 흑인 공동체의 역사적 경험", "신남부 백인 지배층의 향수와 좌절"],
    answer: 4,
    explanation: "『빌러비드』는 노예제의 기억, 흑인 공동체의 역사적 경험, 흑인 여성 노예의 삶과 트라우마를 다룬다. 신남부 백인 지배층의 향수와 좌절은 핵심 주제가 아니다.",
    wrongExplanation: "1, 2, 3은 작품의 핵심 문제의식과 관련된다.",
    keyword: "빌러비드 주제",
    tags: ["빌러비드", "노예제"],
    isActive: true
  }),
  q({
    id: "V4-W13-009",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "대서양 노예무역에서 아프리카에서 아메리카로 노예가 실려 간 항해를 가리키는 말은?",
    options: ["삼각항해", "중간항해", "남쪽항해", "북방항해"],
    answer: 2,
    explanation: "아프리카에서 아메리카로 노예가 운송된 항해는 중간항해라고 부른다. 이는 대서양 노예무역의 폭력성과 고통을 상징한다.",
    wrongExplanation: "1은 대서양 무역 구조 전체를 가리키며, 3과 4는 해당 용어가 아니다.",
    keyword: "중간항해",
    tags: ["노예무역", "빌러비드"],
    isActive: true
  }),
  q({
    id: "V4-W13-010",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(02차시)_고전_빌러비드.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『빌러비드』의 인물 관계에 대한 설명으로 잘못된 것은?",
    options: ["새서와 헬리는 부부 관계였다", "베이비 석스는 헬리의 어머니이다", "덴버는 베이비 석스의 딸이다", "폴 D는 새서와 과거의 기억으로 연결된다"],
    answer: 3,
    explanation: "덴버는 베이비 석스의 딸이 아니라 새서의 딸이다. 이 인물 관계는 작품의 가족사와 노예제의 트라우마를 이해하는 데 중요하다.",
    wrongExplanation: "1, 2, 4는 작품의 인물 관계와 부합한다.",
    keyword: "빌러비드 인물관계",
    tags: ["빌러비드", "인물관계"],
    isActive: true
  }),
  q({
    id: "V4-W13-011",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린의 경제정책 방향으로 가장 적절한 것은?",
    options: ["농업 중심의 완만한 자유시장화", "중공업 중심의 급속한 산업화와 집단농장화", "봉건 지주제의 복구", "서유럽식 복지국가 모델의 도입"],
    answer: 2,
    explanation: "스탈린은 5개년 계획을 통해 중공업 중심의 급속한 산업화를 추진했고 농업 집단화를 강행했다. 이는 소련의 중앙집권적 경제 건설과 연결된다.",
    wrongExplanation: "1, 3, 4는 스탈린식 경제정책의 방향과 맞지 않는다.",
    keyword: "스탈린 경제정책",
    tags: ["스탈린", "5개년 계획"],
    isActive: true
  }),
  q({
    id: "V4-W13-012",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "홀로도모르에 대한 설명으로 가장 적절한 것은?",
    options: ["대숙청 시기 비밀경찰 조직의 명칭", "우크라이나에서 발생한 대기근과 대량 아사 사건", "소련의 해외 정보기관", "트로츠키의 혁명 이론"],
    answer: 2,
    explanation: "홀로도모르는 1930년대 초 우크라이나에서 발생한 대기근을 가리킨다. 이는 스탈린식 농업 집단화와 폭력적 통치의 문제와 연결된다.",
    wrongExplanation: "1은 NKVD와 관련되고, 3은 정보기관 문제이며, 4는 영구혁명론과 관련된다.",
    keyword: "홀로도모르",
    tags: ["스탈린", "우크라이나 대기근"],
    isActive: true
  }),
  q({
    id: "V4-W13-013",
    version: "V4",
    week: 13,
    source: "[강의노트] 세계사_13주차(03차시)_인물_스탈린.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스탈린 시대 대숙청에 대한 설명으로 적절하지 않은 것은?",
    options: ["NKVD가 숙청의 도구로 활용되었다", "1937~1938년에 절정에 이르렀다", "숙청 대상자들은 처형되거나 굴라그에 수용되었다", "권력자들 사이의 사건이었기 때문에 일반인의 피해는 없었다"],
    answer: 4,
    explanation: "대숙청은 권력층만이 아니라 일반 시민, 당원, 군인, 지식인 등 광범위한 집단에 피해를 주었다. 일반인의 피해가 없었다는 설명은 틀렸다.",
    wrongExplanation: "1, 2, 3은 대숙청의 실제 양상과 관련된다.",
    keyword: "대숙청",
    tags: ["스탈린", "대숙청"],
    isActive: true
  }),
  q({
    id: "V4-W14-001",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1947년 냉전 체제 성립과 직접 관련된 사건으로 가장 적절한 것은?",
    options: ["트루먼 독트린과 즈다노프 독트린의 등장", "마스트리흐트 조약의 체결", "프랑크푸르트 의회의 소집", "베벨 광장 분서 사건"],
    answer: 1,
    explanation: "1947년 트루먼 독트린과 즈다노프 독트린은 자본주의 진영과 공산주의 진영의 대립을 상징한다. 이는 냉전 체제 성립의 핵심 계기이다.",
    wrongExplanation: "2는 유럽연합, 3은 1848년 혁명, 4는 나치 독일의 기억 문화와 관련된다.",
    keyword: "트루먼 독트린 즈다노프 독트린",
    tags: ["냉전", "1947년"],
    isActive: true
  }),
  q({
    id: "V4-W14-002",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "제2차 세계대전 이후 탈식민화의 사례로 강의노트에서 제시된 것으로 적절한 것은?",
    options: ["인도와 파키스탄의 독립", "삼부회의 소집", "툴롱 전투", "베르사유 궁전 건설"],
    answer: 1,
    explanation: "강의노트는 1947년 인도와 파키스탄의 독립을 제2차 세계대전 이후 탈식민화의 중요한 사례로 다룬다.",
    wrongExplanation: "2는 프랑스 혁명, 3은 나폴레옹의 부상, 4는 절대왕정의 상징과 관련된다.",
    keyword: "탈식민화",
    tags: ["탈식민화", "인도 파키스탄"],
    isActive: true
  }),
  q({
    id: "V4-W14-003",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "이스라엘 건국과 팔레스타인 문제에 대한 설명으로 가장 적절한 것은?",
    options: ["1948년 이스라엘 건국은 국제 분쟁의 불씨가 되었다", "PLO는 19세기 초 빈 체제의 산물이었다", "오슬로 협정은 프랑스 혁명 직후 체결되었다", "서안지구 분리장벽은 나폴레옹 전쟁의 결과였다"],
    answer: 1,
    explanation: "강의노트는 1948년 이스라엘 건국과 UN 승인을 다루면서 팔레스타인 문제와 국제 분쟁의 불씨를 함께 설명한다.",
    wrongExplanation: "2, 3, 4는 시기와 사건의 연결이 모두 부적절하다.",
    keyword: "이스라엘 팔레스타인",
    tags: ["중동 문제", "이스라엘"],
    isActive: true
  }),
  q({
    id: "V4-W14-004",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "냉전 종식 과정의 순서로 가장 적절한 것은?",
    options: ["고르바초프 개혁-베를린 장벽 붕괴-독일 재통일-소련 해체", "베를린 장벽 붕괴-고르바초프 개혁-소련 해체-독일 재통일", "소련 해체-독일 재통일-고르바초프 개혁-베를린 장벽 붕괴", "독일 재통일-소련 해체-베를린 장벽 붕괴-고르바초프 개혁"],
    answer: 1,
    explanation: "1985년 고르바초프의 개혁·개방 정책 이후 1989년 베를린 장벽이 붕괴했고, 1990년 독일 재통일과 1991년 소련 해체로 냉전 종식이 이어졌다.",
    wrongExplanation: "2, 3, 4는 고르바초프 개혁과 소련 해체의 선후 관계를 뒤섞고 있다.",
    keyword: "냉전 종식",
    tags: ["냉전", "사건 순서"],
    isActive: true
  }),
  q({
    id: "V4-W14-005",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(01차시)_100장면_냉전.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "베트남 전쟁과 아프가니스탄 전쟁을 냉전사에서 함께 다룰 수 있는 이유로 가장 적절한 것은?",
    options: ["양자가 모두 냉전 진영 대립의 대리전적 성격을 보여주기 때문이다", "두 전쟁 모두 프랑스 혁명 직후 발생했기 때문이다", "양자가 모두 영국 산업혁명의 직접 결과이기 때문이다", "두 전쟁 모두 여성 참정권 운동의 결과였기 때문이다"],
    answer: 1,
    explanation: "베트남 전쟁과 아프가니스탄 전쟁은 냉전기 강대국의 진영 대립이 지역 분쟁 속에서 표출된 사례로 다루어진다.",
    wrongExplanation: "2, 3, 4는 전쟁의 시기와 원인을 잘못 연결한 설명이다.",
    keyword: "냉전 대리전",
    tags: ["냉전", "대리전"],
    isActive: true
  }),
  q({
    id: "V4-W14-006",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(02차시)_테마탐구_스파이의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "냉전기 스파이에 대한 설명으로 가장 적절한 것은?",
    options: ["경쟁 국가의 정보를 몰래 알아내어 자국 또는 상대 진영에 제공하는 활동과 관련된다", "오직 공개 외교 협상만을 담당한 직업군이다", "군사 기술과 체제 경쟁과는 무관했다", "냉전 종식 이후에야 처음 등장했다"],
    answer: 1,
    explanation: "강의노트에서 스파이는 한 국가의 정보를 몰래 알아내어 경쟁 국가에 제공하는 존재로 설명된다. 냉전기에는 체제 경쟁, 군사기술 확보, 상대 체제 약화와 연결되었다.",
    wrongExplanation: "2는 비밀 첩보의 성격을 부정하고, 3은 냉전기 스파이 활동의 핵심을 누락하며, 4는 역사적 시기가 틀렸다.",
    keyword: "스파이",
    tags: ["스파이", "냉전"],
    isActive: true
  }),
  q({
    id: "V4-W14-013",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『농담』의 구성에 대한 설명으로 적절한 것은?",
    options: ["여러 화자의 시점이 교차하는 다성적 구성을 보인다", "단일 왕의 연대기 형식으로만 전개된다", "법령 조문만을 모아 놓은 정치 문서이다", "인상파 회화 작품 목록으로 구성된다"],
    answer: 1,
    explanation: "강의노트는 『농담』이 루드비크, 헬레나, 야로슬라프, 코스트카 등 여러 화자를 통해 전개되는 다성적 구성을 가진다고 설명한다.",
    wrongExplanation: "2, 3, 4는 작품 형식에 대한 설명으로 부적절하다.",
    keyword: "농담 다성적 구성",
    tags: ["농담", "서술 방식"],
    isActive: true
  }),
  q({
    id: "V4-W14-014",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『농담』에서 루드비크의 복수가 실패로 귀결되는 이유로 가장 적절한 것은?",
    options: ["복수의 대상인 제마네크가 이미 과거의 관계와 감정에서 벗어나 있었기 때문이다", "제마네크가 나폴레옹의 부하였기 때문이다", "헬레나가 프랑크푸르트 의회를 해산했기 때문이다", "루드비크가 월스트리트를 점령했기 때문이다"],
    answer: 1,
    explanation: "루드비크는 제마네크에게 복수하기 위해 헬레나와 관계를 맺지만, 제마네크는 오히려 그를 스스럼없이 대한다. 이는 복수가 과거를 회복하거나 교정하지 못함을 보여준다.",
    wrongExplanation: "2, 3, 4는 작품의 인물 관계 및 줄거리와 무관하다.",
    keyword: "농담 복수 실패",
    tags: ["농담", "복수"],
    isActive: true
  }),
  q({
    id: "V4-W14-015",
    version: "V4",
    week: 14,
    source: "[강의노트] 세계사_14주차(03차시)_고전_농담.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "『농담』이 보여주는 전체주의 사회의 특징으로 가장 적절한 것은?",
    options: ["사소한 언어와 농담도 정치적 충성의 문제로 해석될 수 있다", "모든 개인적 표현은 국가 권력과 완전히 무관한 사적 영역에만 머문다", "정치적 판단은 오직 자유로운 개인 선택으로만 이루어진다", "공개재판과 축출은 작품 속 사회에서 전혀 등장하지 않는다"],
    answer: 1,
    explanation: "『농담』은 사소한 농담이 정치적 이단의 증거로 해석되는 상황을 통해 전체주의 체제의 폭력성을 보여준다.",
    wrongExplanation: "2와 3은 작품의 문제의식과 반대이고, 4는 루드비크의 몰락 과정과 맞지 않는다.",
    keyword: "농담 전체주의",
    tags: ["농담", "전체주의"],
    isActive: true
  }),
  q({
    id: "V4-W15-001",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1964년 미국 공연을 통해 대중문화 성장의 상징으로 강의노트에서 제시된 그룹은?",
    options: ["비틀즈", "롤링 스톤스", "퀸", "핑크 플로이드"],
    answer: 1,
    explanation: "강의노트는 1964년 비틀즈의 미국 첫 공연을 대중문화 성장의 상징적 사건으로 다룬다. 이는 전후 호황, 베이비붐, 청소년 소비세대의 등장과 연결된다.",
    wrongExplanation: "2, 3, 4도 대중음악사에서 중요하지만 해당 강의노트의 기준 사건은 비틀즈의 미국 공연이다.",
    keyword: "비틀즈 대중문화",
    tags: ["대중문화", "비틀즈"],
    isActive: true
  }),
  q({
    id: "V4-W15-002",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "68혁명의 배경과 전개에 대한 설명으로 적절하지 않은 것은?",
    options: ["전후 세대의 새로운 문화적 실험과 연결된다", "권위주의적 기성세대에 대한 저항을 포함했다", "베트남 전쟁 반대 운동과 연결되었다", "봉건 귀족 질서의 완전한 복구만을 목표로 삼았다"],
    answer: 4,
    explanation: "68혁명은 청년문화, 반전운동, 성 해방, 권위주의 비판 등과 연결되었다. 봉건 귀족 질서의 복구를 목표로 한 운동이 아니다.",
    wrongExplanation: "1, 2, 3은 강의노트의 68혁명 설명과 부합한다.",
    keyword: "68혁명",
    tags: ["68혁명", "청년문화"],
    isActive: true
  }),
  q({
    id: "V4-W15-003",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "1973년 오일쇼크 이후 1980년대 레이거노믹스·대처리즘과 연결되는 흐름은?",
    options: ["신자유주의", "공포정치", "빈 체제", "장원제"],
    answer: 1,
    explanation: "강의노트는 1973년 오일쇼크 이후 국가의 경제적 역할을 둘러싼 논쟁과 1980년대 레이건·대처의 신자유주의적 전환을 연결한다.",
    wrongExplanation: "2는 프랑스 혁명, 3은 나폴레옹 이후 국제질서, 4는 중세적 토지질서와 관련된다.",
    keyword: "신자유주의",
    tags: ["오일쇼크", "신자유주의"],
    isActive: true
  }),
  q({
    id: "V4-W15-004",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "인터넷 혁명의 시작과 관련하여 강의노트에서 제시된 사건은?",
    options: ["1991년 WWW의 등장", "1789년 인권선언", "1815년 빈 회의", "1948년 이스라엘 건국"],
    answer: 1,
    explanation: "강의노트는 1991년 WWW의 등장을 인터넷 혁명의 시작과 관련해 다룬다. 이후 모자이크 등은 대중이 웹에 접근하는 데 중요한 역할을 했다.",
    wrongExplanation: "2, 3, 4는 각각 프랑스 혁명, 빈 체제, 중동 문제와 관련된다.",
    keyword: "WWW 인터넷 혁명",
    tags: ["인터넷 혁명", "WWW"],
    isActive: true
  }),
  q({
    id: "V4-W15-005",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(01차시)_100장면_오늘날의세계.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "유럽연합 성립 과정과 관련된 조약은?",
    options: ["마스트리흐트 조약", "파리조약", "베르사유 조약", "오슬로 협정"],
    answer: 1,
    explanation: "강의노트는 1992년 마스트리흐트 조약을 유럽연합 성립과 관련해 다룬다. 이는 유럽의 통화·정치 동맹을 제도화하는 흐름과 연결된다.",
    wrongExplanation: "2는 미국 독립전쟁 종결, 3은 제1차 세계대전 이후 질서, 4는 이스라엘-팔레스타인 문제와 관련된다.",
    keyword: "마스트리흐트 조약",
    tags: ["유럽연합", "마스트리흐트 조약"],
    isActive: true
  }),
  q({
    id: "V4-W15-006",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "뉴욕의 정치적 중심성을 보여주는 장소로 강의노트에서 제시된 것은?",
    options: ["국제연합 본부", "바스티유 감옥", "프랑크푸르트 의회", "베벨 광장"],
    answer: 1,
    explanation: "뉴욕의 국제연합 본부는 국제질서 운영에서 미국의 영향력을 상징하는 장소로 다루어진다. 강의노트에서는 정치적 중심지로서의 뉴욕을 설명하는 데 사용된다.",
    wrongExplanation: "2는 프랑스 혁명, 3은 1848년 독일 혁명, 4는 나치 분서 기억과 관련된다.",
    keyword: "뉴욕 국제연합 본부",
    tags: ["뉴욕", "국제연합"],
    isActive: true
  }),
  q({
    id: "V4-W15-007",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "뉴욕의 경제적 중심성을 상징하는 장소는?",
    options: ["타임스퀘어", "월스트리트", "센트럴파크", "자유의 여신상"],
    answer: 2,
    explanation: "월스트리트는 로어 맨해튼 파이낸셜 디스트릭트에 위치하며 세계 경제의 중심을 상징한다. 강의노트에서는 뉴욕의 경제적 중심성을 설명하는 장소로 제시된다.",
    wrongExplanation: "1은 문화·엔터테인먼트, 3은 도시공간, 4는 자유와 이민의 상징으로 이해된다.",
    keyword: "월스트리트",
    tags: ["뉴욕", "경제 중심지"],
    isActive: true
  }),
  q({
    id: "V4-W15-008",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "뉴욕의 문화적 중심성을 상징하는 장소로 가장 적절한 것은?",
    options: ["타임스퀘어", "베를린 장벽", "베르사유 궁전", "보스턴 차 사건 현장"],
    answer: 1,
    explanation: "타임스퀘어는 브로드웨이 극장가와 엔터테인먼트 산업과 연결되며 뉴욕의 문화적 중심성을 상징한다.",
    wrongExplanation: "2는 냉전, 3은 프랑스 절대왕정, 4는 미국 독립혁명과 관련된다.",
    keyword: "타임스퀘어",
    tags: ["뉴욕", "문화 중심지"],
    isActive: true
  }),
  q({
    id: "V4-W15-009",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "테러리즘에 대한 강의노트의 설명으로 가장 적절한 것은?",
    options: ["정치적 목적을 위해 무고한 사람들에게 공포를 확산시키는 폭력의 사용이다", "오직 자연재해를 뜻하는 말이다", "군주정 복구를 위한 공개 의례만을 뜻한다", "경제 성장률을 측정하는 통계 용어이다"],
    answer: 1,
    explanation: "강의노트는 테러리즘을 정치적 목적을 위해 무고한 사람들을 수단으로 삼아 공포를 확산시키는 폭력으로 설명한다.",
    wrongExplanation: "2, 3, 4는 테러리즘의 정의와 무관하다.",
    keyword: "테러리즘",
    tags: ["테러리즘", "9.11"],
    isActive: true
  }),
  q({
    id: "V4-W15-010",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(02차시)_장소_뉴욕.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "9.11 테러 이후 미국의 대응으로 적절하지 않은 것은?",
    options: ["테러와의 전쟁 선포", "아프가니스탄 침공", "이라크 침공", "바이마르 공화국 수립"],
    answer: 4,
    explanation: "9.11 이후 미국은 테러와의 전쟁을 선포하고 아프가니스탄과 이라크를 침공했다. 바이마르 공화국 수립은 제1차 세계대전 이후 독일의 사건이다.",
    wrongExplanation: "1, 2, 3은 9.11 이후 미국의 대응과 관련된다.",
    keyword: "9.11 테러와의 전쟁",
    tags: ["9.11", "테러와의 전쟁"],
    isActive: true
  }),
  q({
    id: "V4-W15-013",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "백신의 역사와 관련해 강의노트에서 ‘면역학의 아버지’로 소개된 인물은?",
    options: ["에드워드 제너", "밀턴 프리드먼", "고르바초프", "투생 루베르튀르"],
    answer: 1,
    explanation: "에드워드 제너는 종두법 개발을 통해 천연두 예방의 새로운 전기를 마련한 인물로, 강의노트에서 면역학의 아버지로 소개된다.",
    wrongExplanation: "2는 신자유주의 경제학, 3은 냉전 종식, 4는 아이티 혁명과 관련된다.",
    keyword: "에드워드 제너",
    tags: ["백신", "면역학"],
    isActive: true
  }),
  q({
    id: "V4-W15-014",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "스페인 독감에 대한 설명으로 가장 적절한 것은?",
    options: ["1918~1920년 사이 전 세계적으로 대유행하였다", "1948년 이스라엘 건국의 직접 원인이었다", "1991년 WWW의 등장과 같은 사건이다", "1968년 프랑스 학생운동의 명칭이다"],
    answer: 1,
    explanation: "강의노트는 스페인 독감을 1918~1920년 사이 전 세계적으로 유행한 팬데믹으로 설명한다. 감염자와 사망자가 막대했던 20세기 대표적 감염병 위기이다.",
    wrongExplanation: "2, 3, 4는 각각 중동 문제, 인터넷 혁명, 68혁명과 관련된다.",
    keyword: "스페인 독감",
    tags: ["스페인 독감", "팬데믹"],
    isActive: true
  }),
  q({
    id: "V4-W15-015",
    version: "V4",
    week: 15,
    source: "[강의노트] 세계사_15주차(03차시)_테마탐구_펜데믹.pdf",
    type: "single_choice",
    difficulty: "hard",
    question: "팬데믹 이후 사회변동으로 강의노트에서 다룬 내용으로 적절하지 않은 것은?",
    options: ["사회적 고립과 코로나 블루", "인포데믹 현상", "국가 역할에 대한 재고", "전염병으로 인한 정보 혼란의 완전한 소멸"],
    answer: 4,
    explanation: "강의노트는 팬데믹 이후 사회적 고립, 인포데믹, 국가 역할 재고, 경제위기와 4차 산업혁명 기회 등을 다룬다. 정보 혼란이 완전히 소멸했다는 설명은 맞지 않는다.",
    wrongExplanation: "1, 2, 3은 팬데믹 이후 사회변동으로 다루어진다.",
    keyword: "팬데믹 사회변동",
    tags: ["팬데믹", "사회변동"],
    isActive: true
  }),
];

const QUESTION_BANK: Question[] = [...V0_QUESTION_BANK, ...V3_QUESTION_BANK, ...V4_QUESTION_BANK];
const VERSION_OPTIONS: Array<Question['version']> = ['V0', 'V3', 'V4'];
const COUNT_OPTIONS = Array.from({ length: 19 }, (_, i) => 10 + i * 5);

export default function App() {
  const weekOptions = useMemo(
    () => Array.from(new Set(QUESTION_BANK.map((item) => item.week))).sort((a, b) => a - b),
    []
  );

  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [incorrectNotes, setIncorrectNotes] = useState<StoredWrongNote[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<Array<Question['version']>>(['V0', 'V3', 'V4']);
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>(weekOptions);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizStart, setQuizStart] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [stats, setStats] = useState({ totalTaken: 0, totalCorrect: 0, totalQuestions: 0 });

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (currentTab === 'quiz' && quizStart) {
      timer = setInterval(() => setTimeElapsed(Math.floor((Date.now() - quizStart) / 1000)), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentTab, quizStart]);

  const filtered = useMemo(
    () => QUESTION_BANK.filter((item) => item.isActive && selectedVersions.includes(item.version) && selectedWeeks.includes(item.week)),
    [selectedVersions, selectedWeeks]
  );

  const actualCount = Math.min(questionCount, Math.max(1, filtered.length || 1));
  const currentQ = quizQuestions[currentQIndex];
  const currentAnswer = selectedAnswers[currentQIndex];
  const score = quizQuestions.reduce((acc, question, idx) => acc + (selectedAnswers[idx] === question.answer ? 1 : 0), 0);

  const toggleVersion = (version: Question['version']) => {
    setSelectedVersions((prev) => {
      if (prev.includes(version)) {
        const next = prev.filter((v) => v !== version);
        return next.length > 0 ? next : prev;
      }
      return [...prev, version].sort((a, b) => VERSION_OPTIONS.indexOf(a) - VERSION_OPTIONS.indexOf(b));
    });
  };

  const toggleWeek = (week: number) => {
    setSelectedWeeks((prev) => {
      if (prev.includes(week)) {
        const next = prev.filter((item) => item !== week);
        return next.length > 0 ? next : prev;
      }
      return [...prev, week].sort((a, b) => a - b);
    });
  };

  const startQuiz = () => {
    if (!filtered.length) {
      setShowEmptyAlert(true);
      return;
    }
    setShowEmptyAlert(false);
    setQuizQuestions(shuffleArray(filtered).slice(0, actualCount));
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setSubmitted(false);
    setQuizStart(Date.now());
    setTimeElapsed(0);
    setCurrentTab('quiz');
  };

  const selectAnswer = (index: number) => {
    if (!currentQ || submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: index + 1 }));
    setSubmitted(true);
  };

  const next = () => {
    if (!currentQ) return;

    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSubmitted(false);
      return;
    }

    const wrongs: StoredWrongNote[] = quizQuestions
      .filter((question, idx) => selectedAnswers[idx] !== question.answer)
      .map((question, idx) => ({ ...question, userChoice: selectedAnswers[idx], timestamp: Date.now() + idx }));

    setIncorrectNotes((prev) => {
      const existing = new Set(prev.map((item) => `${item.version}-${item.id}`));
      const merged = [...prev];
      wrongs.forEach((item) => {
        const key = `${item.version}-${item.id}`;
        if (!existing.has(key)) merged.push(item);
      });
      return merged;
    });

    setStats((prev) => ({
      totalTaken: prev.totalTaken + 1,
      totalCorrect: prev.totalCorrect + score,
      totalQuestions: prev.totalQuestions + quizQuestions.length,
    }));

    setCurrentTab('results');
  };

  const Dashboard = () => (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl md:p-12">
        <div className="pointer-events-none absolute right-0 top-0 translate-x-12 -translate-y-12 p-8 opacity-5">
          <BrainCircuit size={300} />
        </div>
        <div className="relative z-10">
          <span className="mb-5 inline-block rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-950 shadow-lg">
            RESTORED BUILD
          </span>
          <h2 className="mb-5 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-5xl font-serif">
            세계사 통합 마스터 모의고사 시스템
          </h2>
          <p className="mb-8 max-w-2xl text-base font-light leading-relaxed text-slate-300 md:text-lg">
            선택한 버전과 주차를 기준으로 활성화된 문항만 랜덤 출제됩니다.
          </p>

          <div className="mb-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-100">출제 버전 선택</h3>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-400">
                  선택된 버전: <strong className="text-white">{selectedVersions.length}</strong>개
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {VERSION_OPTIONS.map((version) => {
                  const isSelected = selectedVersions.includes(version);
                  return (
                    <button
                      key={version}
                      onClick={() => toggleVersion(version)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold ${
                        isSelected
                          ? 'border-amber-300 bg-amber-500/90 text-white'
                          : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle size={16} className="text-amber-100" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-600" />}
                      {version}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-100">출제 범위 (주차) 선택</h3>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-400">
                  현재 범위 내 문항: <strong className="text-white">{filtered.length}</strong> 문항
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {weekOptions.map((week) => {
                  const isSelected = selectedWeeks.includes(week);
                  return (
                    <button
                      key={week}
                      onClick={() => toggleWeek(week)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-600/90 text-white'
                          : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle size={16} className="text-indigo-200" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-600" />}
                      {week}주차
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-100">출제 문항 수 선택</h3>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-400">
                  실제 출제 수: <strong className="text-white">{actualCount}</strong> 문항
                </div>
              </div>
              <div className="max-w-xs">
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number.parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border-2 border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {COUNT_OPTIONS.map((count) => (
                    <option key={count} value={count}>
                      {count}문항
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showEmptyAlert && (
              <div className="rounded-lg border border-rose-900/50 bg-rose-950/50 p-3 text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertCircle size={16} /> 최소 1개 이상의 활성 문항이 있어야 테스트를 시작할 수 있습니다.
              </div>
            )}
          </div>

          <button
            onClick={startQuiz}
            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-4 font-black text-slate-900 hover:scale-[1.03]"
          >
            <Play size={24} fill="currentColor" /> 선택 범위 {actualCount}문항 테스트 시작
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <BarChart3 size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tests</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {stats.totalTaken}
            <span className="ml-1 text-lg font-normal text-slate-400">회</span>
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">누적 모의고사 응시</p>
        </div>
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Trophy size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accuracy</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0}
            <span className="ml-1 text-lg font-normal text-slate-400">%</span>
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">전체 정답률</p>
        </div>
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DB Size</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {QUESTION_BANK.length}
            <span className="ml-1 text-lg font-normal text-slate-400">Q</span>
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">현재 보유 문항</p>
        </div>
        <div
          onClick={() => setCurrentTab('notes')}
          className="cursor-pointer rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
              <Bookmark size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Review</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            {incorrectNotes.length}
            <span className="ml-1 text-lg font-normal text-slate-400">개</span>
          </p>
          <p className="mt-1 text-sm font-bold text-rose-500">오답 노트 확인하기 →</p>
        </div>
      </div>
    </div>
  );

  const Quiz = () => {
    if (!currentQ) return null;
    const total = quizQuestions.length;
    const isCorrect = currentAnswer === currentQ.answer;

    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <div className="mb-3 flex items-end justify-between">
            <span className="inline-block rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-indigo-600 shadow-sm">
              Question {currentQIndex + 1} / {total}
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
              <Clock size={16} className="text-indigo-500" /> {formatTime(timeElapsed)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/70 shadow-inner">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
              style={{ width: `${(currentQIndex / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-xl">
          <div className="relative border-b border-slate-100 bg-slate-50/80 p-8 md:p-12">
            <span className="mb-6 inline-block rounded-lg border border-indigo-200 bg-indigo-100 px-3 py-1.5 text-xs font-black text-indigo-800 shadow-sm">
              📚 출처: {currentQ.source}
            </span>
            <h3 className="break-keep whitespace-pre-wrap font-serif text-2xl font-bold leading-snug text-slate-800 md:text-3xl">
              {currentQ.question}
            </h3>
          </div>
          <div className="bg-white p-8 md:p-12">
            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                const optionNum = idx + 1;
                let btnStateClass = 'border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-md';
                if (submitted) {
                  if (optionNum === currentQ.answer) btnStateClass = 'border-emerald-500 bg-emerald-50 font-bold text-emerald-950';
                  else if (optionNum === currentAnswer) btnStateClass = 'border-rose-300 bg-rose-50 text-rose-900 line-through opacity-60';
                  else btnStateClass = 'border-slate-100 bg-slate-50 opacity-40';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    disabled={submitted}
                    className={`flex w-full items-start gap-5 rounded-2xl border-2 p-5 text-left md:items-center md:p-6 ${btnStateClass}`}
                  >
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-lg font-black text-slate-400 shadow-sm">
                      {optionNum}
                    </span>
                    <span className="pt-1 text-base font-medium leading-relaxed md:pt-0 md:text-lg">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {submitted && (
          <div className={`mb-6 rounded-[2rem] border p-8 shadow-xl ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {isCorrect ? (
                <div className="rounded-full bg-emerald-100 p-4 shadow-inner">
                  <CheckCircle className="text-emerald-600" size={40} />
                </div>
              ) : (
                <div className="rounded-full bg-rose-100 p-4 shadow-inner">
                  <XCircle className="text-rose-600" size={40} />
                </div>
              )}
              <div className="w-full">
                <h4 className={`mb-4 text-2xl font-black ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {isCorrect ? '정답입니다.' : '오답입니다.'}
                </h4>
                {!isCorrect && (
                  <div className="mb-6 rounded-2xl border border-rose-100 bg-white p-5 text-sm text-rose-900 shadow-sm">
                    <span className="mb-2 flex items-center gap-2 font-black text-rose-700">
                      <XCircle size={16} /> 오답 짚고 넘어가기
                    </span>
                    <span className="leading-relaxed">{currentQ.wrongExplanation}</span>
                  </div>
                )}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <p className="text-[15px] font-medium leading-relaxed text-slate-700">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end pb-16">
          {submitted && (
            <button
              onClick={next}
              className="flex items-center gap-3 rounded-2xl bg-slate-900 px-10 py-5 text-lg font-black text-white hover:-translate-y-1 hover:bg-indigo-600"
            >
              {currentQIndex === total - 1 ? '최종 성적표 확인하기' : '다음 문제로 계속 진행'} <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const Results = () => {
    const isPass = score >= quizQuestions.length * 0.7;
    return (
      <div className="mx-auto max-w-4xl py-10 text-center">
        <div className="relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 shadow-2xl md:p-16">
          <div className={`absolute left-0 top-0 h-4 w-full ${isPass ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-rose-400 to-orange-500'}`} />
          <h2 className="mb-4 font-serif text-4xl font-black text-slate-800 md:text-5xl">학습 진단 리포트</h2>
          <p className="mb-12 text-lg font-medium text-slate-500">
            소요 시간: <span className="font-bold text-indigo-600">{formatTime(timeElapsed)}</span>
          </p>
          <div className="mb-12">
            <span className="block text-7xl font-black leading-none text-slate-800">{score}</span>
            <span className="text-xl font-bold uppercase tracking-widest text-slate-400">/ {quizQuestions.length} 점</span>
          </div>
          <div className="mb-12">
            <h3 className={`mb-4 text-3xl font-black ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPass ? '훌륭합니다! 세계사 마스터 등급입니다.' : '취약한 개념을 다시 점검해 보세요.'}
            </h3>
          </div>
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <button
              onClick={() => setCurrentTab('notes')}
              className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-8 py-5 text-lg font-black text-rose-700 transition-colors hover:bg-rose-100"
            >
              <Bookmark size={24} /> 저장된 오답 노트 확인
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-5 text-lg font-black text-white hover:-translate-y-1 hover:bg-indigo-600"
            >
              <Home size={24} /> 대시보드로 복귀
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Notes = () => (
    <div className="mx-auto max-w-5xl pb-16">
      <div className="mb-12 flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="flex items-center gap-4 font-serif text-3xl font-black text-slate-800 md:text-4xl">
            <div className="rounded-2xl bg-rose-100 p-3">
              <Bookmark className="text-rose-600" size={36} />
            </div>
            나만의 오답 노트
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            시험을 치르며 축적된 <span className="font-bold text-rose-600">{incorrectNotes.length}개</span>의 취약 개념을 점검하세요.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-700"
        >
          <Home size={18} /> 대시보드 메인으로
        </button>
      </div>
      {incorrectNotes.length === 0 ? (
        <div className="rounded-[3rem] border border-slate-200 bg-white px-10 py-24 text-center shadow-xl">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-emerald-50 shadow-inner">
            <CheckCircle className="text-emerald-500" size={64} />
          </div>
          <h3 className="mb-4 text-3xl font-black text-slate-800">현재 기록된 오답이 없습니다!</h3>
        </div>
      ) : (
        <div className="space-y-10">
          {[...incorrectNotes].reverse().map((note, idx) => (
            <div key={`${note.version}-${note.id}-${idx}`} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg">
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 px-8 py-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
                <span className="inline-block w-max rounded-lg border border-indigo-200 bg-indigo-100 px-4 py-2 text-sm font-black text-indigo-800 shadow-sm">
                  📌 핵심 키워드: {note.keyword}
                </span>
                <span className="max-w-sm break-all text-right text-xs font-bold text-slate-400 sm:break-normal">{note.source}</span>
              </div>
              <div className="p-8 pl-10 md:p-12 md:pl-14">
                <h3 className="mb-8 font-serif text-2xl font-bold leading-relaxed text-slate-800">{note.question}</h3>
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-6">
                    <p className="mb-3 flex items-center gap-2 text-sm font-black text-slate-400">
                      <XCircle size={16} /> 내가 선택한 오답
                    </p>
                    <p className="text-base font-medium leading-relaxed text-rose-700 line-through">
                      {note.userChoice ? note.options[note.userChoice - 1] : '시간 초과 / 선택 안 함'}
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-6">
                    <p className="mb-3 flex items-center gap-2 text-sm font-black text-emerald-700">
                      <CheckCircle size={16} /> 올바른 정답
                    </p>
                    <p className="text-base font-bold leading-relaxed text-emerald-900">{note.options[note.answer - 1]}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-8">
                  <div className="space-y-4 text-[15px] font-medium leading-loose text-slate-700">
                    <p>{note.explanation}</p>
                    <p className="block rounded-xl border border-rose-100 bg-white p-4 text-sm text-rose-700">
                      <strong className="mr-2 text-rose-800">💡 오답 짚고 넘어가기:</strong>
                      {note.wrongExplanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-50 p-4 font-sans text-slate-800 selection:bg-indigo-200 selection:text-indigo-900 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col items-center justify-between gap-5 border-b-2 border-slate-200/60 pb-6 md:flex-row">
          <div className="group flex cursor-pointer items-center gap-4" onClick={() => setCurrentTab('dashboard')}>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-900 p-3 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
              <BookOpen size={30} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm md:text-4xl">세계사 마스터</h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-indigo-600">Question Bank Edition</p>
            </div>
          </div>
          <nav className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`rounded-xl px-6 py-2.5 text-sm font-bold ${
                currentTab === 'dashboard' ? 'scale-105 bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              대시보드 홈
            </button>
            <button
              onClick={() => setCurrentTab('notes')}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold ${
                currentTab === 'notes' ? 'scale-105 bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              오답 노트
              <span className={`rounded-md px-2 py-0.5 text-xs ${currentTab === 'notes' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {incorrectNotes.length}
              </span>
            </button>
          </nav>
        </header>
        <main>
          {currentTab === 'dashboard' && Dashboard()}
          {currentTab === 'quiz' && Quiz()}
          {currentTab === 'results' && Results()}
          {currentTab === 'notes' && Notes()}
        </main>
      </div>
    </div>
  );
}
