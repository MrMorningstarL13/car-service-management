import Button from './Button'

const Navbar = () => {
    return (
        <div className="absolute top-0 inset-x-0 w-full min-h-5 bg-green-500 flex justify-start items-center align gap-8 text-black p-1">
            
           <input type='text' placeholder='Search auto service...' className='ml-10 border-2 border-solid rounded-md'/>
            <a href="https://http.cat" target='blank'>Cats!</a>

            <Button buttonName="Home" route='/home'/>
            <Button buttonName="" route='/'/>

        </div>
    );
};

export default Navbar;