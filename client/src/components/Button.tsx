import { useNavigate } from "react-router";

type ButtonProps = {
    buttonName?: string;
    route?: string;
}

const Button: React.FC<ButtonProps> = ({ buttonName, route }) => {

    const navigate = useNavigate();

    const handleOnClick = () => {

        if(route) {
             navigate(route);
        } else {
            alert(`You clicked the ${buttonName} button and there is no route defined on it yet!`);
        }
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