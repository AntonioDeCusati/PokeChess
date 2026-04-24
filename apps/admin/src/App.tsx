import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { AdminShell } from '@/layout/AdminShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { ModulePlaceholderPage } from '@/pages/ModulePlaceholderPage';
import { adminModules } from '@/lib/modules';

const router = createBrowserRouter([
  {
    element: <AdminShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      ...adminModules.map((m) => ({
        path: `/${m.slug}`,
        element: <ModulePlaceholderPage />,
      })),
      { path: '*', element: <DashboardPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
