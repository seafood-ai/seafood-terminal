"use client";

import React, { useEffect, useState } from "react";
import SideBarElement from "@/components/custom/SideBarElement";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import type { ChartOptions } from "chart.js";
import "chartjs-adapter-luxon";
import { Chart } from "react-chartjs-2";
import TopSpeciesGraph from "@/components/custom/TopSpeciesGraph";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoTriangleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/utils/lib/auth";
import { Input } from "@/components/ui/input";

ChartJS.register(
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  CandlestickController,
  CandlestickElement
);

const data = {
  datasets: [
    {
      label: "CPUE",
      data: [
        { x: new Date("2025-09-01").getTime(), o: 100, h: 110, l: 95, c: 108 },
        { x: new Date("2025-09-02").getTime(), o: 108, h: 118, l: 100, c: 102 },
        { x: new Date("2025-09-03").getTime(), o: 102, h: 112, l: 96, c: 98 },
        { x: new Date("2025-09-04").getTime(), o: 98, h: 106, l: 90, c: 94 },
        { x: new Date("2025-09-05").getTime(), o: 94, h: 104, l: 88, c: 100 },
        { x: new Date("2025-09-06").getTime(), o: 100, h: 112, l: 95, c: 110 },
        { x: new Date("2025-09-07").getTime(), o: 110, h: 122, l: 105, c: 118 },
        { x: new Date("2025-09-08").getTime(), o: 118, h: 128, l: 112, c: 120 },
        { x: new Date("2025-09-09").getTime(), o: 120, h: 126, l: 110, c: 112 },
        { x: new Date("2025-09-10").getTime(), o: 112, h: 118, l: 102, c: 106 },
        { x: new Date("2025-09-11").getTime(), o: 106, h: 114, l: 96, c: 98 },
        { x: new Date("2025-09-12").getTime(), o: 98, h: 108, l: 90, c: 94 },
        { x: new Date("2025-09-13").getTime(), o: 94, h: 100, l: 85, c: 88 },
        { x: new Date("2025-09-14").getTime(), o: 88, h: 96, l: 80, c: 92 },
        { x: new Date("2025-09-15").getTime(), o: 92, h: 104, l: 88, c: 100 },
        { x: new Date("2025-09-16").getTime(), o: 100, h: 110, l: 95, c: 108 },
        { x: new Date("2025-09-17").getTime(), o: 108, h: 120, l: 100, c: 116 },
        { x: new Date("2025-09-18").getTime(), o: 116, h: 126, l: 110, c: 124 },
        { x: new Date("2025-09-19").getTime(), o: 124, h: 132, l: 115, c: 128 },
        { x: new Date("2025-09-20").getTime(), o: 128, h: 138, l: 120, c: 134 },
        { x: new Date("2025-09-21").getTime(), o: 134, h: 140, l: 125, c: 130 },
        { x: new Date("2025-09-22").getTime(), o: 130, h: 136, l: 118, c: 122 },
        { x: new Date("2025-09-23").getTime(), o: 122, h: 128, l: 110, c: 116 },
        { x: new Date("2025-09-24").getTime(), o: 116, h: 122, l: 106, c: 112 },
        { x: new Date("2025-09-25").getTime(), o: 112, h: 118, l: 100, c: 104 },
        { x: new Date("2025-09-26").getTime(), o: 104, h: 110, l: 92, c: 96 },
        { x: new Date("2025-09-27").getTime(), o: 96, h: 102, l: 88, c: 90 },
        { x: new Date("2025-09-28").getTime(), o: 90, h: 98, l: 82, c: 94 },
        { x: new Date("2025-09-29").getTime(), o: 94, h: 108, l: 90, c: 106 },
        { x: new Date("2025-09-30").getTime(), o: 106, h: 120, l: 100, c: 118 },
      ],
      borderColor: "rgba(0, 0, 0, 1)",
      backgroundColors: {
        up: "rgba(13, 203, 55, 1)", // Color for up candles
        down: "rgba(248, 72, 45, 1)", // Color for down candles
        unchanged: "rgba(143, 143, 143, 1)", // Color for unchanged candles
      },
    },
  ],
};

const options: ChartOptions<"candlestick"> = {
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
      },
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      title: {
        display: true,
        text: "Price",
      },
    },
  },
};

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("1D");
  const token = getToken();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push("/login");
        return;
      }
    };

    fetchProfile();
  }, [router]);

  const handlerBackClick = () => {
    router.push("/dashboard");
  };

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (token) {
    return (
      <>
        <header className="px-6 py-3 sticky top-0 bg-[#181818] shadow-sm shadow-gray-800">
          <div className="flex items-center justify-center md:justify-between">
            <h1 className="text-xl font-bold text-gray-200 hidden md:block">
              SeafoodAI Terminal
            </h1>
            <div className="flex justify-between items-center gap-4 w-full md:w-125">
              <div className="relative flex-1">
                <Input
                  className="md:w-100 bg-[#181818] border-gray-700"
                  type="text"
                  placeholder="Symbol Lookup, species, port, vessel ID"
                />
              </div>
              <Button
                variant={"outline"}
                className="shadow-sm cursor-pointer bg-red-800 text-gray-200 hover:bg-red-700 hover:text-white border-0"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="min-h-screen bg-[#181818] text-white flex">
          {/* Sidebar */}
          <div className="w-50 bg-[#181818] hidden md:block">
            {/* Navigation */}
            <div className="p-2 pr-0">
              <div className="flex flex-col">
                <Button
                  onClick={handlerBackClick}
                  className="bg-gray-600 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-md shadow-md transition-colors duration-200 items-center gap-2 cursor-pointer mb-3 ml-2 mt-2"
                >
                  Back
                </Button>
                <div
                  className={
                    "flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-l-2 border-gray-500 ml-2 pl-1"
                  }
                >
                  <div className="flex items-center space-x-0">
                    <span className={"text-gray-400 font-medium pl-2"}>
                      Data
                    </span>
                  </div>
                </div>
                <SideBarElement
                  title={"Harvest Operations (CPUE)"}
                  bgColor={"#371C0E"}
                  textColor={"#f5df99"}
                  showArrow={true}
                />
                <SideBarElement
                  title={"Regulatory & Compliance (Quota Inputs)"}
                  bgColor={"#092530"}
                  textColor={"#8bcde7"}
                  showArrow={true}
                />
                <SideBarElement
                  title={"Processing Plant Data"}
                  bgColor={"#2A0B22"}
                  textColor={"#ceb1c7"}
                />
                <SideBarElement
                  title={"Market & Buyer Data"}
                  bgColor={"#133409"}
                  textColor={"#96c289"}
                />
                <SideBarElement
                  title={"Traceability Data"}
                  bgColor={"#2A0B22"}
                  textColor={"#ceb1c7"}
                />
                <SideBarElement
                  title={"Environmental Conditions"}
                  bgColor={"#092530"}
                  textColor={"#8bcde7"}
                  showArrow={true}
                />
                <SideBarElement
                  title={"Quality & Condition Metrics"}
                  bgColor={"#231232"}
                  textColor={"#a48cb9"}
                />
                <SideBarElement
                  title={"Economic & Effort Data"}
                  bgColor={"#371C0E"}
                  textColor={"#f5df99"}
                />
                <SideBarElement
                  title={"Consumer Engagement Data"}
                  bgColor={"#092530"}
                  textColor={"#8bcde7"}
                  showArrow={true}
                />
                <SideBarElement
                  title={"Risk & Compliance"}
                  bgColor={"#360F13"}
                  textColor={"#bd898e"}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Dashboard Content */}
            <div className="flex-1 px-6 py-4">
              <div className="flex md:grid md:grid-cols-4 gap-6">
                {/* Main Chart Section */}
                <div className="col-span-3">
                  <div className="bg-[#181818] rounded-lg p-6 border-1 border-gray-700">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">
                          Harvest Operations (CPUE)
                        </h2>
                      </div>
                      <div className="flex space-x-2">
                        {["1D", "1W", "1M", "1Y", "Max"].map((timeframe) => (
                          <button
                            key={timeframe}
                            onClick={() => setActiveTimeframe(timeframe)}
                            className={`px-3 py-1 rounded text-sm ${
                              activeTimeframe === timeframe
                                ? "bg-[#113949] text-[#80a9b9]"
                                : "bg-[#2e2d2d] text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            {timeframe}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="h-80">
                      {/* <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpueData}>
                      <defs>
                        <linearGradient
                          id="cpueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        domain={[80, 130]}
                      />
                      <Area
                        type="monotone"
                        dataKey="cpue"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#cpueGradient)"
                      />
                      <Line
                        type="monotone"
                        dataKey="quota"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer> */}

                      <Chart type="candlestick" data={data} options={options} />
                    </div>

                    {/* Species Movers Table */}
                    <div className="mt-8 bg-[#222222] p-5 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Top Species Movers
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#222222] rounded p-0">
                          <div className="flex">
                            <div>
                              <div className="text-sm text-gray-400 mb-2">
                                Apr
                              </div>
                              <div className="text-green-400 text-lg font-semibold">
                                +3.0%
                              </div>
                            </div>
                            <div className="w-full h-15 ml-4">
                              <TopSpeciesGraph />
                            </div>
                          </div>
                          <div className="h-[1px] max-w-full bg-gray-400 ml-3 mt-1 mr-1"></div>
                          <div className="flex justify-between mt-2 mx-4 text-lg">
                            <div>55,48</div>
                            <div>$5,48</div>
                            <div>PDX</div>
                          </div>
                        </div>

                        <div className="space-y-2 bg-[#222222] -mt-2">
                          <div className="font-semibold text-lg pl-4">
                            Top Species Movers
                          </div>
                          <div className="flex justify-between mt-2 mx-4 text-lg">
                            <div className="flex space-x-7">
                              <div className="text-blue-400">A</div>
                              <div className="text-blue-400">8,52</div>
                            </div>
                            <div className="text-green-600">SAV</div>
                          </div>
                          <div className="h-[1px] max-w-full bg-gray-400 ml-3 mt-1 mr-1"></div>
                          <div className="flex justify-between mt-2 mx-4 text-lg">
                            <div className="flex space-x-7">
                              <div className="text-green-600">H</div>
                              <div className="text-blue-400">3,49</div>
                            </div>
                            <div className="text-blue-400">SEA</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6 hidden md:block">
                  {/* Key Metrics */}
                  <div className="bg-[#181818] rounded-lg p-4 border-1 border-gray-700">
                    <h3 className="font-semibold mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <span>Current CPUE</span>
                          <span className="font-semibold">121.5</span>
                        </div>
                        <div className="bg-gray-700 mt-2 rounded-full">
                          <div
                            style={{
                              height: "3px",
                              width: "100%",
                              backgroundColor: "#3480d8",
                            }}
                            className="rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <span>Quota Usage %</span>
                          <span className="font-semibold">72%</span>
                        </div>
                        <div className="bg-gray-700 mt-2 rounded-full">
                          <div
                            style={{
                              height: "3px",
                              width: "72%",
                              backgroundColor: "#10B981",
                            }}
                            className="rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <span>Landing Volume MT</span>
                          <span className="font-semibold">8,52</span>
                        </div>
                        <div className="bg-gray-700 mt-2 rounded-full">
                          <div
                            style={{
                              height: "3px",
                              width: "60%",
                              backgroundColor: "#10B981",
                            }}
                            className="rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Price $/lb</span>
                        <span className="font-semibold">3,68</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Species Movers */}
                  <div className="bg-[#181818] rounded-lg p-4 border-1 border-gray-700">
                    <h3 className="font-semibold mb-4">Top Species Movers</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FaArrowUp className="text-green-400" size={16} />
                            <span className="text-green-400">3,7%</span>
                          </div>
                          <span className="text-gray-400">SVIS</span>
                        </div>
                        <div className="bg-gray-700 mt-2 rounded-full">
                          <div
                            style={{
                              height: "3px",
                              width: "80%",
                              backgroundColor: "#10B981",
                            }}
                            className="rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FaArrowDown className="text-red-400" size={16} />
                            <span className="text-red-400">-2,8%</span>
                          </div>
                          <span className="text-gray-400">STA</span>
                        </div>
                        <div className="bg-gray-700 mt-2 rounded-full">
                          <div
                            style={{
                              height: "3px",
                              width: "70%",
                            }}
                            className="rounded-full bg-red-400"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk & Compliance Data */}
                  <div className="bg-[#181818] rounded-lg p-4 border-1 border-gray-700">
                    <h3 className="font-semibold mb-4">
                      Risk & Compliance Data
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IoTriangleOutline
                            className="text-red-400"
                            size={16}
                          />
                          <span className="text-red-400">0,8%</span>
                        </div>
                        <span className="text-gray-400">JNU</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Dashboard;
