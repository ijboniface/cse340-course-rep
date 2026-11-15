import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

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

export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};
