# Generated by Django 5.1.1 on 2024-11-29 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comic', '0002_comic_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='comic',
            name='image',
            field=models.ImageField(blank=True, upload_to='comic_images/'),
        ),
    ]
