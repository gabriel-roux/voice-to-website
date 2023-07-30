import { PlusCircle } from "@phosphor-icons/react";
import { useState } from "react";

export function Sidebar() {


    return (
        <div
            className={`fixed top-0 left-0 w-80 h-screen bg-indigo-900 transition-all duration-300'-translate-x-64`}
        >
            <button
                className="absolute top-4 right-4 text-white"
            >
                Close
            </button>
        </div>
    );
}