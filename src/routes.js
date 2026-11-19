import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';
import upload from './middleware/upload.js';

const router = express.Router();

// Application routes
router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);

// New organization routes
router.get('/new-organization', showNewOrganizationForm);
router.post(
    '/new-organization',
    upload.single('logo'),
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization routes
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post(
    '/edit-organization/:id',
    upload.single('logo'),
    organizationValidation,
    processEditOrganizationForm
);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// New project routes
router.get('/new-project', showNewProjectForm);
router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Assign categories to project routes
router.get(
    '/assign-categories/:projectId',
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    processAssignCategoriesForm
);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;