import usePredictionEvent from "@/hooks/usePredictionEvent";
import useTopicRecord from "@/hooks/useTopicRecord";
import { shortAddress } from "@/utils";
import {
  Button,
  Card,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Prediction() {
  const { predictionList } = usePredictionEvent();

  const { topics } = useTopicRecord();

  const [selectedTopic, setSelectedTopic] = useState("all");

  const renderList = useMemo(() => {
    if (selectedTopic === "all") {
      return predictionList;
    }
    return predictionList.filter((i) =>
      (i.data.content.fields.topics as any[]).includes(selectedTopic)
    );
  }, [predictionList, selectedTopic]);

  return (
    <>
      <Stack className="w-full" alignItems="flex-start" spacing={1}>
        <Typography className="font-semibold text-xl">Topics</Typography>
        <RadioGroup
          row
          value={selectedTopic}
          onChange={(e, value) => {
            setSelectedTopic(value);
          }}
        >
          <FormControlLabel value={"all"} control={<Radio />} label={"All"} />
          {topics?.map((i) => (
            <FormControlLabel
              value={i.topicName}
              control={<Radio />}
              label={i.topicName}
            />
          ))}
        </RadioGroup>
      </Stack>
      <Stack className="w-full mt-8 grid grid-cols-3 justify-start items-start gap-5">
        {renderList?.map((i) => {
          const info = i.data.content.fields;
          return (
            <Card className="p-12 pb-6 relative">
              <Stack
                direction="row"
                justifyContent="space-between"
                className="text-sm font-semibold absolute top-0 left-0 p-2 text-gray-300 w-full"
              >
                <Stack>Prediction</Stack>
                <Stack>{shortAddress(i.data.objectId)}</Stack>
              </Stack>
              <Stack spacing={2} className="mt-2">
                <Typography className="text-xl font-semibold">
                  {info.description}
                </Typography>
                <Stack className="text-gray-400">
                  <Typography>End Time:</Typography>
                  <Typography>
                    {dayjs(Number(info.deadline)).format(
                      "YYYY-MM-DD HH:mm:ss UTC Z"
                    )}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography className="text-left text-gray-400">
                    Topics
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    className="mt-2"
                  >
                    {info.topics.map((i: any) => (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="success"
                        label={i}
                      />
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
                      Option A:{" "}
                      <span className="font-bold">{info.description_a}</span>
                    </Typography>
                    <Typography className="text-gray-400">
                      {info.a_sum} $
                      {info.option_a && String.fromCharCode(...info.option_a)}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography>
                      Option B:{" "}
                      <span className="font-bold">{info.description_b}</span>
                    </Typography>
                    <Typography className="text-gray-400">
                      {info.b_sum} $
                      {info.option_a && String.fromCharCode(...info.option_b)}
                    </Typography>
                  </Stack>
                </Stack>
                <Link to={`/detail/${i.data.objectId}`}>
                  <Button variant="outlined">Detail</Button>
                </Link>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
