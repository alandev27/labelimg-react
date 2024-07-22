import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Point } from "../../interfaces";
import { pointSize } from "../../utils/pointSize";

export function Fill({
    points,
    index,
}: Readonly<{ points: Point[]; index: number }>) {
    const canvas = useSelector((state: RootState) => state.app.canvas);

    const pointsStr = points
        .map((point) => `${point.x + pointSize / 2},${point.y + pointSize / 2}`)
        .join(" "); // to align <polygon> svg with point, svgs are center aligned, points are aligned at top left corner

    return (
        <polygon
            points={pointsStr}
            className={`${index == -1 ? "fill-red-400" : "fill-transparent"} ${canvas.action.editLock == index && "fill-red-400"} hover:fill-red-400 opacity-15`}
        />
    );
}
