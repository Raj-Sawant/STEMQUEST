import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import NotFound from './pages/NotFound';
import StudentLogin from './pages/student-login';
import GameLibrary from './pages/game-library';
import StudentAnalytics from './pages/student-analytics';
import GamePlayer from './pages/game-player';
import StudentDashboard from './pages/student-dashboard';
import StudentProgress from './pages/student-progress';
import DragonGameTest from './pages/DragonGameTest';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<StudentLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/game-library" element={<GameLibrary />} />
          <Route path="/student-analytics" element={<StudentAnalytics />} />
          <Route path="/game-player" element={<GamePlayer />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-progress" element={<StudentProgress />} />
          <Route path="/dragon-game-test" element={<DragonGameTest />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;