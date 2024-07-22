import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
    addLine,
    addPoint,
    addRect,
    editRect,
    movePoint,
    setRectCreate,
    setMultistepEditing,
    setRectEnd,
    setRectStart,
    setResizing,
    setVPoint,
    setEditLock,
    setOriginalDimension,
    setResizedDimension,
    saveCanvas,
} from "../../store/appSlice";
import { Fill, Line, Point, Rect } from ".";

import { editModeToCursor } from "../../utils";
import { pointSize } from "../../utils/pointSize";
import { useEffect, useRef } from "react";

export default function Canvas() {
    const dispatch = useDispatch();
    const canvas = useSelector((state: RootState) => state.app.canvas);
    const app = useSelector((state: RootState) => state.app);

    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imageRef.current) return;

        if (app.opened == -1) return;

        const imageRaw = new Image();
        imageRaw.src = app.images[app.opened].raw;

        imageRef.current.onload = () => {
            const width = imageRef.current!.width;
            const height = imageRef.current!.height;
            dispatch(setResizedDimension({ index: app.opened, width, height }));
        };

        imageRaw.onload = () => {
            const width = imageRaw.width;
            const height = imageRaw.height;
            dispatch(
                setOriginalDimension({ index: app.opened, width, height }),
            );
        };
    }, [app.opened]);

    useEffect(() => {
        dispatch(saveCanvas());
    }, [app.canvas]);

    return (
        <div className="flex flex-row h-full bg-gray-200 w-full overflow-hidden">
            <div className="h-full flex flex-col w-full overflow-scroll">
                <div
                    className="flex justify-center h-full bg-gray-100 w-[60rem]"
                    style={{
                        cursor: editModeToCursor[
                            canvas.action.editMode as 0 | 1 | 2
                        ],
                    }}
                >
                    <div className="relative">
                        <div
                            className="z-10 absolute h-full w-full"
                            onMouseDown={(e) => {
                                // if use is already interacting with something else, return
                                if (canvas.action.editLock != -1) {
                                    dispatch(setRectCreate(false));
                                    return;
                                }

                                if (app.opened == -1) return;

                                // @todo bottom section can be optimized
                                const rect =
                                    e.currentTarget.getBoundingClientRect();

                                // pointSize / 2 is to align the cursor on the middle of the point (cursor is centered at center, point is centered at top left)
                                const top = rect.top + pointSize / 2;
                                const left = rect.left + pointSize / 2;

                                switch (canvas.action.editMode) {
                                    // create rectangle
                                    case 1:
                                        {
                                            dispatch(
                                                setRectStart({
                                                    x: e.clientX - left,
                                                    y: e.clientY - top,
                                                }),
                                            );
                                            dispatch(
                                                setRectEnd({
                                                    x: e.clientX - left,
                                                    y: e.clientY - top,
                                                }),
                                            );
                                            dispatch(setRectCreate(true));
                                        }
                                        break;
                                    // create polygon
                                    case 2: {
                                        const point1 =
                                            canvas.action.poly.points[
                                                canvas.action.poly.points
                                                    .length - 1
                                            ];

                                        const point2 = {
                                            x: e.clientX - left,
                                            y: e.clientY - top,
                                        };

                                        dispatch(addPoint(point2));

                                        if (point1 && point2)
                                            dispatch(
                                                addLine({
                                                    from: {
                                                        x: point1.x,
                                                        y: point1.y,
                                                    },
                                                    to: {
                                                        x: point2.x,
                                                        y: point2.y,
                                                    },
                                                }),
                                            );

                                        dispatch(
                                            setVPoint({
                                                x: e.clientX - left,
                                                y: e.clientY - top,
                                            }),
                                        );

                                        dispatch(setMultistepEditing(true));
                                    }
                                }
                            }}
                            onMouseUp={() => {
                                // handle interaction termination
                                if (canvas.action.rectCreate) {
                                    dispatch(setRectCreate(false));
                                    dispatch(
                                        addRect({
                                            index: canvas.rects.length,
                                            rect: {
                                                start: canvas.action.rect.start,
                                                end: canvas.action.rect.end,
                                            },
                                        }),
                                    );
                                }
                                dispatch(setResizing(-1));
                                dispatch(setEditLock(-1));
                            }}
                            onMouseLeave={() => {
                                // handle interaction termination
                                if (canvas.action.rectCreate) {
                                    dispatch(setRectCreate(false));
                                    dispatch(
                                        addRect({
                                            index: canvas.rects.length,
                                            rect: {
                                                start: canvas.action.rect.start,
                                                end: canvas.action.rect.end,
                                            },
                                        }),
                                    );
                                }
                                dispatch(setResizing(-1));
                                dispatch(setEditLock(-1));
                            }}
                            onMouseMove={(e) => {
                                const rect =
                                    e.currentTarget.getBoundingClientRect();

                                const top = rect.top + pointSize / 2;
                                const left = rect.left + pointSize / 2;

                                // while user is still making a polygon / rectangle
                                switch (canvas.action.editMode) {
                                    case 1:
                                        if (canvas.action.rectCreate) {
                                            dispatch(
                                                setRectEnd({
                                                    x: e.clientX - left,
                                                    y: e.clientY - top,
                                                }),
                                            );
                                        }
                                        break;
                                    case 2:
                                        if (canvas.action.multistepEditing) {
                                            dispatch(
                                                setVPoint({
                                                    x: e.clientX - left,
                                                    y: e.clientY - top,
                                                }),
                                            );
                                        }
                                        break;
                                }

                                // while user is resizing, editLock will always be activated
                                if (
                                    canvas.action.resizing != -1 &&
                                    canvas.action.editLock != -1
                                ) {
                                    switch (canvas.action.editMode) {
                                        case 1: {
                                            const corners = [
                                                {
                                                    xMod: "start",
                                                    yMod: "start",
                                                }, // width 16px / 2
                                                { xMod: "end", yMod: "start" }, // width 16px / 2 accumalates twice
                                                { xMod: "start", yMod: "end" }, // height 16px / 2 accumalates twice
                                                { xMod: "end", yMod: "end" }, // width 16px / 2 accumalates twice, height 16px / 2 accumalates twice
                                            ];

                                            const corner =
                                                corners[canvas.action.resizing];

                                            dispatch(
                                                editRect({
                                                    index: canvas.action
                                                        .editLock,
                                                    rect: {
                                                        start: {
                                                            x:
                                                                corner.xMod ==
                                                                "start"
                                                                    ? e.clientX -
                                                                      left
                                                                    : canvas
                                                                          .rects[
                                                                          canvas
                                                                              .action
                                                                              .editLock
                                                                      ].start.x,
                                                            y:
                                                                corner.yMod ==
                                                                "start"
                                                                    ? e.clientY -
                                                                      top
                                                                    : canvas
                                                                          .rects[
                                                                          canvas
                                                                              .action
                                                                              .editLock
                                                                      ].start.y,
                                                        },
                                                        end: {
                                                            x:
                                                                corner.xMod ==
                                                                "end"
                                                                    ? e.clientX -
                                                                      left
                                                                    : canvas
                                                                          .rects[
                                                                          canvas
                                                                              .action
                                                                              .editLock
                                                                      ].end.x,
                                                            y:
                                                                corner.yMod ==
                                                                "end"
                                                                    ? e.clientY -
                                                                      top
                                                                    : canvas
                                                                          .rects[
                                                                          canvas
                                                                              .action
                                                                              .editLock
                                                                      ].end.y,
                                                        },
                                                    },
                                                }),
                                            );
                                            break;
                                        }
                                        case 2:
                                            dispatch(
                                                movePoint({
                                                    parentIndex:
                                                        canvas.action.editLock,
                                                    pointIndex:
                                                        canvas.action.resizing,
                                                    point: {
                                                        x: e.clientX - left,
                                                        y: e.clientY - top,
                                                    },
                                                }),
                                            );
                                    }
                                }
                            }}
                        >
                            {canvas.action.rectCreate && (
                                <Rect
                                    start={canvas.action.rect.start}
                                    end={canvas.action.rect.end}
                                />
                            )}
                            {canvas.rects.map((rect, i) => {
                                return (
                                    <Rect
                                        key={i}
                                        index={i}
                                        start={rect.start}
                                        end={rect.end}
                                    />
                                );
                            })}

                            {canvas.action.multistepEditing &&
                                canvas.action.editMode == 2 &&
                                canvas.action.poly.points.map((point, i) => {
                                    return (
                                        <Point
                                            key={i}
                                            x={point.x}
                                            y={point.y}
                                            index={i}
                                        />
                                    );
                                })}
                            {canvas.action.multistepEditing &&
                                canvas.action.editMode == 2 && (
                                    <Point
                                        x={canvas.action.poly.vpoint.x}
                                        y={canvas.action.poly.vpoint.y}
                                    />
                                )}
                            {canvas.poly.map((poly, i) => (
                                <>
                                    {poly.points.map((point, j) => (
                                        <Point
                                            key={j}
                                            x={point.x}
                                            y={point.y}
                                            index={j}
                                            parentIndex={i}
                                        />
                                    ))}
                                    <div
                                        className="absolute z-50 bg-red-400 select-none rounded-md text-xs text-white py-1 px-3 overflow-ellipsis"
                                        style={{
                                            top: poly.points[0].y - 25,
                                            left: poly.points[0].x,
                                        }}
                                    >
                                        {poly.label}
                                    </div>
                                </>
                            ))}

                            <svg className="absolute h-full w-full pointer-events-auto">
                                {canvas.action.multistepEditing &&
                                    canvas.action.editMode == 2 &&
                                    canvas.action.poly.lines.map((line, i) => (
                                        <Line
                                            from={line.from}
                                            to={line.to}
                                            index={i}
                                        />
                                    ))}
                                {canvas.action.multistepEditing &&
                                    canvas.action.editMode == 2 && (
                                        <Line
                                            from={canvas.action.poly.vpoint}
                                            to={
                                                canvas.action.poly.points[
                                                    canvas.action.poly.points
                                                        .length - 1
                                                ]
                                            }
                                            index={-1}
                                        />
                                    )}
                                {canvas.action.multistepEditing &&
                                    canvas.action.editMode == 2 && (
                                        <Fill
                                            points={[
                                                ...canvas.action.poly.points,
                                                canvas.action.poly.vpoint,
                                            ]}
                                            index={-1}
                                        />
                                    )}
                                {canvas.poly.map((poly, i) => (
                                    <>
                                        {poly.lines.map((line, j) => (
                                            <Line
                                                key={j}
                                                from={line.from}
                                                to={line.to}
                                                index={j}
                                            />
                                        ))}
                                        <Fill
                                            key={i}
                                            points={poly.points}
                                            index={i}
                                        />
                                    </>
                                ))}
                            </svg>
                        </div>
                        {app.opened != -1 && app.images[app.opened].raw ? (
                            <img
                                src={app.images[app.opened].raw}
                                alt="image"
                                ref={imageRef}
                                draggable={false}
                                className="h-full"
                            />
                        ) : (
                            <div className="h-full w-full flex justify-center items-center">
                                <h1 className="text-4xl text-gray-400">
                                    No Image Opened
                                </h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
