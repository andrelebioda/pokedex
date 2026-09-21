"use client";

import { Chart as ChartJS, Filler, LineElement, PointElement, RadialLinearScale, Tooltip } from "chart.js";
import { Radar } from "react-chartjs-2";

import { MappedPokemonStats } from "@/server/pokemon/pokemon.mapper";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface PokemonStatsRadarProps {
  stats: MappedPokemonStats;
  labels: Record<keyof MappedPokemonStats, string>;
  order: (keyof MappedPokemonStats)[];
  max?: number;
}

export default function PokemonStatsRadar({ stats, labels, order, max = 255 }: PokemonStatsRadarProps) {
  const data = {
    labels: order.map((key) => labels[key]),
    datasets: [
      {
        label: "Basiswerte",
        data: order.map((key) => stats[key]),
        backgroundColor: "rgba(239, 68, 68, 0.25)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "#0f172a",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="h-100 w-full">
      <Radar
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            r: {
              min: 0,
              suggestedMax: max,
              angleLines: { color: "rgba(148, 163, 184, 0.2)" },
              grid: { color: "rgba(148, 163, 184, 0.2)" },
              pointLabels: {
                color: "#cbd5e1",
                font: { size: 13, weight: 600 },
              },
              ticks: {
                display: false,
                backdropColor: "transparent",
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1e293b",
              titleColor: "#fff",
              bodyColor: "#e2e8f0",
              borderColor: "#334155",
              borderWidth: 1,
              padding: 10,
              displayColors: false,
            },
          },
        }}
      />
    </div>
  );
}
