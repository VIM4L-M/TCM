from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('field_number', models.IntegerField()),
                ('location_details', models.TextField(blank=True)),
                ('is_available', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['field_number'],
            },
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True)),
                ('location', models.CharField(max_length=255)),
                ('city', models.CharField(blank=True, max_length=100)),
                ('state', models.CharField(blank=True, max_length=100)),
                ('country', models.CharField(blank=True, max_length=100)),
                ('status', models.CharField(choices=[('DRAFT', 'Draft'), ('PUBLISHED', 'Published'), ('ONGOING', 'Ongoing'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled')], default='DRAFT', max_length=20)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('description', models.TextField(blank=True)),
                ('rules', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_tournaments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Visitor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('visit_date', models.DateField()),
                ('checked_in', models.BooleanField(default=False)),
                ('checked_in_at', models.DateTimeField(blank=True, null=True)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visitors', to='tournaments.tournament')),
            ],
            options={
                'ordering': ['-visit_date'],
            },
        ),
        migrations.CreateModel(
            name='TournamentSnapshot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('snapshot_data', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='snapshots', to='tournaments.tournament')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('short_name', models.CharField(blank=True, max_length=50)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='team_logos/')),
                ('captain_name', models.CharField(blank=True, max_length=255)),
                ('contact_email', models.EmailField(blank=True, max_length=254)),
                ('contact_phone', models.CharField(blank=True, max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teams', to='tournaments.tournament')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_number', models.IntegerField()),
                ('scheduled_datetime', models.DateTimeField()),
                ('actual_start_time', models.DateTimeField(blank=True, null=True)),
                ('actual_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('SCHEDULED', 'Scheduled'), ('LIVE', 'Live'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled'), ('POSTPONED', 'Postponed')], default='SCHEDULED', max_length=20)),
                ('team_a_score', models.IntegerField(default=0)),
                ('team_b_score', models.IntegerField(default=0)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('field', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='matches', to='tournaments.field')),
                ('team_a', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_team_a', to='tournaments.team')),
                ('team_b', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_team_b', to='tournaments.team')),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='tournaments.tournament')),
                ('winner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='won_matches', to='tournaments.team')),
            ],
            options={
                'verbose_name_plural': 'Matches',
                'ordering': ['scheduled_datetime'],
            },
        ),
        migrations.AddField(
            model_name='field',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='tournaments.tournament'),
        ),
        migrations.AddIndex(
            model_name='tournament',
            index=models.Index(fields=['slug'], name='tournaments_slug_2e3c0a_idx'),
        ),
        migrations.AddIndex(
            model_name='tournament',
            index=models.Index(fields=['status'], name='tournaments_status_c3a7bb_idx'),
        ),
        migrations.AddIndex(
            model_name='tournament',
            index=models.Index(fields=['-created_at'], name='tournaments_created_58ae78_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='team',
            unique_together={('tournament', 'name')},
        ),
        migrations.AlterUniqueTogether(
            name='match',
            unique_together={('tournament', 'match_number')},
        ),
        migrations.AlterUniqueTogether(
            name='field',
            unique_together={('tournament', 'field_number')},
        ),
    ]
