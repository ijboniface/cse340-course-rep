import db from './db.js';

// Get all projects
const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM public.project p
        INNER JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date, p.project_id;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Get projects by organization ID
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date, project_id;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Get upcoming projects
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            o.name AS organization_name
        FROM public.project p
        INNER JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC, p.project_id ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Get project details
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.project_date AS date,
            o.name AS organization_name,
            o.description AS organization_description,
            o.contact_email,
            o.logo_filename
        FROM public.project p
        INNER JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

// Create a new service project
const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        INSERT INTO public.project (
            title,
            description,
            location,
            project_date,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(
            'Created new project with ID:',
            result.rows[0].project_id
        );
    }

    return result.rows[0].project_id;
};

// Export project model functions
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject
};