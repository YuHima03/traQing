import { useMessages } from '@/hooks/useMessages';
import { dailyTimeRangeToTime, nextDay } from '@/hooks/useTimeRange';
import { FC, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { channelRankingQuery, useChannelRankingData } from './channel';
import {
  DailyRankingProps,
  commonChartOptions,
} from '@/models/Rankings/common';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const DailyChannelRanking: FC<DailyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...channelRankingQuery,
      after: dailyTimeRangeToTime(range),
      before: dailyTimeRangeToTime(nextDay(range)),
    }),
    [range]
  );
  const { messages, loading } = useMessages(query);

  const data = useChannelRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar
        options={commonChartOptions}
        data={data}
        height={300}
        className={clsx(loading && 'opacity-70')}
      />
    </div>
  );
};
