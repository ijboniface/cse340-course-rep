// Import model functions
import {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments
} from '../models/categories.js';

// Import project model function
import { getProjectDetails } from '../models/projects.js';

// Display all categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        res.render('categories', { title, categories });
    } catch (err) {
        next(err);
    }
};

// Display projects belonging to an individual category
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.category_name;

        res.render('category', {
            title,
            category,
            projects
        });
    } catch (err) {
        next(err);
    }
};

// Display the assign categories form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Retrieve project details
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).send('Project not found.');
        }

        // Retrieve all available categories
        const categories = await getAllCategories();

        // Retrieve categories already assigned to this project
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (err) {
        next(err);
    }
};

// Process category assignments
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Retrieve selected category IDs
        const selectedCategoryIds = req.body.categoryIds || [];

        // Ensure selected category IDs are always an array
        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        // Update category assignments
        await updateCategoryAssignments(projectId, categoryIdsArray);

        // Set success message
        req.flash('success', 'Categories updated successfully.');

        // Return to project details
        return res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};