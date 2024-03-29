import { ORIGINAL_PACKAGE_ID } from "@/constant/contract";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export default function useHandBook() {
  const account = useCurrentAccount();

  const {
    data: handBook,
    refetch,
    isFetched,
  } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: {
        StructType: `${ORIGINAL_PACKAGE_ID}::handbook::HandBook`,
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
    handBook: handBook?.data[0]?.data?.objectId
      ? {
          objectId: handBook?.data[0]?.data?.objectId,
        }
      : undefined,
    refetchHandBook: refetch,
    isHandBookFetched: isFetched,
  };
}
