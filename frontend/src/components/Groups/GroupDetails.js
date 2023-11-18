import React from "react";
import { useParams } from "react-router-dom";
import { getGroupDetails, getNumberEvents } from "../../store/groups";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useHistory} from 'react-router-dom'
import { groupDeleteFetch } from "../../store/groups";
import OpenModalButton from "../OpenModalButton";


const GroupDetails = () => {
  const user = useSelector(state => state.session.user)
  const history = useHistory()
  const { groupId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const group = useSelector((state) => state.groups.currGroup);
  const dispatch = useDispatch();
  const events = useSelector((state) => state.groups.Events);

  const isOrganizer = user?.id===group.organizerId?true:false

  useEffect(() => {
    dispatch(getGroupDetails(groupId))
      .then(() => dispatch(getNumberEvents(groupId)))
      .then(() => setIsLoading(false));
  }, [dispatch, groupId]);

  const handleStatus = (status) => (status === true ? "Private" : "Public");

  const compare = (a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;
    return dateA > dateB ? dateA : dateB;
  };

  const handleButton = () => {
    alert("Feature Coming Soon...");
  };

  const handleCreateEvent = () =>{
    history.push(`/groups/${groupId}/events/new`)
  }

  const handleUpdateGroup = () =>{
    history.push(`/groups/${groupId}/edit`)
  }

  const handleDelete = () =>{
    dispatch(groupDeleteFetch(groupId))
    history.push("/groups")
  }


  if (!isLoading) {
    return (
      <>
        <Link to={`/groups`}>
          <h5>Groups</h5>
        </Link>
        <img src={group.GroupImages[0]?.url} />
        <div className="li-contents-flex">
          <div>
            <h2>{group.name}</h2>
          </div>
        </div>
        <div>
          <h4>{group.city}</h4>
        </div>
        <div>{events.length} events</div>
        <div>{handleStatus(group.Private)}</div>
        <div>
          {" "}
          Organized By {group.Organizer.firstName} {group.Organizer.lastName}
        </div>
        {(!isOrganizer)&&(
        <div>
          <button onClick={handleButton}>Join this group</button>
        </div>)}
        {(isOrganizer)&&(
        <div>
          <button onClick={handleCreateEvent}>Create event</button>
          <button onClick={handleUpdateGroup}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>)}
        <div className="EventsPart">
          <div>
            <h3>Organizer</h3>
          </div>
          <div>
            {group.Organizer.firstName} {group.Organizer.lastName}
          </div>
          <div>
            <h4>What we're about</h4>
          </div>
          <div>
            <p>{group.about}</p>
          </div>
          <div>
            {events.filter((event) =>new Date(event.endDate) > new Date()).length > 0 && (
              <>
                <div>
                  Upcoming Events (
                  {events.filter((event) => event.endDate < Date()).length})
                </div>
                <div className="upcomingEvents">
                  {events
                    .sort(compare)
                    .reverse()
                    .map((event) => {
                      if (event.endDate < Date()) {
                        return (
                          <div className="groupEvent" id={event.id}>
                            <div>
                              <img
                                src={event.previewImage}
                                alt="event preview"
                              ></img>
                            </div>
                            <div>
                              {event.startDate.split("T")[0]} {"\u00b7"}{" "}
                              {event.startDate.split("T")[1].split(".")[0]}
                            </div>
                            <div>{event.name}</div>
                            <div>
                              {event.Venue.city}, {event.Venue.state}
                            </div>
                            <div>
                              <p>{event.description}</p>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </>
            )}
          </div>
          <div className="ifPast">
            {events.filter((event) => new Date(event.endDate) < new Date())
              .length > 0 && (
              <>
                <div>
                  Past Events (
                  {
                    events.filter(
                      (event) => new Date(event.endDate) < new Date()
                    ).length
                  }
                  )
                </div>

                <div className="pastEvents">
                  {events
                  .filter((event) => new Date(event.endDate) > new Date())
                  .sort(compare)
                  .reverse()
                  .map((event) => (
                      <div className="groupEvent" id={event.id} key={event.id}>
                        <div>
                          <img src={event.previewImage} alt="event preview" />
                        </div>
                        <div>
                          {event.startDate.split("T")[0]} {"\u00b7"}{" "}
                          {event.startDate.split("T")[1].split(".")[0]}
                        </div>
                        <div>{event.name}</div>
                        <div>
                          {event.Venue.city}, {event.Venue.state}
                        </div>
                        <div>
                          <p>{event.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default GroupDetails;
