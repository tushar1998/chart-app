import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Sheets } from "@/types/sheets";
import { useEffect, useState } from "react";

const categories = ["A", "B", "C", "D", "E", "F"];

interface ChartOneProps {
  data: Array<Sheets>;
  to?: Date;
  from?: Date;
  handleCategory: (e: any) => void;
  category: string;
}

export function ChartOne({ data, to, from, handleCategory, category }: ChartOneProps) {
  const [chartData, setData] = useState<Array<{ category: string; value: string }>>([]);

  useEffect(() => {
    setData(
      categories.map((category) => {
        // @ts-ignore
        const total = data.reduce((sum, item) => sum + (item[category] || 0), 0);

        return { category, value: total.toString() };
      }, [])
    );
  }, [data]);

  return (
    <Card className="w-full md:w-3/5">
      <CardHeader>
        <CardTitle>Bar Chart - Title</CardTitle>
        {from && to ? (
          <CardDescription>{`${new Date(from)?.toLocaleDateString()} - ${new Date(
            to
          )?.toLocaleDateString()}`}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
            onClick={handleCategory}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              dataKey="value"
              type="number"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <YAxis dataKey="category" type="category" tickLine={false} tickMargin={10} axisLine={false} />
            <XAxis dataKey="value" type="number" interval={1} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar data-category={category} dataKey="value" layout="vertical" radius={4} fill="#e0e0e0">
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.category === category ? "hsl(var(--chart-1))" : "#e0e0e0"} />
              ))}
              <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
