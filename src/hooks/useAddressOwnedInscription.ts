import { MOVESCRIPTIONS_ORIGINAL_PACKAGE_ID, NETWORK } from "@/constant/contract";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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
        StructType: `${MOVESCRIPTIONS_ORIGINAL_PACKAGE_ID}::movescription::Movescription`
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
  return result.filter(i => i.data.content.fields.tick === "MOVE").sort((a, b) => b.data.content.fields.amount - a.data.content.fields.amount)
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
        acc: string;
        amount: string;
        attach_coin: string;
        id: {
          id: string;
        };
        metadata: null;
        tick: string;
      };
    };
  }
}

export default function useAddressOwnedInscription(address?: string) {

  const { data: ownedObjects, isRefetching, isFetching, refetch } = useQuery({
    queryKey: [`${address}-OwnedInscription`],
    queryFn: async () => {
      return await getAddressFullOwnedObjects(address);
    },
    enabled: Boolean(address),
    staleTime: 30 * 1000
  });

  const tickCollection = useMemo(() => {
    const res: { [key: string]: InscriptionObject[] } = {};
    if (!ownedObjects) {
      return res
    }

    for (let index = 0; index < ownedObjects.length; index++) {
      const item = ownedObjects[index];
      if (!res[item.data.content.fields.tick]) {
        res[item.data.content.fields.tick] = [];
        res[item.data.content.fields.tick].push(item);
      } else {
        res[item.data.content.fields.tick].push(item);
      }
    }

    return res;
  }, [ownedObjects]);

  return {
    userInscription: !ownedObjects ? [] : ownedObjects as InscriptionObject[],
    tickCollection,
    isFetching,
    refetch
  }

}