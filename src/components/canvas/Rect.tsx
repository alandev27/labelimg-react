import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setEditLock, setResizing } from "../../store/appSlice";
import { Point } from "../../interfaces";
import { abs } from "../../utils";
import { pointSize } from "../../utils/pointSize";

export function Rect({
    start,
    end,
    index = -1,
}: Readonly<{ start: Point; end: Point; index?: number }>) {
    const width = abs(end.x - start.x);
    const height = abs(end.y - start.y);

    // @todo add documentation for this
    const corners = [
        { x: (-3 * pointSize) / 4, y: (-3 * pointSize) / 4 },
        { x: width - (5 * pointSize) / 4, y: (-3 * pointSize) / 4 },
        { x: (-3 * pointSize) / 4, y: height - (5 * pointSize) / 4 },
        { x: width - (5 * pointSize) / 4, y: height - (5 * pointSize) / 4 },
    ];

    const top = start.y < end.y ? start.y : end.y;
    const left = start.x < end.x ? start.x : end.x;

    const canvas = useSelector((state: RootState) => state.app.canvas);
    const dispatch = useDispatch();

    return (
        <div
            className={`z-20 absolute border-4 ${index == -1 && canvas.action.editMode == 1 && "border-dotted bg-red-400 bg-opacity-15"} border-red-400 ${canvas.action.editLock == index && canvas.action.editMode == 1 && index != -1 && "bg-red-400 bg-opacity-15"}`}
            style={{
                top: top,
                left: left,
                width: width,
                height: height,
            }}
            onMouseOver={() => {
                if (canvas.action.rectCreate) return;
                if (canvas.action.resizing != -1) return;
                dispatch(setEditLock(index));
            }}
            onMouseLeave={() => {
                if (canvas.action.resizing != -1) return;
                dispatch(setEditLock(-1));
            }}
        >
            {index != -1 && (
                <div
                    className="z-30 absolute flex justify-center w-full"
                    style={{ top: "-35px" }}
                >
                    <div className="bg-red-400 select-none rounded-md text-xs text-white py-1 px-3 overflow-ellipsis">
                        {canvas.rects[index].label}
                    </div>
                </div>
            )}
            {corners.map((corner, i) => (
                <div
                    key={i}
                    className={`absolute bg-red-500 hover:bg-red-600 ${canvas.action.resizing == i && "bg-red-600"} cursor-pointer`}
                    style={{
                        top: corner.y,
                        left: corner.x,
                        width: pointSize,
                        height: pointSize,
                    }}
                    onMouseDown={() => {
                        if (canvas.action.rectCreate) return;
                        if (canvas.action.multistepEditing) return;
                        dispatch(setEditLock(index));
                        dispatch(setResizing(i));
                    }}
                    onMouseUp={() => {
                        dispatch(setResizing(-1));
                        dispatch(setEditLock(-1));
                    }}
                />
            ))}
        </div>
    );
}
