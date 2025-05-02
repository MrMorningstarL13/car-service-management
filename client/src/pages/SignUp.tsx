
export default function SignUp() {

    const handleSubmitClick = () => {
        alert('ma-ta dreacu\'')
    }

    return (
        <main className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
            <div className="bg-primary rounded-xl p-4">
                <div className="flex flex-col">
                    <label className="text-black">First name</label>
                    <input type="text" placeholder="type email here" className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"/>
                    <label className="text-black">Last name</label>
                    <input type="text" placeholder="type email here" className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"/>
                    <label className="text-black">Email</label>
                    <input type="text" placeholder="type email here" className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"/>
                    <label className="text-black">Password</label>
                    <input type="text" placeholder="type email here" className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"/>
                </div>
                <button onClick={handleSubmitClick}>Submit</button>

            </div>
        </main>
    )
}