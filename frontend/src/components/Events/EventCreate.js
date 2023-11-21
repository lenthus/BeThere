import React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import {useHistory} from 'react-router-dom'
import { useReducer } from "react"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { getGroupDetails } from "../../store/groups"
import { createEventMaker } from "../../store/events"
import { createEventImageMaker } from "../../store/events"




const EventCreate = () =>{
    const dispatch=useDispatch()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [img, setImg] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [price, setPrice] = useState('')
    const [venue, setVenue] = useState('')
    const [errors, setErrors]=useState({})
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const {groupId}=useParams()
    console.log("groupId",groupId)
    const imgTypes = ["png","jpg","jpeg"]

    useEffect(() => {
        dispatch(getGroupDetails(groupId))
          .then(() => setIsLoading(false));
      }, [dispatch, groupId]);


    const imgCheck = (img)=>{
        let isTrue =null
        for (const type of imgTypes){
            if (img.includes(type)) isTrue=true
        }
        return isTrue
    }

    const validate = ()=>{
        if(name.length<1) {errors.name = "Name is required"}
        if(description.length<30)  errors.description="Description must be at least 30 characters long"
        if(!type) errors.type=("Event Type is required")
        if(!startDate) errors.startDate=("Event start is required")
        if(!endDate) errors.endDate=("Event end is required")
        if(!status) errors.status=("Visibility is required")
        if(!imgCheck(img)) errors.img=("Image Url must end in .png, .jpg, .jpg, or .jpeg")
        console.log(errors)
        setErrors(errors)}



    const handleStartDate = (e) => setStartDate(e.target.value)
    const handleEndDate = (e) => setEndDate(e.target.value)
    const handleName = (e) => setName(e.target.value)
    const handleDescription = (e) => setDescription(e.target.value)
    const handleType = (e) => setType(e.target.value)
    const handleStatus = (e) => setStatus(e.target.value)
    const handleImg = (e) => setImg(e.target.value)
    const handlePrice = (e) => setPrice(e.target.value)
    const handleVenue = (e) => setVenue(e.target.value)

    const handleSubmit =async (e) => {
        e.preventDefault()
       validate()
    //    console.log("errors",errors)
       function handleClick() {
        forceUpdate();
    }
    handleClick()
       if (!Object.values(errors).length) {
        const payload = {

                        name,
                        venueId:venue,
                        description:description,
                        type,
                        price,
                        startDate,
                        endDate,
                        capacity:7
                        }

        const imgUrl = {
            url:img,
            preview: true
        }
        console.log("img",imgUrl)
        console.log("payload",payload)
        let event = await dispatch(createEventMaker(group.id,payload))
        console.log("event return",event)
        if (event.id){
            console.log("group-img",group)
            await dispatch(createEventImageMaker(event.id,imgUrl))
            history.push(`/groups/${group.id}`)
        }
      }
    }

    const group = useSelector((state) => state.groups.currGroup);

    if (!isLoading) {
    return(
        <>
        <form
        className="CreateEvent"
        onSubmit={handleSubmit}>
        <div className="eventIntro">
        <p>What is the name of your event?</p>
        </div>
        <div className="inputName">
        <input
            type="text"
            name="name"
            onChange={handleName}
            placeholder="Event Name"
        />
        {errors.name&&
          <p className="errors">
        {errors.name}
      </p>}
        </div>
        <hr className='solid'/>
        <div>
            <p>Is this an in person or online event?</p>
        <select
        onChange={handleType}
        value={type}
        >
            <option
            value=""
            disabled={true}
            >(Select One)
            </option>
            <option
              value="Online"
            >Online
            </option>
            <option
              value="In person"
            >In Person
            </option>
        </select>
        {(errors.type)&&(
          <p className="errors">
        {errors.type}
      </p>)}
        </div>
        <div>
            <p>Is this event private or public?</p>
        <select
        onChange={handleStatus}
        value={status}
        >
            <option
            value=""
            disabled={true}
            >(Select One)
            </option>
            <option
              value={true}
            >Private
            </option>
            <option
              value={false}
            >Public
            </option>
        </select>
        {(errors.status)&&(
          <p className="errors">
        {errors.status}
      </p>)}
        </div>
        <div>
            <p>Select a Venue for the Event</p>
        <select
        onChange={handleVenue}
        value={venue}
        > <option
        value={""}
        >Select Venue</option>
            {group.Venues.map((venue)=>{
            console.log(venue)
            return(
                <option
              value={venue.id}
            >{venue.address}
            </option>
            )
        })}
        </select>
        </div>
        <div className="inputPrice">
        <p>What is the price for your event?</p>
        <input
            type="text"
            name="price"
            onChange={handlePrice}
            placeholder="0"
        />
          {(errors.price)&&(
          <p className="errors">
        {errors.price}
      </p>)}
        </div>
        <div className="inputDate">
        <hr className='solid'/>
        <p>When does your event start?</p>
        <input
            type="datetime-local"
            name="startDate"
            min={Date()}
            max={endDate}
            onChange={handleStartDate}
            placeholder="MM/DD/YYYY HH:mm PM"
        />
        {(errors.startDate)&&(
          <p className="errors">
        {errors.startDate}
      </p>)}
        </div>
        <div className="inputDate">
        <hr className='solid'/>
        <p>When does your event end?</p>
        <input
            type="datetime-local"
            name="endDate"
            min={startDate}
            max={""}
            disabled={!startDate}
            onChange={handleEndDate}
            placeholder="MM/DD/YYYY HH:mm PM"
        />
        {(errors.endDate)&&(
          <p className="errors">
        {errors.endDate}
      </p>)}
        </div>
        <div>
        <hr className="solid" />
            <p>Please add an image url for your event below:</p>
        <input
            type="text"
            name="imgUrl"
            onChange={handleImg}
            placeholder="Image Url"
        />
          {(errors.img)&&(
          <p className="errors">
        {errors.img}
      </p>)}
        </div>
        <hr className="solid" />
        <div>
        <hr className="solid" />
            <p>Please describe your event:</p>
        <input
            type="text"
            name="description"
            onChange={handleDescription}
            placeholder="Please Include at least 30 characters"
        />
          {(errors.description)&&(
          <p className="errors">
        {errors.description}
      </p>)}
        </div>
        <button
        type="submit"
        onClick={handleSubmit}
        disabled={Object.values(errors).length>0}
        >Create Event</button>
        </form>
        </>
    )
}}

export default EventCreate
