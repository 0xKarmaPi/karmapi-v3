import { VOTING_PACKAGE_ID } from "@/constant/contract";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export default function useVotingSettleCap() {
  const account = useCurrentAccount();

  const { data: votingSettleCap, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: {
        StructType: `${VOTING_PACKAGE_ID}::voting::VotingSettleCap`,
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!account?.address,
    }
  );

  return {
    votingSettleCap: votingSettleCap?.data as any[],
    refetchVotingSettleCap: refetch,
  };
}
