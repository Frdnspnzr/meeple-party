import classNames from "classnames";
import styles from "./bggrating.module.css";

export interface BggRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number | null;
  rank: number | null;
  size?: "md" | "sm";
}

export default function BggRating({
  rating,
  rank,
  size = "md",
  ...props
}: Readonly<BggRatingProps>) {
  return (
    <div
      {...props}
      className={classNames(
        styles.container,
        props.className,
        getRankStyle(rank),
        { [styles.medium]: size === "md", [styles.small]: size === "sm" }
      )}
    >
      <div className={styles.hexTop}>&nbsp;</div>
      <div className={styles.content}>
        <div className={styles.rank}>
          {!rank || rank > 9999 ? <>&ndash;</> : rank}
        </div>
        <div className={styles.rating}>{getRating(rating)}</div>
      </div>
      <div className={styles.hexBottom}>&nbsp;</div>
    </div>
  );
}

function round(i: number): number {
  return Math.round(i * 10) / 10;
}

function getRating(rating: number | null): string {
  if (!rating) {
    return "-";
  }
  const rounded = round(rating);
  const asString = rounded.toString();
  if (asString.includes(".")) {
    return asString;
  } else {
    return `${asString}.0`;
  }
}

function getRankStyle(rank: number | null) {
  if (!rank || rank >= 10000) {
    return styles.unranked;
  } else if (rank <= 10) {
    return styles.top10;
  } else if (rank <= 100) {
    return styles.top100;
  } else if (rank <= 1000) {
    return styles.top1000;
  } else {
    return styles.top10000;
  }
}
