import { Point } from "../../interfaces";
import { pointSize } from "../../utils/pointSize";

// @note see ./Fill.tsx, ./Canvas.tsx for pointSize / 2 reason
export function Line({
    from,
    to,
    index = -1,
}: Readonly<{ from: Point; to: Point; index?: number }>) {
    if (index == -1) {
        // for virtual line special display
        return (
            <line
                x1={from.x + pointSize / 2}
                y1={from.y + pointSize / 2}
                x2={to.x + pointSize / 2}
                y2={to.y + pointSize / 2}
                className="stroke-red-400 border-dotted"
                strokeWidth="4px"
                stroke-dasharray="5,5"
            />
        );
    }

    return (
        <line
            x1={from.x + pointSize / 2}
            y1={from.y + pointSize / 2}
            x2={to.x + pointSize / 2}
            y2={to.y + pointSize / 2}
            className="stroke-red-400 border"
            strokeWidth="4px"
        />
    );
}
