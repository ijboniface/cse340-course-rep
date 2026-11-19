import { body, validationResult } from 'express-validator';

import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// Validate and sanitize organization form fields
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters')
        .escape(),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters')
        .escape(),

    body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

// Display all organizations
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', { title, organizations });
    } catch (err) {
        next(err);
    }
};

// Display organization details
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails =
            await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).send('Organization not found.');
        }

        const projects =
            await getProjectsByOrganizationId(organizationId);

        const title = 'Organization Details';

        res.render('organization', {
            title,
            organizationDetails,
            projects
        });
    } catch (err) {
        next(err);
    }
};

// Display the new organization form
const showNewOrganizationForm = async (req, res, next) => {
    try {
        const title = 'Add New Organization';

        res.render('new-organization', {
            title,
            errors: [],
            values: {}
        });
    } catch (err) {
        next(err);
    }
};

// Process new organization form submission
const processNewOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const title = 'Add New Organization';

            return res.status(400).render('new-organization', {
                title,
                errors: errors.array(),
                values: req.body
            });
        }

        const { name, description, contactEmail } = req.body;

        const logoFilename = req.file
            ? req.file.filename
            : 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization added successfully!');

        return res.redirect(`/organization/${organizationId}`);
    } catch (err) {
        next(err);
    }
};

// Display the edit organization form
const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails =
            await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).send('Organization not found.');
        }

        const title = 'Edit Organization';
        const errors = req.flash('error');

        res.render('edit-organization', {
            title,
            organizationDetails,
            errors
        });
    } catch (err) {
        next(err);
    }
};

// Process edit organization form submission
const processEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-organization/${organizationId}`);
        }

        const currentOrganization =
            await getOrganizationDetails(organizationId);

        if (!currentOrganization) {
            return res.status(404).send('Organization not found.');
        }

        const { name, description, contactEmail } = req.body;

        // Keep the existing logo if no new file was uploaded
        const logoFilename = req.file
            ? req.file.filename
            : currentOrganization.logo_filename;

        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization updated successfully!');

        return res.redirect(`/organization/${organizationId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};
