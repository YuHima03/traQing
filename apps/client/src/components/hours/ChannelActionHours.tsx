import { commonHoursChartOption, commonHoursQuery, hours } from '@/components/hours/common';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const option = {
  ...commonHoursChartOption,
} satisfies ChartOptions;

type Props = {
  channelId: string;
};

export const ChannelActionHours: FC<Props> = ({ channelId }) => {
  const messagesQuery = useMemo(() => ({ ...commonHoursQuery, channelId }) satisfies MessagesQuery, [channelId]);
  const stampsQuery = useMemo(() => ({ ...commonHoursQuery, channelId }) satisfies StampsQuery, [channelId]);
  const { messages } = useMessages(messagesQuery);
  const { stamps } = useStamps(stampsQuery);

  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        data: hours.map((h) => messages.find((m) => m.hour === h)?.count ?? 0),
        label: '投稿数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
      {
        data: hours.map((h) => stamps.find((s) => s.hour === h)?.count ?? 0),
        label: 'スタンプ数',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};