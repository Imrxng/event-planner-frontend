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
import NewRequests from "../pages/NewRequests";


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
				path: '/brightevents',
				element: <Brightevents />
			},
			{
				path: '/admin',
				element: <Admin />
			},
			{
				path: '/participation',
				element: <Myparticipations />
			},
			{
				path: '/requests',
				element: <Myrequests />
			},
			{
				path: '/declinedRequests',
				element: <DeclinedRequests />
			},
			{
				path: '/newrequests',
				element: <NewRequests />
			},
			{
				path: '/brightevents/:id',
				element: <BrightEventDetail />
			},
			{
				path: '/requests/event/create',
				element: <CreateEvent />
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
