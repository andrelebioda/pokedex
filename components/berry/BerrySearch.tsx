"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BerrySearchProps {
  search: string;
}

export default function BerrySearch({ search }: BerrySearchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    if (searchInput === search) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchInput) params.set("search", searchInput);

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, search, pathname, router]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="
            pointer-events-none
            absolute
            top-1/2
            left-4
            -translate-y-1/2
            text-slate-500
          "
          size={18}
        />

        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Beere suchen…"
          className="
            w-full
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            py-3
            pr-4
            pl-11
            text-white
            placeholder:text-slate-500
            focus:border-red-500
            focus:outline-none
          "
        />
      </div>

      {search.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setSearchInput("");
            router.push(pathname);
          }}
          className="
            flex
            items-center
            gap-1.5
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            px-4
            py-3
            text-sm
            text-slate-300
            transition
            hover:border-slate-700
            hover:text-white
          "
        >
          <X size={16} />
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}
