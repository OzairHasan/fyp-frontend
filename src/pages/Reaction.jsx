import HomeButton from "../components/HomeButton"
import { Navigate, useNavigate } from "react-router-dom";
import DrawingArea from "../components/DrawingArea";
import NormalButton from "../components/NormalButton";
import Prompt from "../components/Prompt";
import { useRef, useState, useEffect } from 'react';
import EmojiPicker from "emoji-picker-react";
import TimedButton from "../components/TimedButton";
import { changeAuthStateRender, changeAuthStateRenderReaction, getHeight } from "../utils/functions";
import WaitingScreen from "../components/WaitingScreen";
import InProgressScreen from "../components/InProgessScreen";
import BACKEND_LINK from "../links";

function Reaction() {

    const navigate = useNavigate();

    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    const [isFinishedWaiting, setIsFinishedWaiting] = useState(false);
    const [waiting, setWaiting] = useState(false); // false indiciates no access, true indicates waiting
    const [isTimerStart, setIsTimerStart] = useState(false);

    const timeGiven = 30;

    const [time, setTime] = useState(timeGiven);
    const [isFinishedTimeOut, setIsFinishedTimeOut] = useState(false);
    const [isEmoji, setIsEmoji] = useState(false);

    const [timedButtonColor, setTimedButtonColor] = useState('gray')

    const promptRelativeSize = 4;
    const endRoute = '/guessDrawing'

    const state = 5;

    useEffect(() => 
    {
        const reactionTimerInterval = setInterval(() => 
        {
            if (isFinishedWaiting) {
                return;
            }
            fetch(BACKEND_LINK + '/authState' + '?state=' + String(state), {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(response => {
                // if no issues
                changeAuthStateRenderReaction(response, setIsFinishedWaiting, setWaiting, setIsTimerStart);
            })
            .catch(error => {
                console.error(error);
            });
        }
        , 1000);

        return () => clearInterval(reactionTimerInterval);
    }, [isFinishedWaiting, waiting]);
    
    useEffect(() => 
    {
        const timerInterval = setInterval(() => 
        {
            if (isFinishedTimeOut) {
                return;
            }
            if (!isTimerStart) {
                return;
            }
            setTime(time => time - 1);
            console.log(time)
            if (time == 0) {
                setIsFinishedTimeOut(true);
                setTimedButtonColor('pink');
            }
        }
        , 1000);

        return () => clearInterval(timerInterval);
    }, [time, isFinishedTimeOut, isTimerStart]);


    function onEmojiButtonClick() {
        setIsEmoji(true);
    };

    function onTimedButtonClick() {
        if (!isFinishedTimeOut) {
            return;
        }

        navigate(endRoute);
        
    };

    function onEmojiClick(emojiData) {
        console.log(emojiData);
        const data = { emoji: emojiData.emoji };

        // fetch post to server emoji data
        fetch(BACKEND_LINK + '/emoji', {
            method: 'POST',
            body: JSON.stringify(data),
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
    }

    if (isFinishedWaiting) {
        if (isEmoji){
            return <div>
                <EmojiPicker onEmojiClick={onEmojiClick} left='35vw' top='70vh'/>
                <TimedButton radius='5px' fonttest="font-link" leftInnerText='0vw' topInnerText='2.5vh' text='Advance' time={time} onClickFunc={onTimedButtonClick} height= '8vh' width= '30vw' left='35vw' top='70vh' color={timedButtonColor}/>
            </div>
        } else {
            return <div>
                <Prompt fonttest="font-link-Heading" text={'Yay!\nDo you see your drawing on the mirror?'} relativeSize={promptRelativeSize} height={getHeight(1, promptRelativeSize)} width='80vw' left='10vw' top='10vh'/>
                <Prompt fonttest="font-link-Heading" text={'React to the other user\'s drawing! Feel free to use gestures and facial expressions'} relativeSize={promptRelativeSize} height={getHeight(1, promptRelativeSize)} width='80vw' left='10vw' top='30vh'/>
                {/* <HomeButton onClickFunc={onButtonClick} endRoute="/Lights" text="Lights" imageSrc="light-png.png" imageAlt="templogo" width={100} height={100}/>
                <HomeButton onClickFunc={onButtonClick} endRoute="/Sounds" text="Sounds" imageSrc="sound-png.png" imageAlt="templogo" width={100} height={100}/> */}
                <NormalButton fonttest="font-link" className='btn btn-warning' text='Choose an emoji' onClickFunc={onEmojiButtonClick} width='15vw' left='43vw' top='55vh' />
                <TimedButton radius='5px' fonttest="font-link" leftInnerText='0vw' topInnerText='2.5vh' text='Advance' time={time} onClickFunc={onTimedButtonClick} height= '8vh' width= '30vw' left='35vw' top='70vh' color={timedButtonColor}/>
            </div>;
        }

    } else {

        if (waiting) {
            return <WaitingScreen />;
        } else {
            return <InProgressScreen />;
        }

    }
}

export default Reaction;