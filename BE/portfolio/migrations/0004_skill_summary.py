from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_contactmessage_inbox_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='skill',
            name='summary',
            field=models.TextField(
                blank=True,
                help_text='Short description shown on skill hover (1–2 sentences)',
            ),
        ),
    ]
