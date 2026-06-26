from django.db import migrations


def _normalize(name: str) -> str:
    return name.lower().strip().replace('.', '').replace('_', ' ')


SKILL_SUMMARIES = {
    'javascript': (
        'Core language for modern web development — ES6+, async/await, '
        'and building interactive client-side experiences.'
    ),
    'typescript': (
        'Typed JavaScript for safer, scalable codebases with strong IDE '
        'support and fewer runtime surprises.'
    ),
    'python': (
        'Versatile backend and scripting language used for APIs, automation, '
        'data work, and rapid product development.'
    ),
    'react': (
        'Component-based UI library for building fast, maintainable single-page '
        'applications with hooks and modern patterns.'
    ),
    'react js': (
        'Component-based UI library for building fast, maintainable single-page '
        'applications with hooks and modern patterns.'
    ),
    'django': (
        'High-level Python web framework for secure, batteries-included APIs '
        'and admin-backed applications.'
    ),
    'node js': (
        'JavaScript runtime for scalable server-side apps, REST APIs, and '
        'real-time services.'
    ),
    'nodejs': (
        'JavaScript runtime for scalable server-side apps, REST APIs, and '
        'real-time services.'
    ),
    'postgresql': (
        'Reliable relational database for complex queries, transactions, and '
        'production-grade data modeling.'
    ),
    'mongodb': (
        'Document database for flexible schemas, rapid iteration, and '
        'horizontally scalable workloads.'
    ),
    'docker': (
        'Containerization for consistent dev/prod environments and simplified '
        'deployment pipelines.'
    ),
    'git': (
        'Version control for branching workflows, code review, and reliable '
        'collaboration across teams.'
    ),
    'problem solving': (
        'Breaking down complex requirements, debugging systematically, and '
        'delivering practical solutions under constraints.'
    ),
    'team collaboration': (
        'Clear communication, code reviews, and cross-functional teamwork to '
        'ship quality software on schedule.'
    ),
    'html': 'Semantic markup and accessible structure for modern web pages.',
    'css': 'Responsive layouts, design systems, and polished UI styling.',
    'tailwind css': 'Utility-first CSS for rapid, consistent interface development.',
    'vue': 'Progressive framework for building reactive user interfaces.',
    'angular': 'Enterprise-grade framework for large-scale structured frontends.',
    'next js': 'React framework with SSR, routing, and optimized production builds.',
    'nextjs': 'React framework with SSR, routing, and optimized production builds.',
    'redis': 'In-memory data store for caching, queues, and high-performance lookups.',
    'aws': 'Cloud infrastructure — compute, storage, and managed services at scale.',
    'graphql': 'Flexible API query layer for efficient data fetching across clients.',
    'rest api': 'Designing clean HTTP APIs with solid validation and documentation.',
    'linux': 'Server administration, shell scripting, and deployment on Unix systems.',
    'figma': 'UI/UX collaboration — wireframes, prototypes, and design handoff.',
}


CATEGORY_FALLBACKS = {
    'programming': '{name} — primary language used across production web projects.',
    'framework': '{name} — framework applied to build features end-to-end in real products.',
    'database': '{name} — database used for modeling, querying, and optimizing data layers.',
    'tool': '{name} — daily driver in development, deployment, and team workflows.',
    'soft': '{name} — key strength that supports delivery, quality, and teamwork.',
    'other': '{name} — part of my toolkit for building reliable software.',
}


def summary_for_skill(name: str, category: str) -> str:
    key = _normalize(name)
    if key in SKILL_SUMMARIES:
        return SKILL_SUMMARIES[key]
    compact = key.replace(' ', '')
    if compact in SKILL_SUMMARIES:
        return SKILL_SUMMARIES[compact]
    template = CATEGORY_FALLBACKS.get(category, CATEGORY_FALLBACKS['other'])
    return template.format(name=name)


def populate_skill_summaries(apps, schema_editor):
    Skill = apps.get_model('portfolio', 'Skill')
    for skill in Skill.objects.all():
        if skill.summary:
            continue
        skill.summary = summary_for_skill(skill.name, skill.category)
        skill.save(update_fields=['summary'])


def clear_skill_summaries(apps, schema_editor):
    Skill = apps.get_model('portfolio', 'Skill')
    Skill.objects.update(summary='')


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0004_skill_summary'),
    ]

    operations = [
        migrations.RunPython(populate_skill_summaries, clear_skill_summaries),
    ]
