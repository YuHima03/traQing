import { client } from '@/features/api';
import { MessagesQuery } from '@traq-ing/database';
import { useEffect, useState } from 'react';

type Result<Q extends MessagesQuery> = {
  [K in Q extends { groupBy: infer U }
    ? U extends undefined
      ? 'day'
      : U
    : 'day']: string;
} & { count: number };

export const useMessages = <Q extends MessagesQuery>(query: Q) => {
  const [messages, setMessages] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      const res = await client.messages.$get({
        query: {
          ...query,
          limit: query.limit?.toString(),
          offset: query.offset?.toString(),
        },
      });
      const data = (await res.json()) as Result<Q>[];
      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [query, setMessages, setLoading]);

  return { messages, loading };
};
