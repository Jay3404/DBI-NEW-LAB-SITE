// src/routes.jsx
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'

// Public Pages
const Home = lazy(() => import('./pages/Home'))
const Research = lazy(() => import('./pages/Research'))
const SelectedPublications = lazy(() => import('./pages/SelectedPublications'))
const WorkInProgressPublications = lazy(() => import('./pages/WorkInProgressPublications'))
const Members = lazy(() => import('./pages/Members'))
const Professor = lazy(() => import('./pages/Professor'))
const Researchers = lazy(() => import('./pages/Researchers'))
const Students = lazy(() => import('./pages/Students'))
const Projects = lazy(() => import('./pages/Projects'))
const Courses = lazy(() => import('./pages/Courses'))
const News = lazy(() => import('./pages/News'))

// Admin Pages
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'))
const AdminLogin = lazy(() => import('./admin/pages/Login'))
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'))
const CourseList = lazy(() => import('./admin/pages/courses/CourseList'))
const CourseForm = lazy(() => import('./admin/pages/courses/CourseForm'))

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'research', element: <Research /> },
      { path: 'selected-publications', element: <SelectedPublications /> },
      { path: 'work-in-progress-publications', element: <WorkInProgressPublications /> },
      { path: 'members', element: <Members /> },
      { path: 'professor', element: <Professor /> },
      { path: 'researchers', element: <Researchers /> },
      { path: 'students', element: <Students /> },
      { path: 'projects', element: <Projects /> },
      { path: 'courses', element: <Courses /> },
      { path: 'news', element: <News /> },
    ],
  },

  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'courses', element: <CourseList /> },
      { path: 'courses/new', element: <CourseForm /> },
      { path: 'courses/edit/:id', element: <CourseForm /> },
      // 추후 추가될 라우트들
      // { path: 'publications', element: <PublicationList /> },
      // { path: 'members', element: <MemberList /> },
      // { path: 'projects', element: <ProjectList /> },
      // { path: 'settings', element: <Settings /> },
    ],
  },
])
