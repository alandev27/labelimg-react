import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import Item from "./Item";
import ItemGroup from "./ItemGroup";
import {
    labelPoly,
    labelRect,
    nameImage,
    openImage,
    removeImage,
    removePoly,
    removeRect,
} from "../store/appSlice";

export default function ItemList() {
    const canvas = useSelector((state: RootState) => state.app.canvas);
    const app = useSelector((state: RootState) => state.app);

    const dispatch = useDispatch();

    return (
        <div className="bg-white flex flex-col border border-gray-200 w-[17rem] shrink-0">
            <ItemGroup title="Labels">
                {canvas.rects.map((rect, i) => (
                    <Item
                        key={i}
                        index={i}
                        active={false}
                        onOpen={() => {}}
                        onEdit={(index, value) =>
                            dispatch(
                                labelRect({
                                    index,
                                    label: value,
                                }),
                            )
                        }
                        onRemove={(index) => {
                            dispatch(removeRect(index));
                        }}
                    >
                        {rect.label}
                    </Item>
                ))}
            </ItemGroup>

            <ItemGroup title="Polygons">
                {canvas.poly.map((poly, i) => (
                    <Item
                        key={i}
                        index={i}
                        active={false}
                        onOpen={() => {}}
                        onEdit={(index, value) =>
                            dispatch(
                                labelPoly({
                                    index,
                                    label: value,
                                }),
                            )
                        }
                        onRemove={(index) => {
                            dispatch(removePoly(index));
                        }}
                    >
                        {poly.label}
                    </Item>
                ))}
            </ItemGroup>
            <ItemGroup title="Images">
                {app.images.map((image, i) => (
                    <Item
                        key={i}
                        index={i}
                        onOpen={(index) => dispatch(openImage(index))}
                        onEdit={(index, value) =>
                            dispatch(
                                nameImage({
                                    index,
                                    name: value,
                                }),
                            )
                        }
                        onRemove={(index) => {
                            dispatch(removeImage(index));
                        }}
                        active={i == app.opened}
                    >
                        {image.name}
                    </Item>
                ))}
            </ItemGroup>
        </div>
    );
}
