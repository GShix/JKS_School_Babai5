import { useState } from "react";

const GameZone = () => {
    const [number, setNumber] = useState<number>(0);
    const increment = () => {
        setNumber(prev => prev + 1);
    };
    const decrement = () => {
        setNumber(prev => prev - 1);
    };
  return (
    <div className="game-zone w-full h-full flex flex-col items-center justify-center p-10">
      <h1 className="font-bold text-4xl mb-5">Manipulate number</h1>
      <p className="text-blue-500 text-2xl">Current number:<span className="text-yellow-800"> {number}</span></p>
      <div className="buttons flex gap-4 mt-5">
        <button onClick={increment} className="bg-green-500 px-4 py-2 text-white rounded-md cursor-pointer">Increment</button>
        <button onClick={decrement} className="bg-red-500 px-4 py-2 text-white rounded-md cursor-pointer">Decrement</button>
      </div>
    </div>
  )
}

export default GameZone