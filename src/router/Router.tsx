import { lazy, Suspense } from 'react';
import { createHashRouter } from 'react-router-dom';
import Root from './Root';
import FullscreenLoader from '../components/spinner/FullscreenLoader';

const Index = lazy(() => import('../pages/Index'));
const Notifications = lazy(() => import('../pages/Notifications'));
const Brightevents = lazy(() => import('../pages/Brightevents'));
const Myparticipations = lazy(() => import('../pages/Myparticipations'));
const Myrequests = lazy(() => import('../pages/Myrequests'));
const DeclinedRequests = lazy(() => import('../pages/DeclinedRequests'));
const CreateEvent = lazy(() => import('../pages/CreateEvent'));
const UpdateEvent = lazy(() => import('../pages/UpdateEvent'));
const BrightEventDetail = lazy(() => import('../pages/BrightEventDetail'));

const BrightPolls = lazy(() => import('../pages/BrightPolls'));
const MyPolls = lazy(() => import('../pages/MyPolls'));
const CreatePoll = lazy(() => import('../pages/CreatePoll'));
const UpdatePoll = lazy(() => import('../pages/UpdatePoll'));
const BrightPollsDetail = lazy(() => import('../pages/BrightPollsDetail'));

const Admin = lazy(() => import('../pages/Admin'));
const AdminPolls = lazy(() => import('../pages/AdminPolls'));
const AdminEvents = lazy(() => import('../pages/AdminEvents'));
const AdminUsers = lazy(() => import('../pages/AdminUsers'));

const NotFound = lazy(() => import('../pages/404'));

const withLoader = (Component: React.FC, content = 'Loading...') => (
  <Suspense fallback={<FullscreenLoader content={content} />}>
    <Component />
  </Suspense>
);

export const Router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '', element: withLoader(Index, 'Loading home...') },
      { path: '/notifications', element: withLoader(Notifications, 'Loading notifications...') },
      { path: '/brightevents', element: withLoader(Brightevents, 'Loading events...') },
      { path: '/brightevents/participation', element: withLoader(Myparticipations, 'Loading your participations...') },
      { path: '/brightevents/requests', element: withLoader(Myrequests, 'Loading your requests...') },
      { path: '/brightevents/requests/declined', element: withLoader(DeclinedRequests, 'Loading declined requests...') },
      { path: '/brightevents/requests/new', element: withLoader(CreateEvent, 'Opening event creation...') },
      { path: '/brightevents/requests/update/:id', element: withLoader(UpdateEvent, 'Opening event for update...') },
      { path: '/brightevents/:id', element: withLoader(BrightEventDetail, 'Loading event details...') },

      { path: '/brightpolls', element: withLoader(BrightPolls, 'Loading polls...') },
      { path: '/brightpolls/my-polls', element: withLoader(MyPolls, 'Loading your polls...') },
      { path: '/brightpolls/requests/new', element: withLoader(CreatePoll, 'Opening poll creation...') },
      { path: '/brightpolls/requests/update/:id', element: withLoader(UpdatePoll, 'Opening poll for update...') },
      { path: '/brightpolls/:id', element: withLoader(BrightPollsDetail, 'Loading poll details...') },

      { path: '/brightadmin', element: withLoader(Admin, 'Loading admin dashboard...') },
      { path: '/brightadmin/polls', element: withLoader(AdminPolls, 'Loading admin polls...') },
      { path: '/brightadmin/events', element: withLoader(AdminEvents, 'Loading admin events...') },
      { path: '/brightadmin/users', element: withLoader(AdminUsers, 'Loading admin users...') },

      { path: '/not-found', element: withLoader(NotFound, 'Page not found...') },
      { path: '*', element: withLoader(NotFound, 'Page not found...') }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

export default Router;