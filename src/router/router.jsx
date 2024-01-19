import {
    Navigate,
    createBrowserRouter,
} from 'react-router-dom';
import Events from '../components/Events/Events.jsx';
import EventDetails from '../components/Events/EventDetails.jsx';
import NewEvent from '../components/Events/NewEvent.jsx';
import EditEvent, {loader as eventLoader, action as editEventAction} from '../components/Events/EditEvent.jsx';



const router = createBrowserRouter([
    {
        path: '/',
        element: <Events/>,
    },
    {
        path: '/events',
        element: <Events/>,

        children: [
            {
                path: '/events/new',
                element: <NewEvent/>,
            },
        ],
    },
    {
        path: '/events/:id',
        element: <EventDetails/>,
        children: [
            {
                path: '/events/:id/edit',
                element: <EditEvent/>,
                loader: eventLoader,
                action : editEventAction,

            },
        ],
    },
]);

export default router;
