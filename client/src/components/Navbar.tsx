import Button from './Button'

const Navbar = () => {
    return (
        <div className="absolute top-0 inset-x-0 w-full min-h-5 bg-primary flex justify-start items-center align gap-8 text-black p-1">
            
           <input type='text' placeholder='Search auto service...' className='ml-10 border-2 border-solid rounded-md'/>

            <Button buttonName="Home" route='/home'/>
            <Button buttonName="" route='/'/>

        </div>
    );
};

export default Navbar;