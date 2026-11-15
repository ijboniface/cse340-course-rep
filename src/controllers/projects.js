// Import model functions
import { getAllProjects } from '../models/projects.js';

// Define controller functions
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', { title, projects });
    } catch (err) {
        next(err);
    }
};

// Export controller functions
export { showProjectsPage };