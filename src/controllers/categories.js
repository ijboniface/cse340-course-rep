import {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
} from '../models/categories.js';

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

// Display the new category form
const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Add New Category',
        category_name: '',
        errors: []
    });
};

// Process the new category form
const processNewCategoryForm = async (req, res, next) => {
    try {
        const categoryName = (req.body.category_name || '').trim();
        const errors = [];

        if (!categoryName) {
            errors.push({ msg: 'Category name is required.' });
        } else if (categoryName.length < 3) {
            errors.push({ msg: 'Category name must be at least 3 characters long.' });
        } else if (categoryName.length > 100) {
            errors.push({ msg: 'Category name cannot exceed 100 characters.' });
        }

        if (errors.length > 0) {
            return res.status(400).render('new-category', {
                title: 'Add New Category',
                category_name: categoryName,
                errors
            });
        }

        await createCategory(categoryName);

        req.flash('success', 'Category created successfully.');
        return res.redirect('/categories');
    } catch (err) {
        next(err);
    }
};

// Display the edit category form
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        res.render('edit-category', {
            title: 'Edit Category',
            category,
            errors: []
        });
    } catch (err) {
        next(err);
    }
};

// Process the edit category form
const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const categoryName = (req.body.category_name || '').trim();
        const errors = [];

        if (!categoryName) {
            errors.push({ msg: 'Category name is required.' });
        } else if (categoryName.length < 3) {
            errors.push({ msg: 'Category name must be at least 3 characters long.' });
        } else if (categoryName.length > 100) {
            errors.push({ msg: 'Category name cannot exceed 100 characters.' });
        }

        if (errors.length > 0) {
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                category: {
                    category_id: categoryId,
                    category_name: categoryName
                },
                errors
            });
        }

        const updatedCategory = await updateCategory(categoryId, categoryName);

        if (!updatedCategory) {
            return res.status(404).send('Category not found.');
        }

        req.flash('success', 'Category updated successfully.');
        return res.redirect('/categories');
    } catch (err) {
        next(err);
    }
};

// Display the assign categories form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).send('Project not found.');
        }

        const categories = await getAllCategories();
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
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');

        return res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};