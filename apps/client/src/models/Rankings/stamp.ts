import { StampsQuery } from '@/features/database/repository';
import { useMessageStamps } from '@/hooks/useMessageStamps';

export const stampRankingQuery = {
  groupBy: 'stamp',
  orderBy: 'count',
  order: 'desc',
  limit: 10,
} satisfies StampsQuery;

export const useStampRankingData = (
  stamps: { stamp: string; count: number }[]
) => {
  const { stamps: messageStamps, getStamp } = useMessageStamps();

  if (stamps.length === 0 || messageStamps.length === 0) {
    const emptyArray = new Array(stampRankingQuery.limit);
    return emptyArray.map(() => ({ stamp: null, count: 0 }));
  }

  const sorted = stamps.toSorted((a, b) => b.count - a.count);
  const stats = sorted.map((stat) => ({
    stamp: getStamp(stat.stamp),
    count: stat.count,
  }));

  return stats;
};
