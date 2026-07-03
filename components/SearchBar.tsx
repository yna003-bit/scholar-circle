"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search } from "lucide-react";

type PersonResult = { id: string; display_name: string; username: string | null };
type PostResult = { id: string; title: string; sponsor_name: string };

function safe(term: string) {
  return term.replace(/[,()%_]/g, "").trim();
}

export function SearchBar() {
  const supabase = createClient();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<PersonResult[]>([]);
  const [posts, setPosts] = useState<PostResult[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const term = safe(query);
    if (!term) {
      setPeople([]);
      setPosts([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      const pattern = `%${term}%`;

      const [peopleRes, postsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, display_name, username")
          .or(`display_name.ilike.${pattern},username.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("opportunities")
          .select("id, title, sponsor_name")
          .or(`title.ilike.${pattern},description.ilike.${pattern},sponsor_name.ilike.${pattern}`)
          .limit(5),
      ]);

      setPeople(peopleRes.data ?? []);
      setPosts(postsRes.data ?? []);
      setOpen(true);
    }, 300);
  }, [query, supabase]);

  function goToPerson(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/messages/${id}`);
  }

  function goToPost(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/feed#${id}`);
  }

  const hasResults = people.length > 0 || posts.length > 0;

  return (
    <div className="relative flex-1">
      <div className="flex items-center gap-1.5 rounded-lg border border-black/15 px-2 py-1.5">
        <Search size={14} className="shrink-0 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search posts or people"
          className="w-full border-none bg-transparent p-0 text-sm outline-none"
        />
      </div>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-72 overflow-y-auto rounded-lg border border-black/10 bg-white shadow-sm">
          {!hasResults ? (
            <p className="p-3 text-xs text-ink/50">No results.</p>
          ) : (
            <>
              {people.length > 0 ? (
                <div>
                  <p className="px-3 pt-2 text-[11px] font-medium uppercase text-ink/40">People</p>
                  {people.map((p) => (
                    <button
                      key={p.id}
                      onMouseDown={() => goToPerson(p.id)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-black/5"
                    >
                      {p.display_name}
                      {p.username ? <span className="ml-1 text-xs text-ink/40">@{p.username}</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
              {posts.length > 0 ? (
                <div>
                  <p className="px-3 pt-2 text-[11px] font-medium uppercase text-ink/40">Scholarships</p>
                  {posts.map((o) => (
                    <button
                      key={o.id}
                      onMouseDown={() => goToPost(o.id)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-black/5"
                    >
                      {o.title}
                      <span className="ml-1 text-xs text-ink/40">{o.sponsor_name}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}