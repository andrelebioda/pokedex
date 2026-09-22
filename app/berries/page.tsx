import type { Metadata } from "next";

import BerryCard from "@/components/berry/BerryCard";
import BerrySearch from "@/components/berry/BerrySearch";
import StickyBar from "@/components/layout/StickyBar";
import { getAllBerries } from "@/server/berry/berry.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beeren",
  description: "Alle Beeren mit ihren Beerenkräften, Wachstumszeit und weiteren Eigenschaften.",
};

interface BerriesPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function BerriesPage({ searchParams }: BerriesPageProps) {
  const { search = "" } = await searchParams;

  const berries = await getAllBerries({ search });

  return (
    <div>
      <StickyBar className="-mt-8 mb-8">
        <BerrySearch search={search} />
      </StickyBar>

      <section>
        {berries.length === 0 ? (
          <p className="text-center text-slate-500">Keine Beeren gefunden.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {berries.map((berry) => (
              <BerryCard key={berry.id} berry={berry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
