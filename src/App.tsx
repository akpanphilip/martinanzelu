import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useContent } from './context/ContentContext';
import { buildTheme } from './theme';
import { SiteLayout } from './components/SiteLayout';
import { Preloader } from './components/Preloader';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

const AdminPage = lazy(() => import('./admin/AdminPage'));

export default function App() {
  const { content } = useContent();
  const accent = content.settings.accent;
  const theme = useMemo(() => buildTheme(accent), [accent]);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [loading, setLoading] = useState(() => content.settings.showPreloader && !isAdmin && !sessionStorage.getItem('uiportfolio:seen'));
  const done = useCallback(() => {
    sessionStorage.setItem('uiportfolio:seen', '1');
    setLoading(false);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <AnimatePresence>{loading && <Preloader key="preloader" name={content.profile.name} onDone={done} />}</AnimatePresence>
      <Suspense
        fallback={
          <Flex minH="100vh" align="center" justify="center">
            <Spinner color="brand.400" size="xl" />
          </Flex>
        }
      >
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </ChakraProvider>
  );
}
