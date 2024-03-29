import { MOVESCRIPTIONS_PACKAGE_ID } from "@/constant/contract";
import { InscriptionObject } from "@/hooks/useAddressOwnedInscription";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import BigNumber from "bignumber.js";

export function splitInscriptionTxb(
  targetAmount: number,
  userOwnedTickInscription: InscriptionObject[],
) {
  const txb = new TransactionBlock();
  const sortedData = userOwnedTickInscription.sort(
    (a, b) => Number(b.data.content.fields.amount) - Number(a.data.content.fields.amount)
  );
  const firstItem = sortedData[0];
  const opSortedData = sortedData.length === 1 ? [sortedData[0]] : sortedData.slice(1);
  let currentTotal = new BigNumber(firstItem.data.content.fields.amount);
  let inputInscription:
    | {
      index: number;
      resultIndex: number;
      kind: 'NestedResult';
    }
    | undefined = undefined;
  for (const inscription of opSortedData) {
    const inscriptionData = inscription.data.content.fields;
    if (new BigNumber(currentTotal).isLessThanOrEqualTo(targetAmount)) {
      txb.moveCall({
        target: `${MOVESCRIPTIONS_PACKAGE_ID}::movescription::merge`,
        arguments: [txb.object(firstItem.data.objectId), txb.object(inscription.data.objectId)],
      });
      currentTotal = currentTotal.plus(inscriptionData.amount);

      if (currentTotal.isEqualTo(targetAmount)) {
        break;
      }
    } else {
      const remainingAmt = new BigNumber(targetAmount).minus(currentTotal);
      if (remainingAmt.isLessThan(0)) {
        const [final] = txb.moveCall({
          target: `${MOVESCRIPTIONS_PACKAGE_ID}::movescription::do_split`,
          arguments: [txb.object(firstItem.data.objectId), txb.pure(targetAmount)],
        });
        inputInscription = final;
        break;
      }
    }
  }

  return { txb, splitInscription: inputInscription || firstItem.data.objectId, returnObject: inputInscription ? firstItem.data.objectId : undefined };
}