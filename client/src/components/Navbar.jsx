import React from 'react';
import Button from './Button'

const Navbar = () => {
    return (
        <div className="absolute top-0 inset-x-0 w-full min-h-5 bg-green-500 flex justify-start items-center align gap-8 text-black p-1">
            
           
            <a href="https://http.cat">Cats!</a>
            <a href="https://http.cat">Cats!</a>
            <a href="https://http.cat">Cats!</a>
            <a href="https://http.cat">Cats!</a>

            <Button buttonName="click me mf"/>

        </div>
    );
};

export default Navbar;