// Import validation functions
import { body, validationResult } from 'express-validator';

// Import project model functions
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject
} from '../models/projects.js';

// Import organization model function
import { getAllOrganizations } from '../models/organizations.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Project form validation rules
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters')
        .escape(),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 999 })
        .withMessage('Description must be less than 1000 characters')
        .escape(),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 199 })
        .withMessage('Location must be less than 200 characters')
        .escape(),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
        .toInt()
];

// Display upcoming projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (err) {
        next(err);
    }
};

// Display individual project details
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).send('Project not found.');
        }

        const categories = await getCategoriesByProjectId(projectId);

        const title = 'Project Details';

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
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-project');
        }

        // Extract project information from the form
        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        // Insert the new project into the database
        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        // Set success message
        req.flash(
            'success',
            'New service project created successfully!'
        );

        // Redirect to the main project list
        return res.redirect('/projects');

    } catch (err) {
        next(err);
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
};