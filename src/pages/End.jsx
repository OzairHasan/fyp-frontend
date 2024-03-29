import HomeButton from "../components/HomeButton"
import { Navigate, useNavigate } from "react-router-dom";
import DrawingArea from "../components/DrawingArea";
import NormalButton from "../components/NormalButton";
import Prompt from "../components/Prompt";
import { changeAuthRender, getHeight } from "../utils/functions";
import { useEffect, useState } from "react";
import InProgressScreen from "../components/InProgessScreen";
import BACKEND_LINK from "../links";

function End() {

    const navigate = useNavigate();

    const [isFinishedWaiting, setIsFinishedWaiting] = useState(false);

    const [desc, setDesc] = useState('');

    const relativeSize = 8;
    const height = getHeight(1, relativeSize);
    const endRoute='/home';

    const state = 9;

    useEffect(() => 
    {
        const drawTimerInterval = setInterval(() => 
        {
            if (isFinishedWaiting) {
                return;
            }
            fetch(BACKEND_LINK + '/auth' + '?state=' + String(state), {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(response => {
                changeAuthRender(response, setIsFinishedWaiting);
            })
            .catch(error => {
                console.error(error);
            });
        }
        , 1000);

        return () => clearInterval(drawTimerInterval);
    }, [isFinishedWaiting]);
    
    function onEndClick() {
        const url = new URL(window.location.href);
        // post request to reset game
        fetch(BACKEND_LINK + '/end', {
            method: 'POST',
            credentials: 'include',
            //body: 'testing',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => {
        console.log(response);
        })
        .catch(error => {
        console.error(error);
        });
        navigate(endRoute, {state: {id: url.searchParams.get('id')}});
    };

    if (true) {

        return <div>
            <Prompt fonttest="font-link" text='Thank you for playing! ' relativeSize={relativeSize} height={height} width='80vw' left='10vw' top='15vh'/>
            <NormalButton fonttest="font-link" className='btn btn-warning' text='End' onClickFunc={onEndClick}  width='20vw' left='40vw' top='45vh'/>
        </div>;

    } else {
        return <InProgressScreen />;
    }
}

export default End;