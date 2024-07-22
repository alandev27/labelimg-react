import { useDispatch, useSelector } from "react-redux";
import {
    polyShiftOut,
    setEditLock,
    setMultistepEditing,
    setResizing,
} from "../../store/appSlice";
import { RootState } from "../../store";
import { pointSize } from "../../utils/pointSize";

export function Point({
    x,
    y,
    index = -1,
    parentIndex = -1,
}: Readonly<{ x: number; y: number; index?: number; parentIndex?: number }>) {
    const canvas = useSelector((state: RootState) => state.app.canvas);

    const dispatch = useDispatch();

    if (index == -1) {
        // for virtual point special display
        return (
            <div
                className="absolute bg-red-500 bg-opacity-15 border-dotted border border-red-500"
                style={{
                    width: pointSize,
                    height: pointSize,
                    top: y,
                    left: x,
                }}
            />
        );
    }

    return (
        <div
            className={`absolute z-50 bg-red-500 cursor-pointer ${canvas.action.resizing == index && canvas.action.editMode == 2 && "bg-red-600"}`}
            style={{
                width: pointSize,
                height: pointSize,
                top: y,
                left: x,
            }}
            onMouseOver={() => {
                if (canvas.action.editMode != 2) return;
                if (canvas.action.resizing != -1) return;

                // set the editLock while the multiStepEditing is still one
                if (index == 0 && parentIndex == -1) {
                    dispatch(setEditLock(-2));
                    return;
                }
                dispatch(setEditLock(parentIndex));
            }}
            onMouseLeave={() => {
                if (canvas.action.resizing != -1) return;
                dispatch(setEditLock(-1));
            }}
            onClick={() => {
                if (index == 0 && canvas.action.multistepEditing) {
                    dispatch(setMultistepEditing(false));

                    dispatch(polyShiftOut());
                    dispatch(setEditLock(-1));
                }
            }}
            onMouseDown={() => {
                if (
                    canvas.action.editLock == -1 &&
                    canvas.action.editLock == parentIndex
                )
                    return;
                dispatch(setResizing(index));
            }}
        />
    );
}
