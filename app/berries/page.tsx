import type { Metadata } from "next";

import BerryCard from "@/components/berry/BerryCard";
import BerryFilters from "@/components/berry/BerryFilters";
import StickyBar from "@/components/layout/StickyBar";
import { getAllBerries, BerrySort } from "@/server/berry/berry.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beeren",
  description: "Alle Beeren mit ihren Beerenkräften, Wachstumszeit und weiteren Eigenschaften.",
};

const VALID_SORTS: BerrySort[] = ["name", "growth"];

interface BerriesPageProps {
  searchParams: Promise<{ search?: string; types?: string; sort?: string }>;
}

export default async function BerriesPage({ searchParams }: BerriesPageProps) {
  const { search = "", types: typesParam = "", sort: sortParam } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const sort = VALID_SORTS.includes(sortParam as BerrySort) ? (sortParam as BerrySort) : "name";

  const [berries, types] = await Promise.all([getAllBerries({ search, types: selectedTypes, sort }), getAllTypes()]);

  return (
    <div>
      <StickyBar>
        <BerryFilters types={types} search={search} selectedTypes={selectedTypes} sort={sort} />
      </StickyBar>

      <section>
        {berries.length === 0 ? (
          <p className="text-center text-slate-500">Keine Beeren gefunden.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 py-6">
            {berries.map((berry) => (
              <BerryCard key={berry.id} berry={berry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
