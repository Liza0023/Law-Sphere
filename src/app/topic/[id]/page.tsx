import { createClient } from "../../utils/supabase/server";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, title, chapter_number, subjects(name, semester)")
    .eq("id", id)
    .single();

  if (!chapter) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] p-6">
        <p>Chapter not found.</p>
      </main>
    );
  }

  const subject = Array.isArray(chapter.subjects)
    ? chapter.subjects[0]
    : chapter.subjects;

  const { data: content } = await supabase
    .from("chapter_content")
    .select("*")
    .eq("chapter_id", id)
    .single();

  const { data: flashcards } = await supabase
    .from("flashcards")
    .select("*")
    .eq("chapter_id", id);

  const { data: cases } = await supabase
    .from("case_studies")
    .select("*")
    .eq("chapter_id", id);

  const { data: pyqs } = await supabase
    .from("pyqs")
    .select("*")
    .eq("chapter_id", id);

  const { data: mcqs } = await supabase
    .from("mcqs")
    .select("*")
    .eq("chapter_id", id);

  const { data: matches } = await supabase
    .from("match_the_following")
    .select("*")
    .eq("chapter_id", id);

  const table = content?.table_data as
    | { title?: string; columns?: string[]; rows?: string[][] }
    | null;
  const flow = content?.flowchart_data as
    | { title?: string; steps?: string[] }
    | null;

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2332] p-6 max-w-3xl mx-auto">
      <p className="text-xs text-[#B8945F] font-mono mb-1">
        {subject?.name} · Sem {subject?.semester} · Chapter{" "}
        {chapter.chapter_number}
      </p>
      <h1 className="text-3xl font-bold mb-6">{chapter.title}</h1>

      {content?.definition && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Definition
          </h2>
          <p className="text-[#5B6472] mb-6">{content.definition}</p>
        </>
      )}

      {content?.important_dates && (
        <div className="bg-[#FFF6D6] border-l-4 border-[#B8945F] rounded p-4 mb-6 whitespace-pre-line">
          <p className="text-xs font-mono text-[#B8945F] mb-1">
            IMPORTANT DATES
          </p>
          <p>{content.important_dates}</p>
        </div>
      )}

      {content?.highlighted_points && (
        <div className="bg-[#FDECEC] border-l-4 border-[#7A2E2E] rounded p-4 mb-6 whitespace-pre-line">
          <p className="text-xs font-mono text-[#7A2E2E] mb-1">KEY POINTS</p>
          <p>{content.highlighted_points}</p>
        </div>
      )}

      {table?.columns && table?.rows && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            {table.title || "Table"}
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-[#DDD5C2] text-sm bg-white">
              <thead>
                <tr className="bg-[#F2ECDD]">
                  {table.columns.map((c, i) => (
                    <th key={i} className="border border-[#DDD5C2] p-2 text-left">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-[#DDD5C2] p-2 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {flow?.steps && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            {flow.title || "Flowchart"}
          </h2>
          <div className="mb-6">
            {flow.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7A2E2E] text-white text-xs flex items-center justify-center">
                  {i + 1}
                </div>
                <p className="text-sm pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {content?.extra_points && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Extra Points to Remember
          </h2>
          <p className="text-[#5B6472] mb-6 whitespace-pre-line">
            {content.extra_points}
          </p>
        </>
      )}

      {cases && cases.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Case Studies
          </h2>
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#DDD5C2] rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold mb-2">{c.case_name}</h3>
              <p className="text-sm mb-1">
                <strong>Facts:</strong> {c.facts}
              </p>
              <p className="text-sm mb-1">
                <strong>Issues:</strong> {c.issues}
              </p>
              <p className="text-sm mb-1">
                <strong>Judgment:</strong> {c.judgment}
              </p>
              <p className="text-sm mb-1">
                <strong>Reasoning:</strong> {c.reasoning}
              </p>
              <p className="text-sm">
                <strong>Significance:</strong> {c.significance}
              </p>
            </div>
          ))}
        </>
      )}

      {matches && matches.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Match the Following
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-[#DDD5C2] text-sm bg-white">
              <thead>
                <tr className="bg-[#F2ECDD]">
                  <th className="border border-[#DDD5C2] p-2 text-left">
                    Column A
                  </th>
                  <th className="border border-[#DDD5C2] p-2 text-left">
                    Column B
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id}>
                    <td className="border border-[#DDD5C2] p-2">
                      {m.left_item}
                    </td>
                    <td className="border border-[#DDD5C2] p-2">
                      {m.right_item}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {flashcards && flashcards.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Flashcards
          </h2>
          {flashcards.map((f) => (
            <details
              key={f.id}
              className="bg-white border border-[#DDD5C2] rounded-lg p-4 mb-3 cursor-pointer"
            >
              <summary className="font-semibold">Q: {f.question}</summary>
              <p className="text-[#5B6472] mt-2">A: {f.answer}</p>
            </details>
          ))}
        </>
      )}

      {pyqs && pyqs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Previous Year Questions
          </h2>
          {pyqs.map((p) => (
            <details
              key={p.id}
              className="bg-white border border-[#DDD5C2] rounded-lg p-4 mb-3 cursor-pointer"
            >
              <summary className="font-semibold">{p.question}</summary>
              <p className="text-sm text-[#5B6472] mt-2 whitespace-pre-line">
                {p.answer}
              </p>
            </details>
          ))}
        </>
      )}

      {mcqs && mcqs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[#7A2E2E] mb-2">
            Objective Questions
          </h2>
          {mcqs.map((m) => (
            <details
              key={m.id}
              className="bg-white border border-[#DDD5C2] rounded-lg p-4 mb-3 cursor-pointer"
            >
              <summary className="font-semibold">{m.question}</summary>
              <div className="mt-2 text-sm space-y-1">
                <p>A. {m.option_a}</p>
                <p>B. {m.option_b}</p>
                <p>C. {m.option_c}</p>
                <p>D. {m.option_d}</p>
                <p className="text-[#3A6B3A] mt-1">
                  <strong>Answer:</strong> {m.correct_option}
                </p>
              </div>
            </details>
          ))}
        </>
      )}

      {content?.summary && (
        <div className="bg-white border-l-4 border-[#7A2E2E] rounded p-4 mt-6">
          <p className="text-xs font-mono text-[#B8945F] mb-1">SUMMARY</p>
          <p>{content.summary}</p>
        </div>
      )}
    </main>
  );
}