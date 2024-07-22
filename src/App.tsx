import "./App.css";

import ItemList from "./components/ItemList";
import Toolbar from "./components/Toolbar";

import Canvas from "./components/canvas/Canvas";

function App() {
    return (
        <div className="flex flex-row h-full bg-gray-200">
            <Toolbar />
            <ItemList />
            <Canvas />
        </div>
    );
}

export default App;
