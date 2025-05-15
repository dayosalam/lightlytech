import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Platform, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

interface PowerUsageChartProps {
  // Chart data and appearance props
  data?: number[];
  readings?: {
    bill: number;
    created_at: string;
    currents: number[];
    energy_kwh: number[];
    id: string;
    power_watts: number[];
    recorded_at: string;
    total_energy: number;
  }[];
  dataType?: 'power' | 'energy' | 'current';
  timePeriod?: string; // 'Today', '1 M', '1 Y', 'All time'
  labels?: string[];
  height?: number;
  lineColor?: string;
  backgroundColor?: string;
  // Style props
  containerStyle?: object;
  chartStyle?: object;
}

export default function PowerUsageChart({
  data,
  readings = [],
  dataType = 'power',
  timePeriod = 'Today',
  labels,
  height = 220,
  lineColor = "#ff671f",
  backgroundColor = "#f5f5f5",
  containerStyle = {},
  chartStyle = {},
}: PowerUsageChartProps) {
  // If readings are provided, extract the appropriate data based on dataType and timePeriod
  const chartValues = React.useMemo(() => {
    if (readings && readings.length > 0) {
      // Extract the base data based on dataType
      let baseData: number[] = [];
      if (dataType === 'power') {
        // Use the first reading's power_watts array
        baseData = readings[0].power_watts || [];
      } else if (dataType === 'energy') {
        // Use the first reading's energy_kwh array
        baseData = readings[0].energy_kwh || [];
      } else if (dataType === 'current') {
        // Use the first reading's currents array
        baseData = readings[0].currents || [];
      }
      
      // Apply time period filtering (simulated for now)
      // In a real app, you would filter the readings based on the time period
      // and aggregate the data accordingly
      switch (timePeriod) {
        case 'Today':
          // Use the data as is for today
          return baseData;
        case '1 M':
          // Simulate monthly data by scaling the values
          return baseData.map(value => value * 30);
        case '1 Y':
          // Simulate yearly data by scaling the values
          return baseData.map(value => value * 365);
        case 'All time':
          // Simulate all-time data by scaling the values even more
          return baseData.map(value => value * 500);
        default:
          return baseData;
      }
    }
    // Fallback to provided data or default
    return data || [10, 100, 20, 30, 0, 0, 0, 0];
  }, [readings, dataType, timePeriod, data]);

  // Generate default labels if none provided, based on time period
  const chartLabels = React.useMemo(() => {
    if (labels) return labels;
    
    // If we have exactly 2 values, these are likely phase 1 and phase 2
    if (chartValues.length === 2) {
      return ['Phase 1', 'Phase 2'];
    }
    
    // Generate time-appropriate labels based on the selected time period
    switch (timePeriod) {
      case 'Today':
        return [
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
        ];
      case '1 M':
        return [
          "Week 1",
          "Week 2",
          "Week 3",
          "Week 4",
        ];
      case '1 Y':
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      case 'All time':
        return [
          "2022",
          "2023",
          "2024",
          "2025",
        ];
      default:
        return [
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
        ];
    }
  }, [labels, chartValues, timePeriod]);
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(
    null
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  // Format energy
  const formatEnergy = (value: number) => {
    if (dataType === 'energy') {
      return `${value.toFixed(2)}kWh`;
    } else if (dataType === 'power') {
      return `${value.toFixed(2)}W`;
    } else if (dataType === 'current') {
      return `${value.toFixed(2)}A`;
    }
    return `${(value / 100).toFixed(2)}kWh`;
  };

  // Calculate responsive dimensions based on platform and screen size
  const getResponsiveDimensions = () => {
    // Get available width (accounting for potential padding in parent containers)
    const availableWidth = Math.min(screenWidth, 500); // Cap max width

    // Calculate chart width with some padding
    const chartWidth = availableWidth - 20;

    // Adjust height based on width for proper aspect ratio
    const responsiveHeight =
      Platform.OS === "ios" ? height : Math.min(height, chartWidth / 1.8);

    return {
      chartWidth,
      responsiveHeight,
    };
  };

  const { chartWidth, responsiveHeight } = getResponsiveDimensions();

  // Prepare chart data for Gifted Charts
  const chartData = chartValues.map((value, index) => ({
    value,
    dataPointText: "",
    onPress: () => setSelectedDataPoint(index),
    label: chartLabels[index],
    labelComponent: () => (
      <Text style={styles.labelText} numberOfLines={1} adjustsFontSizeToFit>
        {chartLabels[index]}
      </Text>
    ),
  }));

  // Render selected point tooltip
  const renderTooltip = () => {
    if (selectedDataPoint === null) return null;

    const value = chartValues[selectedDataPoint];

    return (
      <View style={styles.tooltipWrapper}>
        <View style={styles.tooltipContainer}>
          <Text style={styles.tooltipValueText}>{formatCurrency(value)}</Text>
          <Text style={styles.tooltipUnitText}>{formatEnergy(value)}</Text>
        </View>
        <View style={styles.tooltipArrow} />
      </View>
    );
  };

  return (
    <View
      style={[styles.chartContainer, containerStyle, { width: chartWidth }]}
    >
      <View
        style={[{ backgroundColor, width: chartWidth }, styles.chartWrapper]}
      >
        <LineChart
          data={chartData}
          height={responsiveHeight}
          width={chartWidth}
          hideDataPoints
          showDataPointOnPress
          spacing={(chartWidth - 40) / (chartValues.length > 1 ? chartValues.length - 1 : 1)}
          color={lineColor}
          thickness={2}
          startFillColor={lineColor}
          endFillColor={backgroundColor}
          startOpacity={0.2}
          endOpacity={0.0}
          initialSpacing={20}
          endSpacing={20}
          noOfSections={4}
          yAxisTextStyle={{ color: "transparent" }}
          yAxisColor="transparent"
          xAxisColor="#e0e0e0"
          xAxisIndicesHeight={0}
          xAxisLabelsHeight={30}
          curved
          areaChart
          rulesType="solid"
          rulesColor="#e0e0e0"
          rulesThickness={1}
          dataPointsColor={lineColor}
          dataPointsRadius={5}
          showStripOnPress
          stripColor={lineColor}
          stripWidth={1}
          stripOpacity={0.1}
          style={[styles.chart, chartStyle]}
          isAnimated
          animationDuration={500}
          onPress={(item, index) => {
            setSelectedDataPoint(selectedDataPoint === index ? null : index);
          }}
          renderCustomLinearGradient={() => (
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              colors={[`${lineColor}30`, `${backgroundColor}00`]}
            />
          )}
        />

        {/* Render the data point and tooltip for selected index */}
        {selectedDataPoint !== null && (
          <View
            style={[
              styles.selectedPointContainer,
              {
                left:
                  20 +
                  selectedDataPoint * ((chartWidth - 40) / (chartValues.length > 1 ? chartValues.length - 1 : 1)),
                bottom:
                  selectedDataPoint !== null
                    ? (chartValues[selectedDataPoint] / Math.max(...chartValues)) *
                        (responsiveHeight * 0.7) +
                      50
                    : 0,
              },
            ]}
          >
            <View style={[styles.dataPoint, { backgroundColor: lineColor }]} />
            {renderTooltip()}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 10,
    alignSelf: "center",
  },
  chartWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
    width: "100%",
  },
  chart: {
    marginVertical: 8,
    paddingRight: 0,
    paddingLeft: 0,
  },
  labelText: {
    fontSize: 11,
    color: "#696969",
    textAlign: "center",
    marginTop: 4,
    width: 40,
  },
  selectedPointContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  dataPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  tooltipWrapper: {
    position: "absolute",
    bottom: 15,
    alignItems: "center",
  },
  tooltipContainer: {
    backgroundColor: "#022322",
    borderRadius: 5,
    padding: 8,
    alignItems: "center",
    minWidth: 90,
  },
  tooltipValueText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tooltipUnitText: {
    color: "white",
    fontSize: 10,
    marginTop: 2,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#022322",
  },
});
