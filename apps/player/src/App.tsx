import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { ProfileProvider } from '@/hooks/useProfile';
import { AppShell } from '@/layout';
import {
  BattlePage,
  BoardPage,
  CampaignPage,
  TrainingPage,
  ChessTestPage,
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
 * /battle is rendered OUTSIDE AppShell (fullscreen, no header/footer).
 */
const router = createBrowserRouter([
  {
    path: '/battle',
    element: <BattlePage />,
  },
  {
    path: '/chess-test',
    element: <ChessTestPage />,
  },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={routePaths.home} replace /> },
      { path: routePaths.home,    element: <HomePage /> },
      { path: routePaths.board,   element: <BoardPage /> },
      { path: routePaths.shop,    element: <ShopPage /> },
      { path: routePaths.league,  element: <LeaguePage /> },
      { path: routePaths.friends, element: <FriendsPage /> },
      { path: '/campaign', element: <CampaignPage /> },
      { path: '/training', element: <TrainingPage /> },
      { path: '*', element: <Navigate to={routePaths.home} replace /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>
  );
}
