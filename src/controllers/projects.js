import { body, validationResult } from 'express-validator';

import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const projectValidation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters.')
        .escape(),

    body('description')
        .trim()
        .isLength({ max: 999 })
        .withMessage('Description must not exceed 999 characters.')
        .escape(),

    body('location')
        .trim()
        .isLength({ max: 199 })
        .withMessage('Location must not exceed 199 characters.')
        .escape(),

    body('date')
        .isISO8601()
        .withMessage('Please provide a valid project date.'),

    body('organizationId')
        .isInt()
        .withMessage('Please select a valid organization.')
        .toInt()
];

// Display all projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects();
        const title = 'Service Projects';

        res.render('projects', {
            title,
            projects
        });
    } catch (err) {
        next(err);
    }
};

// Display project details
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).send('Project not found.');
        }

        const categories = await getCategoriesByProjectId(projectId);
        const title = projectDetails.title;

        res.render('project', {
            title,
            projectDetails,
            categories
        });
    } catch (err) {
        next(err);
    }
};

// Display the new project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';
        const errors = req.flash('error');

        res.render('new-project', {
            title,
            organizations,
            errors
        });
    } catch (err) {
        next(err);
    }
};

// Process new project form submission
const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-project');
        }

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Service project created successfully!');
        return res.redirect('/projects');
    } catch (err) {
        next(err);
    }
};

// Display the edit project form
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).send('Project not found.');
        }

        const organizations = await getAllOrganizations();
        const title = 'Edit Service Project';
        const errors = req.flash('error');

        res.render('edit-project', {
            title,
            projectDetails,
            organizations,
            errors
        });
    } catch (err) {
        next(err);
    }
};

// Process edit project form submission
const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-project/${projectId}`);
        }

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Service project updated successfully!');
        return res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};
