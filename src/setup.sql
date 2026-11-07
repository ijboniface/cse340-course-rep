BEGIN;

DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id)
        REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO organization (
    organization_id, name, description, contact_email, logo_filename
)
VALUES
(1, 'BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
(2, 'GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
(3, 'UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

INSERT INTO project (
    project_id, organization_id, title, description, location, project_date
)
VALUES
(1, 1, 'Community School Renovation', 'Renovation of classrooms and improvement of learning facilities for children.', 'Agbede, Ikorodu, Lagos State', '2026-11-14'),
(2, 1, 'Youth Skills Development Workshop', 'A practical skills training programme designed to equip young people with employable skills.', 'Ikorodu, Lagos State', '2026-11-21'),
(3, 1, 'Community Library Project', 'Establishment of a community reading centre to promote literacy among children and young adults.', 'Owutu, Ikorodu, Lagos State', '2026-11-28'),
(4, 1, 'School Furniture Donation', 'Provision of desks and chairs to improve the learning environment in public schools.', 'Imota, Lagos State', '2026-12-05'),
(5, 1, 'Children Educational Outreach', 'An educational outreach programme providing learning materials and mentoring for schoolchildren.', 'Igbogbo, Ikorodu, Lagos State', '2026-12-12'),
(6, 2, 'Community Tree Planting', 'Planting trees to improve environmental sustainability and promote a greener community.', 'Ikorodu, Lagos State', '2026-11-15'),
(7, 2, 'Urban Farming Initiative', 'Training residents to establish small-scale urban farms for household food production.', 'Agbede, Ikorodu, Lagos State', '2026-11-22'),
(8, 2, 'Community Clean-Up Campaign', 'Organising volunteers to clean public spaces and improve environmental sanitation.', 'Igbogbo, Ikorodu, Lagos State', '2026-11-29'),
(9, 2, 'Sustainable Agriculture Workshop', 'Teaching local farmers sustainable agricultural practices and improved crop management.', 'Imota, Lagos State', '2026-12-06'),
(10, 2, 'Community Vegetable Garden', 'Establishing a shared vegetable garden to encourage local food production.', 'Owutu, Ikorodu, Lagos State', '2026-12-13'),
(11, 3, 'Elderly Care Outreach', 'Providing companionship, basic supplies and support to elderly members of the community.', 'Ikorodu, Lagos State', '2026-11-16'),
(12, 3, 'Free Community Health Awareness', 'Educating residents about preventive healthcare, hygiene and healthy living.', 'Agbede, Ikorodu, Lagos State', '2026-11-23'),
(13, 3, 'Food Support Programme', 'Distributing food packages to vulnerable households in the community.', 'Igbogbo, Ikorodu, Lagos State', '2026-11-30'),
(14, 3, 'Youth Mentorship Programme', 'Connecting young people with mentors who provide guidance on education and career development.', 'Imota, Lagos State', '2026-12-07'),
(15, 3, 'Community Support and Relief Drive', 'Mobilising volunteers to collect and distribute essential supplies to families in need.', 'Owutu, Ikorodu, Lagos State', '2026-12-14');

INSERT INTO category (category_name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

INSERT INTO project_category (project_id, category_id)
SELECT mapping.project_id, category.category_id
FROM (
    VALUES
    (1, 'Educational'),
    (1, 'Community Service'),
    (2, 'Educational'),
    (3, 'Educational'),
    (4, 'Educational'),
    (4, 'Community Service'),
    (5, 'Educational'),
    (6, 'Environmental'),
    (6, 'Community Service'),
    (7, 'Environmental'),
    (7, 'Educational'),
    (8, 'Environmental'),
    (8, 'Community Service'),
    (9, 'Environmental'),
    (9, 'Educational'),
    (10, 'Environmental'),
    (10, 'Community Service'),
    (11, 'Community Service'),
    (11, 'Health and Wellness'),
    (12, 'Community Service'),
    (12, 'Health and Wellness'),
    (13, 'Community Service'),
    (14, 'Educational'),
    (14, 'Community Service'),
    (15, 'Community Service'),
    (15, 'Health and Wellness')
) AS mapping(project_id, category_name)
JOIN category
    ON category.category_name = mapping.category_name;

SELECT setval(
    pg_get_serial_sequence('organization', 'organization_id'),
    (SELECT MAX(organization_id) FROM organization),
    true
);

SELECT setval(
    pg_get_serial_sequence('project', 'project_id'),
    (SELECT MAX(project_id) FROM project),
    true
);

SELECT setval(
    pg_get_serial_sequence('category', 'category_id'),
    (SELECT MAX(category_id) FROM category),
    true
);

COMMIT;