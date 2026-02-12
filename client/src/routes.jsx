// src/routes.jsx
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'

// Public Pages
const Home = lazy(() => import('./pages/Home'))
const Research = lazy(() => import('./pages/Research'))
const SelectedPublications = lazy(() => import('./pages/SelectedPublications'))
const WorkInProgressPublications = lazy(() => import('./pages/WorkInProgressPublications'))
const Professor = lazy(() => import('./pages/Professor'))
const Researchers = lazy(() => import('./pages/Researchers'))
const Students = lazy(() => import('./pages/Students'))
const Alumni = lazy(() => import('./pages/Alumni'))
const Projects = lazy(() => import('./pages/Projects'))
const Courses = lazy(() => import('./pages/Courses'))
const News = lazy(() => import('./pages/News'))

// Admin Pages
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'))
const AdminLogin = lazy(() => import('./admin/pages/Login'))
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'))
const CourseList = lazy(() => import('./admin/pages/courses/CourseList'))
const CourseForm = lazy(() => import('./admin/pages/courses/CourseForm'))
const PublicationList = lazy(() => import('./admin/pages/publications/PublicationList'))
const PublicationForm = lazy(() => import('./admin/pages/publications/PublicationForm'))
const MemberList = lazy(() => import('./admin/pages/members/MemberList'))
const MemberForm = lazy(() => import('./admin/pages/members/MemberForm'))
const NewsList = lazy(() => import('./admin/pages/news/NewsList'))
const NewsForm = lazy(() => import('./admin/pages/news/NewsForm'))
const ProjectList = lazy(() => import('./admin/pages/projects/ProjectList'))
const ProjectForm = lazy(() => import('./admin/pages/projects/ProjectForm'))
const Settings = lazy(() => import('./admin/pages/Settings'))

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
      { path: 'members', element: <Navigate to="/professor" replace /> },
      { path: 'professor', element: <Professor /> },
      { path: 'researchers', element: <Researchers /> },
      { path: 'students', element: <Students /> },
      { path: 'alumni', element: <Alumni /> },
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
      { path: 'publications', element: <PublicationList /> },
      { path: 'publications/new', element: <PublicationForm /> },
      { path: 'publications/edit/:id', element: <PublicationForm /> },
      { path: 'members', element: <MemberList /> },
      { path: 'members/new', element: <MemberForm /> },
      { path: 'members/edit/:id', element: <MemberForm /> },
      { path: 'news', element: <NewsList /> },
      { path: 'news/new', element: <NewsForm /> },
      { path: 'news/edit/:id', element: <NewsForm /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/new', element: <ProjectForm /> },
      { path: 'projects/edit/:id', element: <ProjectForm /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])
