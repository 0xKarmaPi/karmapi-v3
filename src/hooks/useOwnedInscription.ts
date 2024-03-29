import { KARTSCRIPTION_PACKAGE_ID, KARTSCRIPTION_PACKAGE_ID_ORIGINAL, MOVESCRIPTIONS_ORIGINAL_PACKAGE_ID, NETWORK } from "@/constant/contract";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { useQuery } from "@tanstack/react-query";

const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

export async function getAddressFullOwnedObjects(address?: string) {
  if (!address) { return [] }
  let result: any[] = []
  let cursor = null
  // let count = 0
  while (true) {
    const data = await client.getOwnedObjects({
      owner: address,
      cursor: cursor,
      filter: {
        StructType: `${KARTSCRIPTION_PACKAGE_ID_ORIGINAL}::kartscription::KartScription`
      },
      options: {
        showContent: true,
      },
    })
    cursor = data.nextCursor ?? null
    // @ts-ignore
    result = result.concat(data.data)
    if (!data.hasNextPage) {
      break
    }
    // count++
  }
  return result.sort((a, b) => b.data.content.fields.amount - a.data.content.fields.amount)
}

export interface InscriptionObject {
  data: {
    objectId: string;
    version: string;
    digest: string;
    content: {
      dataType: string;
      type: string;
      hasPublicTransfer: boolean;
      fields: {
        amount: string;
        kart_balance: string;
        id: {
          id: string;
        };
        sui_balance: string;
      };
    };
  }
}

export default function useOwnedInscription(address?: string) {

  const { data: ownedObjects, isRefetching, isFetching, refetch } = useQuery({
    queryKey: [`${address}-OwnedInscription-kart1`],
    queryFn: async () => {
      return await getAddressFullOwnedObjects(address);
    },
    enabled: Boolean(address),
    staleTime: 30 * 1000
  });
  return {
    kartInscription: !ownedObjects ? [] : ownedObjects as InscriptionObject[],
    isFetching,
    refetch
  }

}