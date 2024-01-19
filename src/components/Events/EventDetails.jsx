import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Header from '../Header.jsx';
import { fetchEvent, deleteEvent, queryClient } from '../../util/http';
import { useParams } from 'react-router-dom';
import ErrorBlock from '../UI/ErrorBlock';
import LoadingIndicator from '../UI/LoadingIndicator';
import Modal from '../UI/Modal';

export default function EventDetails () {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['event', { id: id }],
        queryFn: ({ signal }) => fetchEvent({ signal, id }),
    });

    const { mutate, isPending: deleteIsPending, isError: deleteIsError, error: deleteError } = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries(  // is used to invalidate, which has mentioned queryKey the queries and fetch all the data needed on page which is on the screen
              {
                  queryKey: ['events'],  // exact: true need to be added in case we need to fetch EXACTLY only queryKey = ['events']
                  refetchType: 'none'   //to invalidate the fetching this data after execution
              }
            );
            navigate('/events');
        }
    });

    const handleStartDelete = () => {
        setIsDeleting(true);
    };
    const handleStopDelete = () => {
        setIsDeleting(false);
    };

    const deleteEventHandler = () => {

        mutate({ id: id });
    };

    let content;
    if (isError) {
        content =
          <ErrorBlock title="Failed to fetch the data" message={error.info?.message || 'Sorry something went wrong'}/>;
    }

    if (isPending) {
        content = <LoadingIndicator/>;
    }

    if (data) {
        content =
          <>
              <header>
                  <h1>{data.title}</h1>
                  <nav>
                      <button onClick={handleStartDelete}>Delete</button>
                      <Link to="edit">Edit</Link>
                  </nav>
              </header>
              <div id="event-details-content">
                  <img src={`http://localhost:3000/${data.image}`} alt=""/>

                  <div id="event-details-info">
                      <div>
                          <p id="event-details-location">{data.location}</p>
                          <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} - {data.time}</time>
                      </div>
                      <p id="event-details-description">{data.description}</p>
                  </div>
              </div>
          </>;

    }

    return (
      <>
          {isDeleting &&
          <Modal onClose={handleStopDelete}>
              <h2>Are you sure</h2>
              <p>You will delete this event</p>
              <div className="form-actions">
                {deleteIsPending && <p>Is deleting...</p>}
                {!deleteIsPending && (
                  <>
                    <button onClick={handleStopDelete} className="button-text">Cancel</button>
                    <button onClick={deleteEventHandler} className='button'>Delete</button>
                  </>
                )}

              </div>
            {deleteIsError && <p>Something went wrong...</p>}
          </Modal>
          }
          <Outlet/>
          <Header>
              <Link to="/events" className="nav-item">
                  View all Events
              </Link>
          </Header>

          <article id="event-details">
              {content}
          </article>
          ;

      </>
    );
}
