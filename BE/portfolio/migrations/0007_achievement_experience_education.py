"""Add experience/education content types and present dates at month precision.

Schema: extends Achievement.type with 'experience' and 'education' choices.

Data (azeem-amjad only, per approved plan):
- Reclassify the three milestone records from 'other' to their real content
  type (two work records, one education record). Other tenants' data is
  untouched.
- Strip the repeated "Date note: ... Day 2 in the date field represents the
  month ..." paragraph from those descriptions. The UI renders month/year
  precision for these records, so the public implementation note is redundant.
"""

from django.db import migrations, models

DATE_NOTE_MARKER = 'Date note:'


def _classify(title):
    lowered = title.lower()
    if 'bs software engineering' in lowered or 'bachelors' in lowered or 'bachelor' in lowered:
        return 'education'
    if 'internship' in lowered or 'intern' in lowered or 'contract' in lowered or 'developer' in lowered:
        return 'experience'
    return None


def reclassify_and_clean(apps, schema_editor):
    Achievement = apps.get_model('portfolio', 'Achievement')
    for record in Achievement.objects.filter(
        portfolio__username='azeem-amjad', type='other',
    ):
        new_type = _classify(record.title or '')
        if not new_type:
            continue
        record.type = new_type
        description = record.description or ''
        marker_index = description.find(DATE_NOTE_MARKER)
        if marker_index != -1:
            record.description = description[:marker_index].rstrip()
        record.save(update_fields=['type', 'description'])


def unreclassify(apps, schema_editor):
    """Restore the previous 'other' type. Stripped date notes cannot be restored."""

    Achievement = apps.get_model('portfolio', 'Achievement')
    titles = {
        'BS Software Engineering',
        'Backend Python Internship',
        'Full Stack Developer Contract',
    }
    Achievement.objects.filter(
        portfolio__username='azeem-amjad', title__in=titles,
    ).update(type='other')


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0006_projectimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievement',
            name='type',
            field=models.CharField(
                choices=[
                    ('award', 'Award'),
                    ('certification', 'Certification'),
                    ('recognition', 'Recognition'),
                    ('publication', 'Publication'),
                    ('experience', 'Experience'),
                    ('education', 'Education'),
                    ('other', 'Other'),
                ],
                default='certification',
                max_length=20,
            ),
        ),
        migrations.RunPython(reclassify_and_clean, unreclassify),
    ]
