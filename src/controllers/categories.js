// Import model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

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

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};