import { VOTING_PACKAGE_ID } from "@/constant/contract";
import useHandBook from "@/hooks/useHandBook";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  styled,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useState } from "react";

export default function RegisterModal() {
  const [value, setValue] = useState<string>("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const { handBook, refetchHandBook, isHandBookFetched } = useHandBook();

  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransactionBlock, isPending } =
    useSignAndExecuteTransactionBlock();

  const mint = async () => {
    if (!account?.address) {
      return;
    }

    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${VOTING_PACKAGE_ID}::handbook::mint`,
      arguments: [],
    });

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        options: {
          showObjectChanges: true,
        },
      },
      {
        async onSuccess(data) {
          refetchHandBook();
        },
        onError(error) {},
      }
    );
  };

  return (
    <Card
      className="w-108 xl:w-108 p-9 shadow-lg"
      sx={{
        borderRadius: "0.5rem",
      }}
    >
      <CardHeader
        className="p-0 text-left"
        title={
          <Stack>
            <Typography className=" font-bold text-2xl">
              Welcome to KarmaPi
            </Typography>
            <Typography className="text-sm font-normal mt-2">
              Please mint a Handbook to begin your journey with Karmapi.
            </Typography>
          </Stack>
        }
      />
      <CardContent className="p-0 mt-9">
        <Stack spacing={6}>
          <LoadingButton
            variant="contained"
            size="large"
            color="secondary"
            loading={isPending}
            onClick={() => {
              mint();
            }}
          >
            Mint
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
