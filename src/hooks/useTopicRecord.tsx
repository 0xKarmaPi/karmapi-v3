import { OPEN_RECORD_TABLE, TOPIC_RECORD } from "@/constant/contract";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";

export default function useTopicRecord() {
  const { data: topicRecord } = useSuiClientQuery("getDynamicFields", {
    parentId: TOPIC_RECORD,
  });

  const topicList = useMemo(() => {
    return topicRecord?.data.map((i) => {
      return {
        topic: i.name.value,
        topicRecordId: i.objectId,
      };
    });
  }, [topicRecord]);

  const { data, refetch } = useSuiClientQuery("multiGetObjects", {
    ids: topicList?.map((i) => i.topicRecordId as string) || [],
    options: {
      showContent: true,
    },
  });

  const topics = useMemo(() => {
    return data?.map((i) => {
      return {
        // @ts-ignore
        topicName: i.data?.content.fields.name,
        // @ts-ignore
        topicRecord: i.data?.content.fields.id.id,
      };
    });
  }, [data]);

  return {
    predictionList: data as any[],
    topics,
    refetchPredictionList: refetch,
  };
}
