<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $configs = [
            [
                'key' => 'OPENAI_API_KEY',
                'value' => 'ABC2345',
                'type' => 'secret',
            ],
            [
                'key' => 'OPENAI_MODEL',
                'value' => 'gpt-4.1-mini',
                'type' => 'string',
            ],
            [
                'key' => 'OPENAI_TITLE_MODEL',
                'value' => 'gpt-4.1-mini',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_ROLE',
                'value' => 'system',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_ROLE_CONTENT',
                'value' => 'You are a helpful AI assistant.',
                'type' => 'text',
            ],
            [
                'key' => 'CHATGPT_TEMPERATURE',
                'value' => '0.2',
                'type' => 'float',
            ],
            [
                'key' => 'CHATGPT_TITLE_TEMPERATURE',
                'value' => '0.2',
                'type' => 'float',
            ],
            [
                'key' => 'CHATGPT_TITLE_MAX_TOKENS',
                'value' => '20',
                'type' => 'integer',
            ],
            [
                'key' => 'CHATGPT_HISTORY_LIMIT',
                'value' => '15',
                'type' => 'integer',
            ],
            [
                'key' => 'CHATGPT_SEND_MSG_FOR_REFERENCE',
                'value' => '0',
                'type' => 'integer',
            ],
            [
                'key' => 'CHATGPT_TOOL_TYPE',
                'value' => 'web_search',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_SEARCH_CONTEXT_SIZE',
                'value' => 'medium',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_CURL_TIMEOUT',
                'value' => '120',
                'type' => 'integer',
            ],
            [
                'key' => 'OPENAI_FILE_PURPOSE',
                'value' => 'assistants',
                'type' => 'string',
            ],
            [
                'key' => 'VACANCY_AI_PROMPT',
                'value' => 'You will receive:
                            1. My current resume written in LaTeX.
                            2. A target job description.

                            Act as an expert ATS resume analyst, technical recruiter, hiring manager, and professional resume writer. Your goal is to evaluate and optimize my resume specifically for the target position while maintaining complete truthfulness and preserving the existing LaTeX design.

                            ## Primary Objectives

                            1. Analyze how well my current resume matches the job description.
                            2. Estimate its ATS compatibility and recruiter relevance.
                            3. Identify important keywords, qualifications, and responsibilities from the job description.
                            4. Rewrite the resume content to improve alignment with the target role.
                            5. Return the complete optimized resume as valid, compilable LaTeX.
                            6. Ensure the final compiled resume does not exceed two pages.
                            7. Return the entire response as one syntactically valid JSON object containing exactly four top-level fields:

                            * `company_name`
                            * `job_applied_for`
                            * `updated_latex_code`
                            * `misc`

                            All analysis and supporting details must be placed inside `misc`.

                            ## Step 1: Extract Job Information

                            From the job description, identify:

                            * Company name
                            * Position or job title
                            * Department or business unit, when available
                            * Seniority level
                            * Required technical skills
                            * Preferred technical skills
                            * Required soft skills
                            * Core responsibilities
                            * Industry-specific terminology
                            * Tools, platforms, frameworks, and methodologies
                            * Education, certification, and experience requirements

                            Do not guess the company name or job title when they are not explicitly stated. Use `null` when the information cannot be determined reliably.

                            The company name must appear only in the top-level `company_name` field.

                            The position or job title must appear only in the top-level `job_applied_for` field.

                            Do not duplicate these values inside `misc`.

                            ## Step 2: Perform an ATS Analysis

                            Compare the current resume with the target job description and provide:

                            * An estimated ATS score from 0 to 100
                            * A keyword match percentage from 0 to 100
                            * Matched keywords and competencies
                            * Important missing keywords
                            * Partially represented keywords
                            * Relevant experience alignment
                            * Technical skills alignment
                            * Education and certification alignment
                            * Seniority alignment
                            * Formatting or parsing risks
                            * Weak or generic bullet points
                            * Missing measurable outcomes
                            * Irrelevant, repetitive, or low-impact content
                            * Potential recruiter concerns
                            * Actionable recommendations

                            The ATS score should be based on factors such as:

                            * Job-title alignment
                            * Required-skill coverage
                            * Preferred-skill coverage
                            * Relevant experience
                            * Responsibility alignment
                            * Achievement quality
                            * Keyword usage
                            * Resume clarity
                            * ATS readability
                            * Education and certification requirements
                            * Overall recruiter relevance

                            Briefly explain the reasoning behind the score.

                            Do not present the score as a guaranteed result from Greenhouse, Lever, Workday, Taleo, or any other ATS platform. Treat it as an informed estimate.

                            ## Step 3: Identify Resume Strengths

                            Clearly identify strengths such as:

                            * Relevant professional experience
                            * Strong alignment with the role
                            * Relevant technical skills and tools
                            * Industry or domain knowledge
                            * Leadership, ownership, and collaboration
                            * Quantified accomplishments
                            * Business impact
                            * Projects that demonstrate required competencies
                            * Education or certifications relevant to the position
                            * Clear career progression

                            ## Step 4: Identify Resume Weaknesses

                            Clearly identify weaknesses such as:

                            * Missing required or preferred skills
                            * Weak alignment with the target position
                            * Generic responsibilities instead of accomplishments
                            * Bullets without measurable outcomes
                            * Vague or repetitive language
                            * Passive wording
                            * Unnecessary jargon
                            * Keyword gaps
                            * Inconsistent terminology
                            * Outdated or irrelevant content
                            * Excessive length
                            * Poor prioritization of information
                            * Unsupported claims
                            * ATS parsing risks

                            ## Step 5: Optimize the Resume

                            Rewrite the resume specifically for the target job description.

                            Follow these rules:

                            * Preserve complete truthfulness.
                            * Do not invent experience, employers, projects, responsibilities, skills, qualifications, certifications, dates, metrics, or achievements.
                            * Do not exaggerate seniority, ownership, scope, or business impact.
                            * Do not add a keyword unless the original resume reasonably supports it.
                            * When a useful metric is missing, improve the wording without fabricating a number.
                            * Use strong and varied action verbs.
                            * Convert responsibility-focused bullets into accomplishment-focused bullets whenever the source information supports it.
                            * Highlight outcomes, scope, efficiency, quality, revenue, cost savings, reliability, growth, automation, customer impact, or operational improvements when supported by the original resume.
                            * Naturally incorporate relevant ATS keywords from the job description.
                            * Avoid keyword stuffing.
                            * Prioritize the most important required qualifications before preferred qualifications.
                            * Use terminology consistent with the job description when it accurately describes the candidate’s experience.
                            * Keep bullet points concise, specific, and recruiter-friendly.
                            * Remove or condense redundant, generic, outdated, low-impact, and less relevant content.
                            * Prioritize the experience, projects, skills, and achievements most relevant to the target role.
                            * Maintain a professional and confident tone.
                            * Avoid first-person pronouns.
                            * Avoid unsupported subjective claims such as “expert,” “best,” or “world-class.”
                            * Do not include graphics, icons, skill bars, photos, tables, or other elements that may reduce ATS readability unless they already exist in the supplied LaTeX structure.

                            ## LaTeX Preservation Requirements

                            The supplied LaTeX source is the formatting template and must be preserved.

                            Unless a minimal adjustment is absolutely necessary to keep the compiled document within two pages:

                            * Do not change the document class.
                            * Do not change packages.
                            * Do not add or remove packages.
                            * Do not change fonts.
                            * Do not change margins.
                            * Do not change page geometry.
                            * Do not change section formatting.
                            * Do not change custom commands.
                            * Do not rename commands or environments.
                            * Do not change spacing commands or the spacing system.
                            * Do not change columns, alignment, indentation, or layout.
                            * Do not change the overall visual design.
                            * Do not add new sections unless the existing structure clearly supports them.
                            * Do not remove required LaTeX syntax.
                            * Do not place explanatory comments inside the final LaTeX code.
                            * Do not wrap the LaTeX code in Markdown code fences.

                            Modify only the textual resume content wherever possible.

                            The final LaTeX must:

                            * Be complete rather than a partial excerpt
                            * Remain syntactically valid
                            * Preserve balanced braces and environments
                            * Preserve all required commands and package dependencies
                            * Escape LaTeX-sensitive characters correctly
                            * Compile without intentionally introduced errors
                            * Remain structurally as close to the original as possible
                            * Produce a resume of no more than two pages

                            Because you may not have access to a LaTeX compiler, do not claim that compilation or the two-page limit has been physically verified unless it was actually tested.

                            Instead, optimize conservatively for a maximum length of two pages.

                            The complete optimized LaTeX source must appear only in the top-level `updated_latex_code` field.

                            Do not duplicate the LaTeX source inside `misc`.

                            ## Content Prioritization for the Two-Page Limit

                            When shortening is necessary, use this priority order:

                            1. Experience directly relevant to the target role
                            2. Quantified and high-impact achievements
                            3. Required technical skills
                            4. Relevant projects
                            5. Preferred skills and domain knowledge
                            6. Education and relevant certifications
                            7. Less relevant experience
                            8. Generic responsibilities
                            9. Redundant, outdated, or low-impact details

                            Do not reduce readability by excessively compressing wording.

                            ## Required Output Format

                            Return only one syntactically valid JSON object.

                            The JSON object must contain exactly these four top-level fields:

                            1. `company_name`
                            2. `job_applied_for`
                            3. `updated_latex_code`
                            4. `misc`

                            Do not add any other top-level fields.

                            Do not include:

                            * Markdown
                            * Code fences
                            * Introductory text
                            * Closing text
                            * Notes outside the JSON object
                            * JavaScript-style comments
                            * Trailing commas
                            * Placeholder ellipses in the updated LaTeX
                            * Any content before or after the JSON object

                            Use exactly this top-level structure:

                            {
                            "company_name": "Extracted company name or null",
                            "job_applied_for": "Extracted job title or null",
                            "updated_latex_code": "Complete optimized LaTeX source code with newline, backslash, and quotation characters correctly escaped for valid JSON",
                            "misc": {
                            "job_information": {
                            "department_or_business_unit": "Extracted department or business unit, or null",
                            "seniority_level": "Extracted seniority level, or null",
                            "required_technical_skills": [],
                            "preferred_technical_skills": [],
                            "required_soft_skills": [],
                            "core_responsibilities": [],
                            "industry_terminology": [],
                            "tools_platforms_frameworks_and_methodologies": [],
                            "education_requirements": [],
                            "certification_requirements": [],
                            "experience_requirements": []
                            },
                            "ats_analysis": {
                            "ats_score": 0,
                            "keyword_match_percentage": 0,
                            "score_explanation": "Concise explanation of the estimated score",
                            "matched_keywords": [
                            "Keyword or competency supported by the resume"
                            ],
                            "missing_keywords": [
                            {
                            "keyword": "Important keyword from the job description",
                            "importance": "required or preferred",
                            "recommendation": "Explain whether and how it can truthfully be addressed"
                            }
                            ],
                            "partially_matched_keywords": [
                            {
                            "keyword": "Partially represented keyword",
                            "current_evidence": "Relevant evidence currently present in the resume",
                            "improvement": "How the wording can be strengthened truthfully"
                            }
                            ],
                            "experience_alignment": "Assessment of relevant professional experience",
                            "technical_skills_alignment": "Assessment of technical skill coverage",
                            "education_and_certification_alignment": "Assessment of education and certification requirements",
                            "seniority_alignment": "Assessment of seniority-level alignment",
                            "strengths": [
                            "Specific resume strength"
                            ],
                            "weaknesses": [
                            "Specific resume weakness"
                            ],
                            "ats_issues": [
                            "Potential ATS parsing, structure, wording, or formatting issue"
                            ],
                            "weak_or_generic_bullets": [
                            "Weak or generic bullet point identified in the original resume"
                            ],
                            "missing_measurable_outcomes": [
                            "Area where measurable impact is missing"
                            ],
                            "irrelevant_or_low_impact_content": [
                            "Content that is irrelevant, repetitive, outdated, or low impact"
                            ],
                            "recruiter_concerns": [
                            "Potential concern a recruiter or hiring manager may have"
                            ],
                            "recommendations": [
                            {
                            "priority": "high, medium, or low",
                            "recommendation": "Specific actionable recommendation",
                            "reason": "Why this change matters"
                            }
                            ]
                            },
                            "optimization_summary": {
                            "major_changes": [
                            "Summary of an important content change"
                            ],
                            "keywords_added_or_strengthened": [
                            "Keyword that was added or strengthened based on existing evidence"
                            ],
                            "content_removed_or_condensed": [
                            "Content that was removed or shortened"
                            ],
                            "truthfulness_notes": [
                            "Requested qualification that could not be added because it was unsupported"
                            ],
                            "two_page_strategy": "Explain how the content was prioritized or condensed to target a maximum of two pages",
                            "compilation_status": "State whether compilation was actually tested. Do not claim successful compilation unless it was physically tested."
                            }
                            }
                            }

                            ## Field-Separation Requirements

                            The four top-level fields must remain strictly separated:

                            * `company_name` must contain only the extracted company name or `null`.
                            * `job_applied_for` must contain only the extracted job title or `null`.
                            * `updated_latex_code` must contain only the complete optimized LaTeX resume.
                            * `misc` must contain every other extracted detail, analysis result, recommendation, explanation, strength, weakness, and optimization summary.

                            Do not include the company name inside `misc`.

                            Do not include the job title inside `misc`.

                            Do not include the complete updated LaTeX code inside `misc`.

                            Do not create additional top-level objects or fields.

                            ## JSON Validity Requirements

                            * `ats_score` must be an integer from 0 to 100.
                            * `keyword_match_percentage` must be an integer from 0 to 100.
                            * Use `null` instead of an empty string when the company name or position cannot be identified.
                            * Use `null` for other singular job-information fields that cannot be reliably determined.
                            * Use empty arrays when no list items apply.
                            * The value of `updated_latex_code` must contain the complete resume.
                            * Escape every backslash inside the LaTeX string according to JSON rules. For example, `\section` must be represented as `\\section`.
                            * Escape quotation marks appearing inside the LaTeX string.
                            * Represent line breaks inside the LaTeX string using `\n`.
                            * Ensure the result can be parsed directly by a standard JSON parser.
                            * Do not return a Python dictionary or JavaScript object.
                            * Do not omit any of the four required top-level fields.
                            * Do not add any additional top-level fields.
                            * Do not use fabricated information to fill empty fields.
                            * Do not use `undefined`, `NaN`, comments, or trailing commas.
                            * The final response must begin with `{` and end with `}`.

                            ## Target Job Description

                            ---

                            [job_description]

                            ## Current Resume LaTeX Code

                            ---

                            [resume_old_latex_code]',
                'type' => 'text',
            ],
            [
                'key' => 'VACANCY_ORIGINAL_RESUME_LATEX',
                'value' => '\documentclass[11pt,a4paper]{article}
                                \usepackage[margin=0.42in]{geometry}
                                \usepackage{cmap}
                                \usepackage[T1]{fontenc}
                                \usepackage{lmodern}
                                \usepackage[utf8]{inputenc}
                                \input{glyphtounicode}
                                \pdfgentounicode=1
                                \usepackage[hidelinks]{hyperref}
                                \usepackage{enumitem}
                                \usepackage{titlesec}
                                \usepackage[none]{hyphenat}

                                \sloppy
                                \emergencystretch=3em
                                \linespread{1.0}

                                \setlength{\parindent}{0pt}
                                \setlength{\parskip}{0pt}
                                \pagestyle{empty}

                                \titleformat{\section}{\large\bfseries}{}{0em}{}[\titlerule]
                                \titlespacing*{\section}{0pt}{7pt}{4pt}

                                \setlist[itemize]{
                                leftmargin=0.16in,
                                itemsep=1pt,
                                topsep=2pt,
                                parsep=0pt,
                                partopsep=0pt,
                                font=\normalsize
                                }

                                \begin{document}
                                \normalsize

                                \begin{center}
                                {\fontsize{16pt}{17pt}\selectfont \textbf{Umer Shahzad}}\\[4pt]
                                \textbf{Full-Stack Developer | PHP Laravel}\\[4pt]
                                \href{mailto:umarbsse@gmail.com}{umarbsse@gmail.com} \;|\;
                                \href{https://www.linkedin.com/in/umershahzad1/}{linkedin.com/in/umershahzad1} \;|\;
                                \href{https://github.com/umarbsse}{github.com/umarbsse} \;|\;
                                \href{tel:+923238509292}{+92-323-8509294}
                                \end{center}

                                \section{Professional Summary}
                                Full-Stack PHP Laravel Developer with 10+ years of experience designing, developing, maintaining, and troubleshooting web applications using PHP 8.x, Laravel, ReactJS, JavaScript, HTML5, CSS3, MySQL, PostgreSQL, MongoDB, and AWS. Strong background in server-side logic, RESTful APIs, client-server architecture, responsive interfaces, database design, indexing, query optimization, token-based authentication, OAuth 2.0, RBAC, Redis caching, Docker, Git, code reviews, testing, documentation, and production support. Experienced building secure, scalable, database-driven applications, dashboards, admin panels, reporting systems, payment workflows, and API-integrated platforms across public-sector, fintech, SaaS, CMS, education, and AdTech projects.

                                \section{Technical Skills}
                                \textbf{Frontend:} ReactJS, JavaScript ES6+, HTML5, CSS3, jQuery, AJAX, Bootstrap, Responsive UI, Vue.js, Blade, Livewire \\
                                \textbf{Backend:} PHP 8.x, Laravel 8+, Core PHP, CodeIgniter, CakePHP, MVC, OOP, Design Patterns, Client-Server Architecture, Composer, PHPUnit, Middleware, Routing, Validation \\
                                \textbf{Databases:} MySQL, MongoDB, MariaDB, PostgreSQL, Redis, SQL/NoSQL Queries, Schema Design, Indexing, Query Optimization, Eloquent ORM \\
                                \textbf{Cloud \& DevOps:} AWS EC2, AWS RDS, AWS S3, Docker, Linux, Apache, Deployment Support, Environment Troubleshooting, npm, Vite \\
                                \textbf{Security \& APIs:} RESTful APIs, HTTP, JSON, API Integration, Third-Party Integrations, Webhooks, JWT, Laravel Sanctum, OAuth 2.0, RBAC, Token-Based Authentication \\
                                \textbf{Tools:} Git, GitHub, Bitbucket, Code Reviews, Jira, Postman, PHPUnit Testing, Documentation, Bug Fixing, Production Support

                                \section{Professional Experience}

                                \textbf{Full Stack Developer / Laravel Developer} \hfill Apr 2018 -- Present \\
                                \textbf{NESCOM} \hfill Islamabad, Pakistan
                                \begin{itemize}
                                \item Develop and maintain full-stack PHP 8.x/Laravel applications with RESTful APIs, ReactJS/Vue.js interfaces, dashboards, admin panels, reporting systems, and secure MySQL/PostgreSQL database-driven platforms.
                                \item Design server-side logic, MVC/OOP components, Composer-based Laravel modules, API contracts, validation rules, database schemas, and reusable workflows for scalable client-server web applications.
                                \item Build and integrate frontend features using ReactJS, JavaScript, AJAX, Bootstrap, HTML5, CSS3, Blade, and Livewire with Laravel REST APIs and backend data services.
                                \item Implement secure authentication, authorization, RBAC, Laravel Sanctum, JWT, OAuth 2.0, protected API workflows, permission layers, and token-based access control.
                                \item Support AWS EC2/RDS/S3 deployment environments, Docker, Linux, Apache, CRON jobs, Redis caching, payment workflows, webhooks, third-party APIs, and production infrastructure troubleshooting.
                                \item Optimize MySQL/PostgreSQL schemas, joins, indexes, Eloquent workflows, Redis caching, and SQL queries, improving API and database response times by up to 50\%.
                                \item Troubleshoot frontend, backend, API, database, permission, payment, deployment, and production issues; deliver fixes, documentation, testing support, and code review feedback to improve reliability.
                                \end{itemize}

                                \textbf{Software Engineer} \hfill Dec 2015 -- Dec 2016 \\
                                \textbf{Micro Merger} \hfill Islamabad, Pakistan
                                \begin{itemize}
                                \item Developed PHP, Laravel, CodeIgniter, MySQL, JavaScript, jQuery, AJAX, HTML5, CSS3, and Bootstrap applications for education, fintech, reporting, and government platforms.
                                \item Built backend modules and RESTful APIs for secure data exchange, transaction tracking, validation, reporting, audit trails, and payment disbursement workflows.
                                \item Designed MySQL schemas, indexes, joins, and optimized SQL queries, reducing response time by up to 70\% for data-heavy reporting workflows.
                                \item Supported Git workflows, code reviews, testing, bug fixing, legacy code maintenance, authentication logic, documentation, and production troubleshooting for public-sector web applications.
                                \end{itemize}

                                \textbf{Full Stack Developer} \hfill Jul 2013 -- Sep 2015 \\
                                \textbf{Freelancer.com} \hfill Remote
                                \begin{itemize}
                                \item Delivered 60+ remote projects for international clients using Core PHP, Laravel, CodeIgniter, WordPress CMS, REST APIs, dashboards, e-commerce features, ReactJS/JavaScript interfaces, and MySQL-backed websites.
                                \item Managed requirements analysis, development, testing, deployment, bug fixing, documentation, Git-based delivery, and English client communication independently for production web applications.
                                \end{itemize}

                                \section{Selected Projects}

                                \textbf{PayPerInstall -- High-Volume AdTech / Monetization Platform} \hfill \href{https://payperinstall.net/}{payperinstall.net}
                                \begin{itemize}
                                \item Built a Laravel/MySQL backend handling 200K+ daily click events with RESTful APIs, webhooks, Redis caching, campaign tracking, conversion validation, geolocation targeting, reporting, billing, Stripe, and PayPal; reduced fraudulent clicks by 30--40\% using IP reputation checks, proxy detection, behavioral analytics, and validation rules.
                                \end{itemize}

                                \textbf{Enterprise REST API \& Reporting Platform -- Laravel / ReactJS / AWS}
                                \begin{itemize}
                                \item Developed PHP 8.x/Laravel REST APIs, ReactJS-integrated dashboards, reporting workflows, validation rules, database schemas, and secure client-server modules using MySQL/PostgreSQL, MongoDB, Redis, Git, Docker, Linux, Apache, and AWS EC2/RDS/S3 deployment support.
                                \end{itemize}

                                \textbf{Secure Authentication \& Token-Based Access Platform}
                                \begin{itemize}
                                \item Implemented authentication, authorization, RBAC, Laravel Sanctum, JWT, OAuth 2.0, protected API workflows, permission layers, and token-based data access for secure PHP/Laravel applications handling sensitive operational and reporting data.
                                \end{itemize}

                                \textbf{Production Troubleshooting \& AWS Deployment Support}
                                \begin{itemize}
                                \item Troubleshot and fixed production issues across Laravel applications, ReactJS/API integrations, database performance, permissions, payment workflows, CRON jobs, Linux, Apache, Docker, AWS EC2/RDS/S3 environments, and RESTful services.
                                \end{itemize}

                                \textbf{FATA RRU Disbursement System -- Government Payments Platform} \hfill \href{https://rrufata.gov.pk/}{rrufata.gov.pk}
                                \begin{itemize}
                                \item Engineered PHP/Laravel modules for beneficiary registration, payment tracking, transaction validation, audit trails, reporting dashboards, permissions, and secure financial data handling for public-sector payment workflows.
                                \end{itemize}

                                \textbf{Concert Ticket Booking System -- Full-Stack Event Ticketing Platform}
                                \begin{itemize}
                                \item Developed a Laravel, MySQL, JavaScript, HTML5, and CSS3 ticket booking platform with authentication, concert listings, ticket categories, booking history, payment status tracking, digital e-tickets, QR codes, and admin management.
                                \end{itemize}

                                \textbf{AdSense Protector -- WordPress Security / Fraud Prevention Plugin}
                                \begin{itemize}
                                \item Developed a custom WordPress plugin using PHP, JavaScript, MySQL, and admin settings workflows to protect AdSense accounts from invalid click activity through IP tracking, click frequency rules, blocking logic, reporting, and fraud-prevention validation.
                                \end{itemize}

                                \section{Education}
                                \textbf{MS Software Engineering} \hfill 2016 -- 2020 \\
                                International Islamic University, Islamabad, Pakistan

                                \textbf{BS Software Engineering} \hfill 2011 -- 2015 \\
                                International Islamic University, Islamabad, Pakistan

                                \section{Certifications}
                                \begin{itemize}
                                \item Certified Network Security Specialist, ICSI UK, Jan 2023. \href{https://www.credential.net/b43a1739-ba36-4f8c-b8dd-ed95fe98c986}{Credential}
                                \item Advanced Web Scraping Techniques and Custom Training of LLMs, Nov 2023
                                \end{itemize}

                                \end{document}',
                'type' => 'text',
            ],
            [
                'key' => 'LATEX_BINARY',
                'value' => (string) env(
                    'LATEX_BINARY',
                    'C:/Users/John/AppData/Local/Programs/MiKTeX/miktex/bin/x64/pdflatex.exe'
                ),
                'type' => 'string',
            ],
            [
                'key' => 'LATEX_COMPILE_TIMEOUT',
                'value' => (string) env('LATEX_COMPILE_TIMEOUT', 120),
                'type' => 'integer',
            ],
        ];

        foreach ($configs as $config) {
            DB::table('config')->updateOrInsert(
                ['key' => $config['key']],
                [
                    'value' => $config['value'],
                    'type' => $config['type'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}