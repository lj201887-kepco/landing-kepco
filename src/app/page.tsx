import ContactForm from "@/components/ContactForm";

const painPoints = [
  {
    title: "개발 인력이 늘 부족해요",
    body: "아이디어는 많은데 개발 리소스가 없어 실행이 미뤄지는 팀에게, 직접 만들어 보는 힘을 드립니다.",
  },
  {
    title: "AI 도구, 쓰긴 쓰는데…",
    body: "채팅창에서 코드를 복사해 붙이는 수준을 넘어, 실제 업무에 쓰는 결과물까지 만드는 방법을 알려드립니다.",
  },
  {
    title: "비개발 직군도 만들고 싶어요",
    body: "기획·마케팅·운영 담당자가 자기 업무용 도구와 페이지를 스스로 만들 수 있도록 돕습니다.",
  },
];

const curriculum = [
  {
    step: "01",
    title: "바이브코딩 이해",
    body: "AI와 함께 만드는 개발 방식의 원리, 가능한 것과 한계, 안전하게 쓰는 기본기를 익힙니다.",
  },
  {
    step: "02",
    title: "프롬프트 설계",
    body: "원하는 결과를 정확히 전달하는 요구사항 정리와 프롬프트 작성법을 실습합니다.",
  },
  {
    step: "03",
    title: "실전 제작 실습",
    body: "랜딩페이지, 사내 도구, 자동화 등 각자의 업무와 맞닿은 결과물을 직접 만들어 봅니다.",
  },
  {
    step: "04",
    title: "배포와 운영",
    body: "만든 결과물을 공개하고 고쳐 나가는 흐름, 보안·품질 점검 포인트를 다룹니다.",
  },
];

const options = [
  {
    title: "맞춤형 커리큘럼",
    body: "조직의 업무와 직군에 맞춰 사전 인터뷰 후 과정을 설계합니다.",
  },
  {
    title: "온·오프라인 선택",
    body: "사내 방문 교육 또는 온라인 라이브 중 편한 방식으로 진행합니다.",
  },
  {
    title: "직군별 반 구성",
    body: "개발자, 비개발자 등 수준에 맞게 나누어 운영할 수 있습니다.",
  },
  {
    title: "교육 후 후속 지원",
    body: "교육 이후 현업 적용 과정에서 생기는 질문을 이어서 지원합니다.",
  },
];

const steps = ["문의 접수", "상담 및 요구 파악", "커리큘럼 제안", "교육 진행"];

export default function Home() {
  return (
    <div className="bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Hero */}
      <header className="relative overflow-hidden bg-zinc-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-8 sm:pb-32">
          <nav className="flex items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">
              Vibe Coding 교육
            </span>
            <a
              href="#contact"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              교육 문의
            </a>
          </nav>

          <div className="mx-auto mt-20 max-w-3xl text-center sm:mt-28">
            <p className="inline-block rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-1.5 text-sm text-indigo-200">
              기업 · 기관 대상 교육
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              말로 설명하면
              <br />
              <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
                서비스가 만들어집니다
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              AI와 함께 코드를 만드는 바이브코딩, 우리 팀의 업무 방식에 맞춰
              실습 중심으로 가르쳐 드립니다.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="h-12 w-full rounded-full bg-indigo-500 px-8 text-base font-medium leading-[3rem] text-white transition hover:bg-indigo-400 sm:w-auto"
              >
                교육 문의하기
              </a>
              <a
                href="#curriculum"
                className="h-12 w-full rounded-full border border-white/20 px-8 text-base font-medium leading-[3rem] transition hover:bg-white/10 sm:w-auto"
              >
                커리큘럼 보기
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Pain points */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            이런 고민, 있으신가요?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {painPoints.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-zinc-200 p-7 dark:border-zinc-800"
              >
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section
          id="curriculum"
          className="scroll-mt-4 bg-zinc-50 py-20 dark:bg-zinc-900/50 sm:py-28"
        >
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              교육 커리큘럼
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-zinc-600 dark:text-zinc-400">
              기본 구성은 아래와 같으며, 조직에 맞게 조정할 수 있습니다.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {curriculum.map((c) => (
                <div
                  key={c.step}
                  className="flex gap-5 rounded-2xl bg-white p-7 shadow-sm dark:bg-zinc-900"
                >
                  <span className="text-3xl font-bold text-indigo-500">
                    {c.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Options */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            우리 조직에 맞게 운영해요
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {options.map((o) => (
              <div key={o.title}>
                <div className="mb-4 h-1 w-10 rounded bg-indigo-500" />
                <h3 className="font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="bg-zinc-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              진행 절차
            </h2>
            <ol className="mt-12 grid gap-4 sm:grid-cols-4">
              {steps.map((s, i) => (
                <li
                  key={s}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <span className="text-sm text-indigo-300">STEP {i + 1}</span>
                  <p className="mt-2 font-semibold">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-4 py-20 sm:py-28">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              교육 문의
            </h2>
            <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
              교육 대상, 인원, 희망 일정을 함께 남겨 주시면 더 빠르게
              안내드릴 수 있습니다.
            </p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        Vibe Coding 교육 · 기업 교육 문의
      </footer>
    </div>
  );
}
