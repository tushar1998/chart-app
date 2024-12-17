import { DatePickerWithRange } from "./common/date-range-picker";
import { SelectRangeEventHandler } from "react-day-picker";
import ChartFilterDropDown from "./common/chart-filter-dropdown";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Filters } from "@/types/filter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./hooks/use-auth";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { SheetsResponse } from "@/types/sheets";
import { ChartOne } from "./chart-1";
import { ChartTwo } from "./chart-2";
import Conditional from "./utils/conditional";
import { Icons } from "@/lib/icons";
import { useAxiosInstance } from "./hooks/use-axios-instance";
import { searchParams } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const defaultFilters = {
  day: { from: new Date(1664821800000), to: new Date(1666981800000) },
  age: ["15-25", ">25"],
  gender: ["male", "female"],
};

export default function Home() {
  const { state } = useLocation();
  const { access_token, isAuthenticated } = useAuth();

  const [seeded, setSeeded] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");

  const params = searchParams() as unknown as { filter: string };

  const axios = useAxiosInstance();

  const [filter, setFilter] = useState<Filters>(defaultFilters);

  console.log({ state });

  const handleCategory = (e: any) => {
    setCategory(e.activeLabel);
  };

  const handleDate: SelectRangeEventHandler = (date) => {
    if (date) {
      setFilter({ ...filter, day: date });
    }
  };

  const handleAge = (key: string, value: boolean) => {
    if (filter?.age)
      setFilter({
        ...filter,
        age: value ? [...filter.age, key] : filter?.age.filter((item) => item !== key),
      });
  };

  const handleGender = (key: string, value: boolean) => {
    if (filter?.gender)
      setFilter({
        ...filter,
        gender: value ? [...filter?.gender, key] : filter?.gender.filter((item) => item !== key),
      });
  };

  const clearFilters = () => {
    setFilter(defaultFilters);
    Cookies.set("filter", JSON.stringify(defaultFilters));
    refetchSheets();
  };

  const {
    data,
    isPending,
    refetch: refetchSheets,
  } = useQuery<SheetsResponse | undefined>({
    queryKey: ["sheets"],
    queryFn: async () => {
      try {
        const res: AxiosResponse<SheetsResponse> = await axios.get("/sheets", {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });

        setSeeded(res.data.sheets.seeded);

        return res.data;
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    },
    enabled: false,
  });

  const { refetch, isLoading } = useQuery({
    queryKey: ["seed"],
    enabled: false,
    queryFn: async (): Promise<{ message: string }> => {
      try {
        const res = await axios.get("/sheets/seed", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        toast.success(res.data.message);

        refetchSheets();

        return res.data;
      } catch (error) {
        toast.error("Something went wrong");

        return { message: JSON.stringify(error) };
      }
    },
  });

  useEffect(() => {
    const cookies = Cookies.get("filter");

    const query = params.filter;

    if (cookies) {
      console.log("cookies found");
      setFilter(JSON.parse(cookies));
    } else {
      Cookies.set("filter", JSON.stringify(defaultFilters), { expires: 7 });
    }

    if (query) {
      console.log("query found");
      setFilter(JSON.parse(query));
      Cookies.set("filter", query, { expires: 7 });
    }

    if (!isAuthenticated) {
      return;
    }

    refetchSheets();
  }, []);

  return (
    <section className="flex mx-auto grid w-full flex-1 gap-4 p-4 sm:px-8">
      <main className="flex-1">
        <div className="mb-4 flex gap-2 flex-wrap">
          <DatePickerWithRange
            date={filter?.day}
            handleDate={handleDate}
            range={{ from: 1664821800000, to: 1666981800000 }}
          />
          <ChartFilterDropDown
            filterType="age"
            filter={filter?.age}
            options={[
              { label: "15-25", value: "15-25" },
              { label: ">25", value: ">25" },
            ]}
            handleChange={handleAge}
          />
          <ChartFilterDropDown
            filterType="gender"
            filter={filter?.gender}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            handleChange={handleGender}
          />
          <Button
            onClick={() => {
              console.log({ submitFilter: filter });
              Cookies.set("filter", JSON.stringify(filter), { expires: 7 });
              // setFilter(filter);
              refetchSheets();
            }}
          >
            Apply Filter
          </Button>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>

          <Button
            onClick={() => {
              // Construct share URL with query params
              const url = new URL(window.location.href);
              url.searchParams.set("filter", JSON.stringify(filter));

              console.log(url.href);
              // Copy to clipboard
              navigator.clipboard.writeText(url.href);
            }}
            variant="outline"
          >
            Share
          </Button>
        </div>

        <Conditional satisfies={isPending}>
          <Icons.loader className="size-4 animate-spin" />
        </Conditional>

        <Conditional satisfies={data?.data && (data?.data.length === 0 && data.sheets.seeded === true)}>
          No Data
        </Conditional>

        {data?.data && data?.data.length > 0 && (
          <span className="flex gap-4 flex-wrap lg:flex-nowrap">
            <ChartOne
              data={data?.data}
              from={filter.day?.from}
              to={filter.day?.to}
              handleCategory={handleCategory}
              category={category}
            />
            {/* <ChartTwoZoom /> */}
            {category.length > 0 && (
              <ChartTwo
                data={data?.data}
                from={filter.day?.from}
                to={filter.day?.to}
                handleCategory={handleCategory}
                category={category}
              />
            )}
          </span>
        )}

        {!seeded && !isPending ? (
          <div className="flex items-center h-full justify-center flex-col gap-4">
            <Button onClick={() => refetch()} loading={isLoading}>
              Populate Sheets
            </Button>
            <p className="text-sm text-muted-foreground">
              Click the button to fetch and store data from the sheets into the database.
            </p>
          </div>
        ) : null}
      </main>
    </section>
  );
}
