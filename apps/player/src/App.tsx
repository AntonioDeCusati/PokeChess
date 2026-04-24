import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AppShell } from '@/layout';
import {
  BoardPage,
  FriendsPage,
  HomePage,
  LeaguePage,
  ShopPage,
} from '@/pages';
import { routePaths } from '@/lib/routes';

/**
 * App router.
 *
 * AppShell is a layout route, so the header + bottom nav stay mounted
 * across page transitions (no re-render flicker).
 *
 * Default route redirects "/" → "/home".
 */
const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={routePaths.home} replace /> },
      { path: routePaths.home,    element: <HomePage /> },
      { path: routePaths.board,   element: <BoardPage /> },
      { path: routePaths.shop,    element: <ShopPage /> },
      { path: routePaths.league,  element: <LeaguePage /> },
      { path: routePaths.friends, element: <FriendsPage /> },
      { path: '*', element: <Navigate to={routePaths.home} replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
