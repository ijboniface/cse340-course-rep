import db from './db.js';

// Retrieve all categories
const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM public.category
        ORDER BY category_id;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Retrieve a single category by ID
const getCategoryById = async (id) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM public.category
        WHERE category_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all categories associated with a project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.category_name
        FROM public.category c
        INNER JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Retrieve all projects associated with a category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date
        FROM public.project p
        INNER JOIN public.project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date, p.project_id;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Assign a category to a project
const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_category (
            category_id,
            project_id
        )
        VALUES ($1, $2);
    `;

    const queryParams = [categoryId, projectId];

    await db.query(query, queryParams);
};

// Update all category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {

    // Remove existing category assignments
    const deleteQuery = `
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Add the newly selected categories
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

// Export model functions
export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments
};