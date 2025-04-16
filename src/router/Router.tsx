import {  createHashRouter } from "react-router-dom";
import Root from "./Root";
import Index from "../pages/Index";
import Brightevents from "../pages/Brightevents";
import Myparticipations from "../pages/Myparticipations";
import BrightEventDetail from "../pages/BrightEventDetail";
import Admin from "../pages/Admin";
import NotFound from "../pages/404";
import Myrequests from "../pages/Myrequests";
import CreateEvent from "../pages/CreateEvent";
import DeclinedRequests from "../pages/DeclinedRequests";
import UpdateEvent from "../pages/UpdateEvent";
import BrightPolls from "../pages/BrightPolls";
import CreatePoll from "../pages/CreatePoll";
import BrightPollsDetail from "../pages/BrightPollsDetail";
import AdminPolls from "../pages/AdminPolls";
import AdminEvents from "../pages/AdminEvents";
import AdminUsers from "../pages/AdminUsers";
import Notifications from "../pages/Notifications";


export const Router = createHashRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '',
				element: <Index />
			},
			{
				path: '/notifications',
				element: <Notifications />
			},
			{
				path: '/brightevents',
				element: <Brightevents />
			},
			{
				path: '/admin',
				element: <Admin />
			}
			,{
				path: '/brightadmin/polls',
				element: <AdminPolls />
			},
			{
				path:'/brightadmin/events',
				element: <AdminEvents />
			},
			{
				path:'/brightadmin/users',
				element: <AdminUsers />
			},
			{
				path: '/brightevents/participation',
				element: <Myparticipations />
			},
			{
				path: '/brightevents/requests',
				element: <Myrequests />
			},
			{
				path: '/brightevents/requests/declined',
				element: <DeclinedRequests />
			},
			{
				path: '/brightevents/:id',
				element: <BrightEventDetail />
			},
			{
				path: '/brightevents/requests/new',
				element: <CreateEvent />
			},
			{
				path: '/brightevents/requests/update/:id',
				element: <UpdateEvent />
			},
			{
				path: '/brightpolls',
				element: <BrightPolls />
			},
			// {
			// 	path: '/brightpolls',
			// 	element: < />
			// },
			{
				path: '/brightpolls/requests/new',
				element: <CreatePoll />
			},
			{
				path: '/brightpolls/:id',
				element: <BrightPollsDetail />
			},
			{
				path: '/not-found',
				element: <NotFound />
			}, 
			{
				path: '*',
				element: <NotFound />
			}
		]
	}
], {
	future: {
		v7_relativeSplatPath: true,
		v7_fetcherPersist: true,
		v7_normalizeFormMethod: true,
		v7_partialHydration: true,
		v7_skipActionErrorRevalidation: true
	},
});

export default Router;
