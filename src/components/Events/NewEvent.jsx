import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query'; //useMutation is used to POST request and it send NOT automatically request when component is created
import { createNewEvent } from '../../util/http';
import ErrorBlock from '../UI/ErrorBlock';
import { queryClient } from '../../util/http';

export default function NewEvent () {
    const navigate = useNavigate();

    const { mutate, isPending, isError, error } = useMutation({ //mutate is the function, which can be called everywhere to send request
        //mutationKey: ,
        mutationFn: createNewEvent,
        onSuccess: () => {
            queryClient.invalidateQueries(  // is used to invalidate, which has mentioned queryKey the queries and fetch all the data needed on page which is on the screen
              {
                  queryKey: ['events']   // exact: true need to be added in case we need to fetch EXACTLY only queryKey = ['events']
              }
            );
            navigate('/events');
        }

    });

    function handleSubmit (formData) {
        mutate({ event: formData });
        //navigate('/events')
    }

    return (
      <Modal onClose={() => navigate('../')}>
          <EventForm onSubmit={handleSubmit}>
              {isPending && 'Submitting..'}
              {!isPending && (
                <>
                    <Link to="../" className="button-text">
                        Cancel
                    </Link>
                    <button type="submit" className="button">
                        Create
                    </button>
                </>
              )}

          </EventForm>

          {isError && <ErrorBlock title="Failed to create event"
                                  message={error.info?.message || 'Failed to create event. Check your input'}/>}
      </Modal>
    );
}
