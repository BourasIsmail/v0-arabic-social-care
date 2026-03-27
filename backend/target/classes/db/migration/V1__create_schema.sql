-- =============================================
-- Flyway Migration V1: Create Schema
-- Arabic Social Care Institution Diagnostic Form
-- =============================================

-- Create institutions table (main entity)
CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Institution Info
    institution_type ENUM('DAR_TALIB', 'DAR_TALIBA', 'DAR_TALIB_TALIBA') NOT NULL,
    association_name VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    region VARCHAR(100),
    prefecture_province VARCHAR(100),
    commune VARCHAR(100),
    milieu ENUM('RURAL', 'URBAIN'),
    creation_year INT,
    legal_status ENUM('LICENSED', 'UNLICENSED'),
    unlicensed_reason VARCHAR(500),
    license_number VARCHAR(100),
    service_start_date DATE,
    
    -- Services (booleans)
    service_housing TINYINT(1) DEFAULT 0,
    service_meals TINYINT(1) DEFAULT 0,
    service_educational_support TINYINT(1) DEFAULT 0,
    service_cultural_activities TINYINT(1) DEFAULT 0,
    service_health_care TINYINT(1) DEFAULT 0,
    service_insurance TINYINT(1) DEFAULT 0,
    service_psychological_support TINYINT(1) DEFAULT 0,
    
    -- Capacity
    total_capacity INT,
    male_capacity INT,
    female_capacity INT,
    
    -- Target Levels
    target_primary TINYINT(1) DEFAULT 0,
    target_middle_school TINYINT(1) DEFAULT 0,
    target_high_school TINYINT(1) DEFAULT 0,
    target_other TINYINT(1) DEFAULT 0,
    target_other_detail VARCHAR(500),
    
    -- Distance
    distance_to_school ENUM('INSIDE', 'LT_1KM', 'BETWEEN_1_5KM', 'GT_5KM'),
    distance_to_national_boarding_school ENUM('INSIDE', 'LT_1KM', 'BETWEEN_1_5KM', 'GT_5KM'),
    
    -- Soft Delete
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    deleted_at DATETIME,
    
    -- Audit fields
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_region (region),
    INDEX idx_commune (commune),
    INDEX idx_institution_type (institution_type),
    INDEX idx_milieu (milieu),
    INDEX idx_legal_status (legal_status),
    INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create buildings table
CREATE TABLE buildings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL UNIQUE,
    
    building_status ENUM('RENTAL', 'OWNED', 'AT_DISPOSAL', 'OTHER'),
    building_condition ENUM('GOOD', 'SOME_DEGRADATION', 'BAD'),
    renovation_capacity ENUM('EASY', 'DIFFICULT', 'NEEDS_RECONSTRUCTION'),
    owner_type ENUM('STATE_DOMAIN', 'COMMUNAL', 'PRIVATE', 'OTHER'),
    has_partnership_agreement TINYINT(1),
    
    -- Audit fields
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_building_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create financings table
CREATE TABLE financings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL UNIQUE,
    
    -- Construction funding sources
    construction_solidarity_ministry TINYINT(1) DEFAULT 0,
    construction_national_entraide TINYINT(1) DEFAULT 0,
    construction_indh TINYINT(1) DEFAULT 0,
    construction_commune TINYINT(1) DEFAULT 0,
    construction_fondation_mohammed5 TINYINT(1) DEFAULT 0,
    construction_national_revival TINYINT(1) DEFAULT 0,
    construction_association TINYINT(1) DEFAULT 0,
    construction_other TINYINT(1) DEFAULT 0,
    construction_other_detail VARCHAR(500),
    
    -- Equipment funding sources
    equipment_solidarity_ministry TINYINT(1) DEFAULT 0,
    equipment_national_entraide TINYINT(1) DEFAULT 0,
    equipment_indh TINYINT(1) DEFAULT 0,
    equipment_commune TINYINT(1) DEFAULT 0,
    equipment_fondation_mohammed5 TINYINT(1) DEFAULT 0,
    equipment_association TINYINT(1) DEFAULT 0,
    equipment_other TINYINT(1) DEFAULT 0,
    equipment_other_detail VARCHAR(500),
    
    -- Costs
    total_construction_cost DECIMAL(15,2),
    annual_management_cost DECIMAL(15,2),
    
    -- Operating funding sources
    operating_indh TINYINT(1) DEFAULT 0,
    operating_national_entraide TINYINT(1) DEFAULT 0,
    operating_national_education TINYINT(1) DEFAULT 0,
    operating_commune TINYINT(1) DEFAULT 0,
    operating_parent_contributions TINYINT(1) DEFAULT 0,
    operating_donors TINYINT(1) DEFAULT 0,
    operating_association_own_sources TINYINT(1) DEFAULT 0,
    operating_other TINYINT(1) DEFAULT 0,
    
    -- Additional costs
    annual_hr_cost DECIMAL(15,2),
    annual_meals_cost DECIMAL(15,2),
    total_meals_amount DECIMAL(15,2),
    
    -- Shares (percentages)
    association_share DOUBLE,
    education_share DOUBLE,
    other_share DOUBLE,
    
    -- Other expenses
    annual_other_expenses DECIMAL(15,2),
    individual_annual_cost DECIMAL(15,2),
    
    -- Audit fields
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_financing_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create targetings table
CREATE TABLE targetings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL UNIQUE,
    
    -- Selection criteria
    criteria_social_situation TINYINT(1) DEFAULT 0,
    criteria_distance TINYINT(1) DEFAULT 0,
    criteria_school_results TINYINT(1) DEFAULT 0,
    criteria_scholarship TINYINT(1) DEFAULT 0,
    criteria_other TINYINT(1) DEFAULT 0,
    criteria_other_detail VARCHAR(500),
    
    -- Priorities
    priority_1 VARCHAR(255),
    priority_2 VARCHAR(255),
    priority_3 VARCHAR(255),
    priority_4 VARCHAR(255),
    priority_5 VARCHAR(255),
    
    -- Selection body
    selection_body ENUM('ASSOCIATION_ALONE', 'MIXED_COMMITTEE'),
    
    -- Committee members
    committee_association TINYINT(1) DEFAULT 0,
    committee_national_entraide TINYINT(1) DEFAULT 0,
    committee_national_education TINYINT(1) DEFAULT 0,
    committee_commune TINYINT(1) DEFAULT 0,
    committee_local_authorities TINYINT(1) DEFAULT 0,
    committee_other_member TINYINT(1) DEFAULT 0,
    committee_other_member_detail VARCHAR(500),
    
    -- Additional info
    unsatisfied_requests_count INT,
    services_are_free TINYINT(1),
    tariff_type ENUM('UNIFORM', 'NON_UNIFORM'),
    uniform_amount DECIMAL(10,2),
    tariff_bracket ENUM('LT_50', 'BETWEEN_50_100', 'BETWEEN_100_200', 'GT_200'),
    
    -- Audit fields
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_targeting_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create housing_meals table
CREATE TABLE housing_meals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL UNIQUE,
    
    -- Season 23/24 beneficiaries
    season_2324_total INT,
    season_2324_male INT,
    season_2324_female INT,
    season_2324_primary INT,
    season_2324_middle_school INT,
    season_2324_high_school INT,
    season_2324_other INT,
    
    -- Season 24/25 beneficiaries
    season_2425_total INT,
    season_2425_male INT,
    season_2425_female INT,
    season_2425_primary INT,
    season_2425_middle_school INT,
    season_2425_high_school INT,
    season_2425_other INT,
    
    -- Season 25/26 beneficiaries
    season_2526_total INT,
    season_2526_male INT,
    season_2526_female INT,
    season_2526_primary INT,
    season_2526_middle_school INT,
    season_2526_high_school INT,
    season_2526_other INT,
    
    capacity_remarks TEXT,
    
    -- Meal beneficiaries
    total_meal_beneficiaries_2526 INT,
    association_meal_beneficiaries INT,
    education_meal_beneficiaries INT,
    full_grant_count INT,
    half_grant_count INT,
    meal_service_type ENUM('INSTITUTION_KITCHEN', 'READY_MEALS', 'OTHER'),
    
    -- Improvement suggestions
    suggestion_increase_products TINYINT(1) DEFAULT 0,
    suggestion_external_caterer TINYINT(1) DEFAULT 0,
    suggestion_other TINYINT(1) DEFAULT 0,
    suggestion_other_detail VARCHAR(500),
    
    -- Audit fields
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_housing_meals_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create staff_members table
CREATE TABLE staff_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL,
    
    staff_type ENUM('DIRECTOR', 'FINANCIAL_MANAGER', 'GENERAL_GUARD', 'SOCIAL_WORKER', 
                    'DOCTOR', 'NURSE', 'PSYCHOLOGIST', 'EDUCATORS', 'KITCHEN_MANAGER', 
                    'KITCHEN_AGENTS', 'STORAGE_MANAGER', 'SECURITY', 'SERVICE_AGENTS', 'OTHER') NOT NULL,
    nb_association INT,
    nb_deployed INT,
    nb_volunteers INT,
    nb_cnss INT,
    nb_smig INT,
    monthly_cost DECIMAL(12,2),
    annual_cost DECIMAL(15,2),
    
    -- Audit fields
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_staff_institution (institution_id),
    CONSTRAINT fk_staff_institution FOREIGN KEY (institution_id) 
        REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
