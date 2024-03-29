import {
  Autocomplete,
  Card,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  DEPLOY_RECORD,
  KART_COIN_TYPE,
  STAKE_POOL,
  TOPIC_REDIRECT,
  VOTING_PACKAGE_ID,
} from "@/constant/contract";
import useHandBook from "@/hooks/useHandBook";
import useOwnedInscription from "@/hooks/useOwnedInscription";
import usePredictionEvent from "@/hooks/usePredictionEvent";

export default function Deploy() {
  const [startDate, setStartDate] = useState(dayjs().add(1, "day"));

  const [topics, setTopics] = useState<string[]>([]);
  const account = useCurrentAccount();

  const { kartInscription } = useOwnedInscription(account?.address);

  const { handBook, isHandBookFetched } = useHandBook();

  const { data: OwnedsKART } = useSuiClientQuery(
    "getCoins",
    {
      owner: account?.address || "",
      coinType: KART_COIN_TYPE,
    },
    {
      enabled: !!account?.address,
    }
  );

  const { mutate: signAndExecuteTransactionBlock, isPending } =
    useSignAndExecuteTransactionBlock();

  const [description, setDescription] = useState("");
  const [acceptableTick, setAcceptableTick] = useState("");
  const [optionADescription, setOptionADescription] = useState("");
  const [optionBDescription, setOptionBDescription] = useState("");

  return (
    <Card className="p-8">
      <Stack alignItems="flex-start" spacing={4}>
        <Typography className="text-xl font-semibold">
          Deploy Prediction Event
        </Typography>
        <Stack spacing={1}>
          <Typography className="text-base font-semibold">
            Please enter a description of the prediction question
          </Typography>
          <TextField
            label="Description"
            variant="outlined"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Stack>
        <Stack spacing={1} className="w-full" alignItems="flex-start">
          <Typography className="text-base font-semibold">
            Prediction Topics
          </Typography>
          <Autocomplete
            multiple
            className="w-full"
            options={[]}
            value={topics}
            freeSolo
            color="primary"
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Topic"
                placeholder="Topic"
              />
            )}
            onChange={(e, value) => {
              if (value.some((i) => i.length < 3)) {
                enqueueSnackbar("Topic content length should greater 3", {
                  variant: "error",
                });
                return;
              }
              setTopics(value);
            }}
          />
        </Stack>
        <Stack alignItems="flex-start" spacing={2} className="w-full">
          <Typography className="text-base font-semibold">
            Options Description
          </Typography>
          <TextField
            label="Acceptable Vote Tick"
            className="w-full"
            variant="outlined"
            onChange={(e) => {
              setAcceptableTick(e.target.value);
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="w-full"
            spacing={2}
          >
            <TextField
              className="w-1/2"
              label="Option A Description"
              variant="outlined"
              onChange={(e) => {
                setOptionADescription(e.target.value);
              }}
            />
            <TextField
              className="w-1/2"
              label="Option B Description"
              variant="outlined"
              onChange={(e) => {
                setOptionBDescription(e.target.value);
              }}
            />
          </Stack>
        </Stack>
        <Stack alignItems="flex-start" spacing={1} className="w-full">
          <Typography className="text-base font-semibold">End Time</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="w-full"
              views={["year", "month", "day", "hours", "minutes", "seconds"]}
              minTime={dayjs().add(1, "hour")}
              timeSteps={{
                hours: 1,
                minutes: 1,
                seconds: 1,
              }}
              sx={
                {
                  // borderRadius: "16px",
                  // background: "rgb(39, 39, 42)",
                  // "& input, & svg": {
                  //   color: "rgb(236, 237, 238) !important",
                  // },
                  // "& fieldset": {
                  //   border: "none",
                  // },
                }
              }
              minutesStep={1}
              value={startDate}
              onChange={(e) => {
                setStartDate(e || dayjs().add(1, "hour"));
              }}
            />
          </LocalizationProvider>
        </Stack>
        <Stack className="w-full">
          <LoadingButton
            fullWidth
            color="primary"
            variant="contained"
            onClick={() => {
              if (!handBook?.objectId || !kartInscription) {
                return;
              }
              // if (optionA.length < 4 || optionB.length < 4) {
              //   enqueueSnackbar(
              //     "Acceptable Vote Tick length must be greater than 4",
              //     { variant: "error" }
              //   );
              //   return;
              // }
              // purchaseIDO();
              const txb = new TransactionBlock();

              txb.moveCall({
                target: `${VOTING_PACKAGE_ID}::voting::${"deploy_w_ks"}`,
                arguments: [
                  txb.object(kartInscription[0].data.objectId),
                  txb.object(STAKE_POOL),
                  txb.object(DEPLOY_RECORD),
                  txb.object(handBook?.objectId),
                  txb.object(TOPIC_REDIRECT),
                  txb.pure(["SUI", "MOVE", "KARMAPI"], "vector<string>"),
                  txb.pure(description),
                  txb.pure(acceptableTick),
                  txb.pure(acceptableTick),
                  txb.pure(optionADescription),
                  txb.pure(optionBDescription),
                  txb.pure(dayjs(startDate).valueOf()),
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
                    enqueueSnackbar("Deploy Success!", {
                      variant: "success",
                    });
                  },
                  onError(error) {},
                }
              );
            }}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );
}
