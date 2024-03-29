import {
  DEPLOY_RECORD,
  PROFIT_RATIO,
  PROTOCOL_BANK,
  TOPIC_REDIRECT,
  UPGRADE_BANK,
  VOTING_PACKAGE_ID,
} from "@/constant/contract";
import useAddressOwnedInscription from "@/hooks/useAddressOwnedInscription";
import useHandBook from "@/hooks/useHandBook";
import usePredictionEvent from "@/hooks/usePredictionEvent";
import useVotingSettleCap from "@/hooks/useVotingSettleCap";
import { shortAddress } from "@/utils";
import { splitInscriptionTxb } from "@/utils/splitInscriptionTxb";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function Detail() {
  let params = useParams();

  const id = params.id;

  const { predictionList, refetchPredictionList } = usePredictionEvent();

  const info = useMemo(() => {
    return predictionList?.[0]?.data.content.fields;
  }, [predictionList]);

  const { votingSettleCap } = useVotingSettleCap();

  const { handBook, isHandBookFetched } = useHandBook();

  const curVotingSettleCap = useMemo(() => {
    return votingSettleCap?.find(
      (i) =>
        i.data?.content?.dataType === "moveObject" &&
        (i.data?.content?.fields as any).to === id
    )?.data?.objectId;
  }, [votingSettleCap, predictionList]);

  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransactionBlock, isPending } =
    useSignAndExecuteTransactionBlock();

  const isAdmin = useMemo(() => {
    return !!curVotingSettleCap;
  }, [curVotingSettleCap]);

  const [voteInputAmount, setVoteInputAmount] = useState("");

  const {
    userInscription,
    tickCollection,
    isFetching: isLoadingUserInscription,
    refetch: refetchInscriptionBalance,
  } = useAddressOwnedInscription(account?.address);

  const vote = async (type: "a" | "b") => {
    if (!account?.address || !handBook?.objectId) {
      return;
    }
    const functionName = type === "a" ? "vote_a" : "vote_b";
    const { txb, splitInscription, returnObject } = splitInscriptionTxb(
      Number(voteInputAmount),
      tickCollection["MOVE"]
    );

    txb.moveCall({
      target: `${VOTING_PACKAGE_ID}::voting::${functionName}`,
      arguments: [
        txb.object(predictionList?.[0]?.data.objectId),
        txb.object(handBook.objectId),
        txb.object(splitInscription),
        txb.object("0x6"),
      ],
    });

    if (returnObject) {
      txb.transferObjects([returnObject], account.address);
    }

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        options: {
          showObjectChanges: true,
        },
      },
      {
        async onSuccess(data) {
          refetchPredictionList();
          enqueueSnackbar("Vote Success!", {
            variant: "success",
          });
        },
        onError(error) {},
      }
    );
  };

  const claim = async (type: "a" | "b") => {
    if (!account?.address || !handBook?.objectId || !id) {
      return;
    }
    const functionName = type === "a" ? "claim_reward_a" : "claim_reward_b";
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${VOTING_PACKAGE_ID}::voting::${functionName}`,
      arguments: [
        txb.object(id),
        txb.object(handBook.objectId),
        txb.object("0x6"),
      ],
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
          refetchPredictionList();
          enqueueSnackbar("Claim Success!", {
            variant: "success",
          });
        },
        onError(error) {},
      }
    );
  };

  const setWinner = async (type: "a" | "b" | "uncertain") => {
    // settle_a_as_winner

    if (!account?.address || !handBook?.objectId || !id) {
      return;
    }
    const functionName =
      type === "uncertain"
        ? "set_uncertain_cap"
        : type === "a"
          ? "settle_a_as_winner"
          : "settle_b_as_winner";
    const txb = new TransactionBlock();
    if (functionName === "set_uncertain_cap") {
      txb.moveCall({
        target: `${VOTING_PACKAGE_ID}::voting::${functionName}`,
        arguments: [
          txb.object(curVotingSettleCap),
          txb.object(DEPLOY_RECORD),
          txb.object(id),
          txb.object(handBook.objectId),
          txb.object(TOPIC_REDIRECT),
          txb.object("0x6"),
        ],
      });
    } else {
      txb.moveCall({
        target: `${VOTING_PACKAGE_ID}::voting::${functionName}`,
        arguments: [
          txb.object(curVotingSettleCap),
          txb.object(DEPLOY_RECORD),
          txb.object(id),
          txb.object(handBook.objectId),
          txb.object(TOPIC_REDIRECT),
          txb.object(PROTOCOL_BANK),
          txb.object(UPGRADE_BANK),
          txb.object(PROFIT_RATIO),
          txb.object("0x6"),
        ],
      });
    }

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        options: {
          showObjectChanges: true,
        },
      },
      {
        async onSuccess(data) {
          refetchPredictionList();
          enqueueSnackbar("Set Success!", {
            variant: "success",
          });
        },
        onError(error) {},
      }
    );
  };

  if (!info) {
    return null;
  }

  return (
    <Card
      className="p-12 pb-6 relative w-full"
      sx={{
        maxWidth: "600px",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        className="text-sm font-semibold absolute top-0 left-0 p-2 text-gray-300 w-full"
      >
        <Stack>Prediction</Stack>
        <Stack>{shortAddress(predictionList[0].data.objectId)}</Stack>
      </Stack>
      <Stack spacing={2} className="mt-2">
        <Typography className="text-xl font-semibold">
          {info.description}
        </Typography>
        <Stack className="text-gray-400">
          <Typography>End Time:</Typography>
          <Typography>
            {dayjs(Number(info.deadline)).format("YYYY-MM-DD HH:mm:ss UTC Z")}
          </Typography>
        </Stack>
        <Stack>
          <Typography className="text-left text-gray-400">Topics</Typography>
          <Stack direction="row" className="mt-2" spacing={2}>
            {info.topics.map((i: any) => (
              <Chip size="small" variant="outlined" color="success" label={i} />
            ))}
          </Stack>
        </Stack>
        <Stack className="text-gray-400">
          <Typography>Acceptable Vote Tick:</Typography>
          <Typography className="font-semibold text-gray-700">
            {String.fromCharCode(...info.option_a)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Typography>
              Option A: <span className="font-bold">{info.description_a}</span>
            </Typography>
            <Typography className="text-gray-400">
              {info.a_sum} $
              {info.option_a && String.fromCharCode(...info.option_a)}
            </Typography>
          </Stack>
          <Stack>
            <Typography>
              Option B: <span className="font-bold">{info.description_b}</span>
            </Typography>
            <Typography className="text-gray-400">
              {info.b_sum} $
              {info.option_a && String.fromCharCode(...info.option_b)}
            </Typography>
          </Stack>
        </Stack>
        <Divider></Divider>
        <Stack spacing={2} alignItems="flex-start">
          <Typography className="font-semibold">Vote</Typography>
          <TextField
            placeholder="Vote Amount"
            fullWidth
            value={voteInputAmount}
            onChange={(e) => {
              setVoteInputAmount(e.target.value);
            }}
          ></TextField>
        </Stack>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            variant="contained"
            color="info"
            fullWidth
            onClick={() => {
              vote("a");
            }}
          >
            {info.description_a}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="info"
            fullWidth
            onClick={() => {
              vote("b");
            }}
          >
            {info.description_b}
          </LoadingButton>
        </Stack>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            variant="contained"
            color="success"
            fullWidth
            onClick={() => {
              claim("a");
            }}
          >
            Claim Option A Reward
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="success"
            fullWidth
            onClick={() => {
              claim("b");
            }}
          >
            Claim Option B Reward
          </LoadingButton>
        </Stack>
        {isAdmin && (
          <>
            <Divider />
            <Stack spacing={2}>
              <Typography className="font-semibold text-left">
                Admin Operation
              </Typography>
              <Stack direction="row" spacing={2}>
                <LoadingButton
                  variant="contained"
                  color="warning"
                  fullWidth
                  onClick={() => {
                    setWinner("a");
                  }}
                >
                  Set Option A as Winner
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="warning"
                  fullWidth
                  onClick={() => {
                    setWinner("b");
                  }}
                >
                  Set Option B as Winner
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="warning"
                  fullWidth
                  onClick={() => {
                    setWinner("uncertain");
                  }}
                >
                  Set Uncertain
                </LoadingButton>
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}
