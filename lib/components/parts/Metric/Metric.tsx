import styles from "./Metric.module.css";

interface MetricProps {
  value: string | number;
  precision?: number;
  label: string;
}

export default function Metric({
  value,
  precision,
  label,
}: Readonly<MetricProps>) {
  return (
    <div className={styles.container}>
      <h3 className={styles.value}>{getValue(value, precision)}</h3>
      <small className={styles.label}>{label}</small>
    </div>
  );
}

function getValue(value: number | string, precision?: number) {
  if (typeof value === "number") {
    return applyPrecision(value, precision);
  } else {
    return value;
  }
}

function applyPrecision(value: number, precision?: number): number {
  if (precision) {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  } else {
    return value;
  }
}
