import { Link } from "react-router-dom";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";

const groupLink = ({group})=>{
    const dispatch= useDispatch()
    if(group.private) {const groupStatus = 'Private'}
    if(!group.private) {const groupStatus = 'Public'}

    return(
        <>
        <h1>Hello from GroupLink{group.id}</h1>
        </>
    )
}
export default groupLink
