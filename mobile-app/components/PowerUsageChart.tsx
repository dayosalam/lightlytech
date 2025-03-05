import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, Rect, Text as SvgText, Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface PowerUsageChartProps {
  // Chart data and appearance props
  data?: number[];
  labels?: string[];
  height?: number;
  lineColor?: string;
  backgroundColor?: string;
  // Style props
  containerStyle?: object;
  chartStyle?: object;
}

export default function PowerUsageChart({
  data = [500, 1200, 800, 1500, 2000, 1800, 500],
  labels = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  height = 220,
  lineColor = "#ff671f",
  backgroundColor = "#f5f5f5",
  containerStyle = {},
  chartStyle = {},
}: PowerUsageChartProps) {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null
  );

  // Calculate chart dimensions
  const chartWidth = screenWidth;
  const chartHeight = height;

  // Prepare chart data
  const chartData: ChartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(255, 103, 31, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Handle touch on chart
  const handleChartPress = (event: any) => {
    const { locationX } = event.nativeEvent;

    // Calculate which data point was touched based on x position
    const segmentWidth = chartWidth / (data.length - 1);
    const touchIndex = Math.round(locationX / segmentWidth);

    // Ensure index is within bounds
    const validIndex = Math.min(Math.max(0, touchIndex), data.length - 1);

    setActiveTooltipIndex(validIndex);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  // Format energy
  const formatEnergy = (value: number) => {
    return `${(value / 100).toFixed(2)}Kw/H`;
  };

  // Render tooltip at the active index
  const renderTooltip = () => {
    if (activeTooltipIndex === null) return null;

    // Calculate position based on chart width and data points
    const xPosition = (chartWidth / (data.length - 1)) * activeTooltipIndex;

    // Calculate y position based on data value (inverted, since SVG y increases downward)
    const dataValue = data[activeTooltipIndex];
    const maxValue = Math.max(...data);
    const yRatio = 1 - dataValue / maxValue;
    const yPosition = chartHeight * 0.8 * yRatio + chartHeight * 0.1; // Adjust for chart padding

    const tooltipValue = formatCurrency(dataValue);
    const tooltipUnit = formatEnergy(dataValue);

    return (
      <View style={[StyleSheet.absoluteFill, styles.decoratorContainer]}>
        <Svg height={chartHeight} width={chartWidth}>
          {/* Tooltip background */}
          <Path
            d={`
              M ${xPosition - 45} ${yPosition - 65}
              h 90
              a 5 5 0 0 1 5 5
              v 40
              a 5 5 0 0 1 -5 5
              h -35
              l -10 10
              l -10 -10
              h -35
              a 5 5 0 0 1 -5 -5
              v -40
              a 5 5 0 0 1 5 -5
              z
            `}
            fill="#022322"
          />

          {/* Tooltip text - value */}
          <SvgText
            x={xPosition}
            y={yPosition - 40}
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipValue}
          </SvgText>

          {/* Tooltip text - unit */}
          <SvgText
            x={xPosition}
            y={yPosition - 25}
            fill="white"
            fontSize="10"
            textAnchor="middle"
          >
            {tooltipUnit}
          </SvgText>

          {/* Data point circle */}
          <Circle
            cx={xPosition}
            cy={yPosition}
            r={5}
            fill="#022322"
            strokeWidth={2}
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={[styles.chartContainer, containerStyle]}>
      <TouchableWithoutFeedback onPress={handleChartPress}>
        <View>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={{
              backgroundColor,
              backgroundGradientFrom: backgroundColor,
              backgroundGradientTo: backgroundColor,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 103, 31, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(105, 105, 105, ${opacity})`,
              style: {
                borderRadius: 0, // Remove border radius to touch the sides
              },
              propsForDots: {
                r: "0", // Hide regular dots
                strokeWidth: "0",
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: "#e0e0e0",
                strokeWidth: 1,
              },
              formatYLabel: () => "", // Hide Y-axis labels
            }}
            bezier
            style={[styles.chart, chartStyle, { borderRadius: 0 }]} // Remove border radius
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={false}
            fromZero={true}
            segments={4}
            yAxisInterval={1000}
          />
          {renderTooltip()}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 10,
    position: "relative",
    width: "100%",
  },
  chart: {
    marginVertical: 8,
    paddingRight: 0,
    paddingLeft: 0,
  },
  decoratorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
});
