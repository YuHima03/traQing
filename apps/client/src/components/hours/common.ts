import { mergeOptions, getCommonLineChartOptions } from '@/lib/commonChartOptions';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Tooltip, PointElement);

export const hours = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));

export const commonHoursChartOption = mergeOptions(getCommonLineChartOptions(false), {
  indexAxis: 'x' as const,
  plugins: {
    tooltip: {
      enabled: true,
      axis: 'y',
      displayColors: false,
    },
  },
}) satisfies ChartOptions;

export const commonHoursQuery = {
  groupBy: 'hour',
} satisfies MessagesQuery & StampsQuery;

const diff = new Date().getTimezoneOffset() / 60;
export const getHourDataset = (data: { hour: string; count: number }[]) =>
  hours.map(
    (h) => data.find((s) => Number.parseInt(s.hour) === ((Number.parseInt(h) + diff + 23) % 24) + 1)?.count ?? 0,
  );
