import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Sheets } from "@/types/sheets";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/lib/icons";

interface ZoomState {
  left: string | number;
  right: string | number;
  refAreaLeft: any;
  refAreaRight?: any;
  top: string | number;
  bottom: string | number;
  animation: boolean;
  isZoomed: boolean;
}

interface ChartOneProps {
  data: Array<Sheets>;
  to?: Date;
  from?: Date;
  handleCategory: (e: any) => void;
  category: string;
}

const initialZoomState: ZoomState = {
  left: "dataMin-86400000",
  right: "dataMax+86400000",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+200",
  bottom: "dataMin-200",
  animation: true,
  isZoomed: false,
};

export function ChartTwo({ category, data, from, to }: ChartOneProps) {
  const [chartData, setData] = useState<Array<{ day: number; value: number; [x: string]: number }>>([]);

  const [zoomState, setZoomState] = useState<ZoomState>(initialZoomState);

  const zoomOut = () => {
    setData(chartData.slice());
    setZoomState(initialZoomState);
  };

  const getAxisYDomain = (from: number | string, to: number | string, ref: string, offset: number): Array<number> => {
    const fromIndex = chartData.findIndex((d) => d.day === from);
    const toIndex = chartData.findIndex((d) => d.day === to);

    if (chartData.length > 0) {
      const refData = chartData?.slice(fromIndex, toIndex);

      let [bottom, top] = [refData[0]?.[ref] ?? 0, refData[0]?.[ref] ?? 0];

      refData.forEach((d) => {
        if (d[ref] > top) top = d[ref];
        if (d[ref] < bottom) bottom = d[ref];
      });

      return [(bottom | 0) - offset, (top | 0) + offset];
    }

    return [0, 0];
  };

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = zoomState;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setZoomState({
        ...zoomState,
        refAreaLeft: "",
        refAreaRight: "",
      });

      return;
    }

    let [refAreaLeftTemp, refAreaRightTemp] = [refAreaLeft, refAreaRight];

    // xAxis domain
    if (refAreaRight && refAreaLeft > refAreaRight) {
      [refAreaLeftTemp, refAreaRightTemp] = [refAreaRight, refAreaLeft];
    }

    if (refAreaRight) {
      // yAxis domain
      const [bottom, top] = getAxisYDomain(refAreaLeftTemp, refAreaRightTemp, "value", 200);

      setData(chartData.slice());
      setZoomState({
        ...zoomState,
        refAreaLeft: "",
        refAreaRight: "",
        left: refAreaLeftTemp,
        right: refAreaRightTemp,
        bottom,
        top,
        isZoomed: true,
      });
    }
  };

  useEffect(() => {
    const result: Array<{ day: number; value: number }> = Object.values(
      data.reduce((acc: { [key: string]: { day: number; value: number } }, item) => {
        const { day, [category]: value } = item;

        if (!acc[day]) {
          acc[day] = { day, value: 0 };
        }
        acc[day].value += value;

        return acc;
      }, {})
    );

    zoomOut();
    setData(result);
  }, [category]);

  const panLeft = () => {
    setData(chartData.slice());
    setZoomState((prev) => {
      if (typeof prev.right === "number" && typeof prev.left === "number") {
        const [bottom, top] = getAxisYDomain(prev.left, prev.right, "value", 200);

        return { ...prev, left: prev.left - 86400000, right: prev.right - 86400000, bottom, top };
      }

      return prev;
    });
  };
  const panRight = () => {
    setData(chartData.slice());
    setZoomState((prev) => {
      if (typeof prev.right === "number" && typeof prev.left === "number") {
        const [bottom, top] = getAxisYDomain(prev.left, prev.right, "value", 200);
        return { ...prev, left: prev.left + 86400000, right: prev.right + 86400000, bottom, top };
      }

      return prev;
    });
  };

  console.log({ cond: zoomState.refAreaLeft && zoomState.refAreaRight });

  return (
    <Card className="w-full md:w-3/5 select-none">
      <CardHeader className={cn("flex-row gap-4 justify-between")}>
        <span>
          <CardTitle>Line Chart - Linear - {category}</CardTitle>
          {from && to ? (
            <CardDescription>{`${new Date(from)?.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })} - ${new Date(to)?.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}`}</CardDescription>
          ) : null}
        </span>
        {zoomState.isZoomed ? (
          <span className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-xs"
              onClick={panLeft}
              disabled={typeof zoomState.left === "number" && zoomState.left < chartData[0].day}
            >
              <Icons.chevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="data-"
              onClick={panRight}
              disabled={typeof zoomState.right === "number" && zoomState.right > chartData[chartData.length - 1].day}
            >
              <Icons.chevronRight className="size-4" />
            </Button>
            <Button size="sm" className="text-xs" onClick={zoomOut}>
              <Icons.zoomOut className="size-4" /> Zoom Out
            </Button>
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            width={800}
            height={400}
            onMouseDown={(e) => setZoomState({ ...zoomState, refAreaLeft: e.activeLabel })}
            onMouseMove={(e) => zoomState.refAreaLeft && setZoomState({ ...zoomState, refAreaRight: e.activeLabel })}
            onMouseUp={zoom}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              type="number"
              allowDataOverflow
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
              }}
              domain={[zoomState.left, zoomState.right]}
            />
            <YAxis allowDataOverflow domain={[zoomState.bottom, zoomState.top]} dataKey="value" type="number" />
            <ChartTooltip content={<ChartTooltipContent labelKey="day" nameKey="value" />} />
            <Line dataKey="value" type="linear" stroke="hsl(var(--chart-3))" strokeWidth={2} />

            <ReferenceArea x1={zoomState.refAreaLeft} x2={zoomState.refAreaRight} strokeOpacity={0.3} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
