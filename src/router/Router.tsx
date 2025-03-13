import {  createHashRouter } from "react-router-dom";
import Root from "./Root";
import Index from "../pages/Index";
import Brightevents from "../pages/Brightevents";
import BrightEventDetail from "../pages/BrightEventDetail";
import Admin from "../pages/Admin";
import NotFound from "../pages/404";


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
				path: '/Brightevents',
				element: <Brightevents />
			},
			{
				path: '/admin',
				element: <Admin />
			},
			{
				path: '/Brightevents/:id',
				element: <BrightEventDetail />
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
