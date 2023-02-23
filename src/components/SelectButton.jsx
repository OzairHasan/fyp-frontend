import Image from "./Image";

function SelectButton (props) {
    return <button onClick={() => {props.onClickFunc(props.endRoute)}}>
        <p>{props.text}</p>
        <Image src={props.imageSrc} alt={props.imageAlt} height={props.height} width={props.width}/>
    </button>
}     

export default SelectButton;