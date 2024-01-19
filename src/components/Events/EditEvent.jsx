import { Link, useNavigate, useParams, redirect, useSubmit, useNavigation } from 'react-router-dom';
import { useQuery, /*useMutation*/ } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, queryClient, updateEvent } from '../../util/http';
import ErrorBlock from '../UI/ErrorBlock';

export default function EditEvent () {
    const { state } = useNavigation();
    const submit = useSubmit();
    const params = useParams();
    const { data, isError, error } = useQuery({
        queryKey: ['events', params.id],
        queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
        staleTime: 10000 //to make sure that the data is cashed
    });

    // const { mutate: editMutate } = useMutation({
    //     mutationFn: updateEvent,
    //     onMutate: async(data)=>{  //executes onMutate,before waiting the response , data - the same data passed to mutation
    //         const newEvent = data.event;
    //         await queryClient.cancelQueries({queryKey:['events', params.id]})  //to cancel all running Queries trigered by use query
    //
    //         const previousEvent = queryClient.getQueryData(['events', params.id]); // to save the old data, in case of error in event
    //         queryClient.setQueriesData(['events', params.id], newEvent)  //currently stored/cashed data. Needs2 argwement - queryKey, 2. newData
    //         return {previousEvent}  //to send data as context to onError func
    //     },
    //     onError: (error, data, context) =>{   //executes in caseof Error in mutation, obtain 3 arguments, error on mutation, datathatwassent by mutation and context
    //         queryClient.setQueriesData(['events', params.id], context.previousEvent);
    //     },
    //     onSettled : ()=>{    //func that executes when mutation finished - successfully or with error
    //         queryClient.cancelQueries({queryKey:['events', params.id]}); // to ensure en refetch needed data
    //     }
    //
    //
    // });

    const navigate = useNavigate();

    function handleSubmit (formData) {
        submit(formData, { method: 'PUT' });
    }

    function handleClose () {
        navigate('../');
    }

    let content;

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


              {state === 'submitting' ? <p>Updating...</p> : <>
                  <Link to="../" className="button-text">
                      Cancel
                  </Link>
                  <button type="submit" className="button">
                      Update
                  </button>
              </>

              }

          </EventForm>;
    }

    return (
      <Modal onClose={handleClose}>
          {content}
      </Modal>
    );
}

export function loader ({ params }) {
    return queryClient.fetchQuery({
        queryKey: ['events', params.id],
        queryFn: ({ signal }) => fetchEvent({ signal, id: params.id })
    });
}

export async function action ({ request, params }) {
    const formData = await request.formData();
    const updatedEventData = Object.fromEntries(formData);

    await updateEvent({ id: params.id, event: updatedEventData });
    await queryClient.invalidateQueries(['events']);
    return redirect('../');
}
