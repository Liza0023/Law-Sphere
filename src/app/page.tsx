import Link from "next/link";
import { createClient } from "./utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, title, chapter_number, subjects(id, name, semester)")
    .order("id");

  const grouped: Record<
    number,
    Record<string, { id: number; title: string; chapter_number: number }[]>
  > = {};

  chapters?.forEach((ch) => {
    const subject = Array.isArray(ch.subjects) ? ch.subjects[0] : ch.subjects;
    if (!subject) return;
    const sem = subject.semester;
    const subName = subject.name;
    if (!grouped[sem]) grouped[sem] = {};
    if (!grouped[sem][subName]) grouped[sem][subName] = [];
    grouped[sem][subName].push({
      id: ch.id,
      title: ch.title,
      chapter_number: ch.chapter_number,
    });
  });

  const semesters = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2332]">
      <header className="border-b border-[#DDD5C2] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#7A2E2E]">Law Sphere</h1>
        <span className="text-sm text-[#5B6472]">Welcome back 👋</span>
      </header>

      <section className="p-6 max-w-4xl mx-auto">
        {semesters.length === 0 && (
          <p className="text-[#5B6472]">No content loaded yet.</p>
        )}

        {semesters.map((sem) => (
          <div key={sem} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#7A2E2E]">
              Semester {sem}
            </h2>

            {Object.entries(grouped[sem]).map(([subjectName, chaps]) => (
              <div key={subjectName} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{subjectName}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {chaps
                    .sort((a, b) => a.chapter_number - b.chapter_number)
                    .map((ch) => (
                      <Link key={ch.id} href={`/topic/${ch.id}`}>
                        <div className="bg-white border border-[#DDD5C2] rounded-lg p-4 hover:border-[#7A2E2E] transition-colors cursor-pointer h-full">
                          <p className="text-xs text-[#B8945F] font-mono mb-1">
                            Chapter {ch.chapter_number}
                          </p>
                          <h4 className="font-semibold">{ch.title}</h4>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}