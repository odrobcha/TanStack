import React from 'react';
import {useQuery} from '@tanstack/react-query'; //useQuery used only to GET data // executes imidiately when entered the component

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import {fetchEvents} from '../../util/http.js'

export default function NewEventsSection() {

  const {data, isPending, isError, error} = useQuery({     //data - actual response that returnd queryFn; isPending - ifresponse is awating; isError - shows if request has error(queyFn has to trhow error (if thereis some); error - gives Error info
    queryKey: ['events', {max: 3}] ,    //array of identifiers
    queryFn:  ({signal , queryKey}) => fetchEvents({signal, ...queryKey[1]}),    //code which will beexecuted. shoild be function thach returns promise //to set the passing to function data as  queryKey queryKey
    staleTime:   5000,          // Time tosend new Request queryFn to refresh cached data, default 0
   // gcTime: 1000,                //GarbigeCollection time , how long thedatain thecashwill be cashed. Default 5min
  });

  //Example
  // useQuery({
  //   queryFn:  () =>
  //            axios
  //            .get(URL)
  //            .then((res)=>{res.data})
  // });


  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch events" } />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>

      </header>
      {content}
    </section>
  );
}
