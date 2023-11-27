import { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { csrfFetch } from "../../store/csrf"
import { useReducer } from "react"
import { updateGroupMaker } from "../../store/groups"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { getGroupDetails } from "../../store/groups"
import { useSelector } from "react-redux"


const GroupUpdate = ()=>{
    const dispatch=useDispatch()
    const group = useSelector((state) => state.groups.currGroup);
    const {groupId} = useParams()
    const [location, setLocation] = useState('')
    const [name, setName] = useState()
    const [description, setDescription] = useState('')
    const [type, setType] = useState(group.type)
    const [status, setStatus] = useState(group.private===true?true:false)
    const [errors, setErrors]=useState({})
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);




    const handleSubmit =async (e) => {
        e.preventDefault()
       validate()
    //    console.log("errors",errors)
       function handleClick() {
        forceUpdate();
    }
    handleClick()
       if (!Object.values(errors).length) {
        const cityState = location.split(',')
        console.log("groupId",groupId)
        const payload = {
                        id:groupId,
                        name,
                        about:description,
                        type,
                        Private:status,
                        city: cityState[0].trim(),
                        state: cityState[1].trim(),
                        }
        console.log(payload)

        let group = await dispatch(updateGroupMaker(payload,groupId))

            history.push(`/groups/${group.id}`)
      }
    }

    useEffect(() => {
      dispatch(getGroupDetails(groupId))
        .then(() => setIsLoading(false));
    }, [dispatch, groupId]);

    const handleLocation = (e) => setLocation(e.target.value)
    const handleName = (e) => setName(e.target.value)
    const handleDescription = (e) => setDescription(e.target.value)
    const handleType = (e) => setType(e.target.value)
    const handleStatus = (e) => setStatus(e.target.value)


    const validate = ()=>{
        if(name.length<1) {errors.name = "Name is required"}
        if(!location) errors.location=("Location is required")
        if(description.length<30)  errors.desc="Description must be at least 30 characters long"
        if(!type) errors.type=("Group Type is required")
        if(!status) errors.status=("Visibility Type is required")

        console.log(errors)
        setErrors(errors)}

  // const populate=()=>{
  //   setName(group.name)
  // }

  if(!isLoading){
    return(
        <>
        {/* {populate()} */}
        <form
        className="CreateGroup"
        onSubmit={handleSubmit}>
        <div className="groupIntro">
        <h4>BECOME AN ORGANIZER</h4>
        <h3>We'll walk you through a few steps to your group's information</h3>
        <hr className='solid'/>
        <h3>First, set your group's location.</h3>
        <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
        </div>
        <div className="inputName">

        <input
            type="text"
            name="location"
            onChange={handleLocation}
            defaultValue={`${group.city},${group.state}`}
            // placeholder="City, State"
        />
        {errors.location&&
          <p className="errors">
        {errors.location}
      </p>}
        </div>
        <div className="inputName">
        <hr className='solid'/>
        <h3>What will your group's name be?</h3>
        <p>Choose a name that will give people a clear idea of what the group is about. Feel Free to get creative! You can edit this later if you change your mind.</p>
        <input
            type="text"
            name="Name"
            onChange={handleName}
           defaultValue={group.name}
        />
          {(errors.name)&&(
          <p className="errors">
        {errors.name}
      </p>)}
        </div>
        <div className="inputDescription">
        <hr className='solid'/>
        <h3>Now describe what your group will be about</h3>
        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
        <ol>
            <li>Whats the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
        </ol>
        <input
            type="text"
            name="description"
            onChange={handleDescription}
            // placeholder="Please write at least 30 characters"
            defaultValue={group.about}
        />
        {(errors.desc)&&(
          <p className="errors">
        {errors.desc}
      </p>)}
        </div>
        <div>
            <hr className='solid'/>
            <h3>Final steps...</h3>
            <p>Is this an in person or online group?</p>
        <select
        defaultValue={group.type}
        placeholder={group.type}
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
            <p>Is this group private or public?</p>
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

        <hr className="solid" />
        <button
        type="submit"
        onClick={handleSubmit}
        disabled={Object.values(errors).length>0}
        >Update Group</button>
        </form>
        </>
    )
}}

export default GroupUpdate
