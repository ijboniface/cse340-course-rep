// Import model functions
import { getAllCategories } from '../models/categories.js';

// Define controller functions
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        res.render('categories', { title, categories });
    } catch (err) {
        next(err);
    }
};

// Export controller functions
export { showCategoriesPage };