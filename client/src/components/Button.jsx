import React from "react";

const Button = ({ buttonName }) => {

    const handleOnClick = () => {
        alert("You clicked me!");
    }

    return (
        <>
            <button className="min-w-4 min-h-3 bg-blue-500 text-white p-1"
            onClick={handleOnClick}
            >
                {buttonName || "Default Button"}
            </button>
        </>
    )
}

export default Button