import HomeButton from "../components/HomeButton"
import { Navigate, useNavigate } from "react-router-dom";
import DrawingArea from "../components/DrawingArea";
import NormalButton from "../components/NormalButton";
import Prompt from "../components/Prompt";
import getHeight from "../utils/functions";

function Home() {

    const navigate = useNavigate();

    const relativeSize = 8;
    const height = getHeight(1, relativeSize);
    const endRoute = '/name';

    function onButtonClick() {
        const url = new URL(window.location.href);
        navigate(endRoute, {state: {id: url.searchParams.get('id')}});
    };

    return <div>
        <Prompt text='Welcome to Borderless' relativeSize={relativeSize} height={height}/>
        {/* <HomeButton onClickFunc={onButtonClick} endRoute="/Lights" text="Lights" imageSrc="light-png.png" imageAlt="templogo" width={100} height={100}/>
        <HomeButton onClickFunc={onButtonClick} endRoute="/Sounds" text="Sounds" imageSrc="sound-png.png" imageAlt="templogo" width={100} height={100}/> */}
        <NormalButton text='Start' onClickFunc={onButtonClick} />
    </div>;
}

export default Home;
