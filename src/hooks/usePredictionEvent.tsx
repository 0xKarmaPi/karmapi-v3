import { OPEN_RECORD_TABLE } from "@/constant/contract";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function usePredictionEvent() {
  const { data: predictionList } = useSuiClientQuery("getDynamicFields", {
    parentId: OPEN_RECORD_TABLE,
  });

  const { data, refetch } = useSuiClientQuery("multiGetObjects", {
    ids: predictionList?.data.map((i) => i.name.value as string) || [],
    options: {
      showContent: true,
    },
  });

  return {
    predictionList: data as any[],
    refetchPredictionList: refetch,
  };
}
