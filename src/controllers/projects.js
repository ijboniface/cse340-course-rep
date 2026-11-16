// Import model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

        const title = 'Project Details';

        res.render('project', {
            title,
            projectDetails
        });
    } catch (err) {
        next(err);
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};