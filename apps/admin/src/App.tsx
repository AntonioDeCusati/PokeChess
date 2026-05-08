import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { AuthGuard } from '@/layout/AuthGuard';
import { AdminShell } from '@/layout/AdminShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { CreaturesPage } from '@/pages/CreaturesPage';
import { TrainersPage } from '@/pages/TrainersPage';
import { BackgroundsPage } from '@/pages/BackgroundsPage';
import { SupportsPage } from '@/pages/SupportsPage';
import { UsersPage } from '@/pages/UsersPage';
import { ModulePlaceholderPage } from '@/pages/ModulePlaceholderPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route element={<AdminShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="creatures" element={<CreaturesPage />} />
              <Route path="trainers" element={<TrainersPage />} />
              <Route path="backgrounds" element={<BackgroundsPage />} />
              <Route path="supports" element={<SupportsPage />} />
              <Route path="moves" element={<ModulePlaceholderPage />} />
              <Route path="special-moves" element={<ModulePlaceholderPage />} />
              <Route path="abilities" element={<ModulePlaceholderPage />} />
              <Route path="chests" element={<ModulePlaceholderPage />} />
              <Route path="rewards" element={<ModulePlaceholderPage />} />
              <Route path="progression" element={<ModulePlaceholderPage />} />
              <Route path="gym-leaders" element={<ModulePlaceholderPage />} />
              <Route path="npc-teams" element={<ModulePlaceholderPage />} />
              <Route path="event-trainers" element={<ModulePlaceholderPage />} />
              <Route path="async-content" element={<ModulePlaceholderPage />} />
              <Route path="assets" element={<ModulePlaceholderPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
