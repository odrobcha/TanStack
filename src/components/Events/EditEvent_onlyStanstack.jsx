import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, queryClient, updateEvent } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import { toFormData } from 'axios';

export default function EditEvent_onlyStanstack () {
    const params = useParams();
    const { data, isPending,isError, error } = useQuery({
        queryKey: ['events', params.id],
        queryFn: ({ signal }) => fetchEvent({ signal, id: params.id })
    });

    const { mutate: editMutate } = useMutation({
        mutationFn: updateEvent,
      onMutate: async(data)=>{  //executes onMutate,before waiting the response , data - the same data passed to mutation
        const newEvent = data.event;
        await queryClient.cancelQueries({queryKey:['events', params.id]})  //to cancel all running Queries trigered by use query

        const previousEvent = queryClient.getQueryData(['events', params.id]); // to save the old data, in case of error in event
        queryClient.setQueriesData(['events', params.id], newEvent)  //currently stored/cashed data. Needs2 argwement - queryKey, 2. newData
        return {previousEvent}  //to send data as context to onError func
      },
      onError: (error, data, context) =>{   //executes in caseof Error in mutation, obtain 3 arguments, error on mutation, datathatwassent by mutation and context
        queryClient.setQueriesData(['events', params.id], context.previousEvent);
      },
      onSettled : ()=>{    //func that executes when mutation finished - successfully or with error
        queryClient.cancelQueries({queryKey:['events', params.id]}); // to ensure en refetch needed data
      }


    });

    const navigate = useNavigate();

    function handleSubmit (formData) {
        editMutate({ id: params.id, event: formData });
        navigate('../');
    }

    function handleClose () {
        navigate('../');
    }

    let content;

    if (isPending) {
        content = <div className="center"><LoadingIndicator/></div>;
    }

    if (isError) {
        content = <>
            <ErrorBlock title="Failed to load event" message={error.info?.message || 'Try again later'}/>
            <div className="form-actions">
                <Link to="../" className="button">Ok</Link>
            </div>
        </>;
    }

    if (data) {
        content =
          <EventForm inputData={data} onSubmit={handleSubmit}>
              <Link to="../" className="button-text">
                  Cancel
              </Link>
              <button type="submit" className="button">
                  Update
              </button>
          </EventForm>;
    }

    return (
      <Modal onClose={handleClose}>
          {content}
      </Modal>
    );
}

