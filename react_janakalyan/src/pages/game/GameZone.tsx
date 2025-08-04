import { useState } from "react";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

const GameZone = () => {
    const [number, setNumber] = useState<number>(0);
    const increment = () => {
        setNumber(prev => prev + 1);
    };
    const decrement = () => {
        setNumber(prev => prev - 1);
    };
  return (
    <div className="game-zone w-full h-full">
        <Header/>
        <div className="gamezone flex flex-col items-center justify-center p-10">
            <h1 className="font-bold text-4xl my-10">Manipulate number</h1>
            <div className="content">
                <p className="text-black text-2xl mb-5">Current number:<span className="text-red-600"> {number}</span></p>
            </div>
            <div className="buttons flex gap-4 mt-5">
                <button onClick={increment} className="bg-green-500 px-4 py-2 text-white rounded-md cursor-pointer">Increment</button>
                <button onClick={decrement} className="bg-red-500 px-4 py-2 text-white rounded-md cursor-pointer">Decrement</button>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default GameZone