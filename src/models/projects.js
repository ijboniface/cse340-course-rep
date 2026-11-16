import db from './db.js';

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

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
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

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails
};