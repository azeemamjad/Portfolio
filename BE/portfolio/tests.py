import importlib

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from portfolio.models import Achievement, Portfolio

migration_module = importlib.import_module(
    "portfolio.migrations.0007_achievement_experience_education"
)

DATE_NOTE = (
    "\r\n\r\nDate note: The milestone is recorded to month precision. "
    "Day 2 in the date field represents the month, not an exact completion day."
)


class _StubApps:
    """Mimics the historical-model registry a migration receives."""

    def get_model(self, app_label, model_name):
        from portfolio.models import Achievement as Model

        return Model


class ClassifyRecordTests(TestCase):
    def test_education_titles(self):
        self.assertEqual(migration_module._classify("BS Software Engineering"), "education")
        self.assertEqual(migration_module._classify("Bachelor of Science"), "education")

    def test_experience_titles(self):
        self.assertEqual(migration_module._classify("Backend Python Internship"), "experience")
        self.assertEqual(migration_module._classify("Full Stack Developer Contract"), "experience")

    def test_unknown_titles_are_skipped(self):
        self.assertIsNone(migration_module._classify("Speaker at Meetup"))
        self.assertIsNone(migration_module._classify(""))


class ReclassifyAndCleanTests(TestCase):
    def setUp(self):
        user = User.objects.create_user(username="azeem-amjad", password="x")
        other_user = User.objects.create_user(username="someone-else", password="x")
        self.portfolio = Portfolio.objects.create(user=user, username="azeem-amjad")
        self.other_portfolio = Portfolio.objects.create(
            user=other_user, username="someone-else"
        )
        Achievement.objects.create(
            portfolio=self.portfolio,
            title="Full Stack Developer Contract",
            type="other",
            issuer="Code Graphers",
            description="Contract, June-September 2026." + DATE_NOTE,
            date_received="2026-09-02",
        )
        Achievement.objects.create(
            portfolio=self.portfolio,
            title="Backend Python Internship",
            type="other",
            issuer="Code Graphers",
            description="Intern, July-September 2025." + DATE_NOTE,
            date_received="2025-09-02",
        )
        # A different tenant's record with a matching title must stay 'other'.
        self.other_tenant_record = Achievement.objects.create(
            portfolio=self.other_portfolio,
            title="Full Stack Developer Contract",
            type="other",
            issuer="Different Company",
            description="Their own contract." + DATE_NOTE,
            date_received="2026-09-02",
        )

    def test_reclassification_and_note_cleanup(self):
        migration_module.reclassify_and_clean(_StubApps(), None)

        contract = Achievement.objects.get(
            portfolio=self.portfolio, title="Full Stack Developer Contract"
        )
        self.assertEqual(contract.type, "experience")
        self.assertNotIn("Date note", contract.description)
        self.assertTrue(contract.description.startswith("Contract, June-September 2026."))

        internship = Achievement.objects.get(
            portfolio=self.portfolio, title="Backend Python Internship"
        )
        self.assertEqual(internship.type, "experience")
        self.assertNotIn("Date note", internship.description)

        self.assertEqual(
            Achievement.objects.filter(portfolio=self.portfolio, type="other").count(), 0
        )

    def test_other_tenants_are_untouched(self):
        migration_module.reclassify_and_clean(_StubApps(), None)
        self.other_tenant_record.refresh_from_db()
        self.assertEqual(self.other_tenant_record.type, "other")
        self.assertIn("Date note", self.other_tenant_record.description)

    def test_unreclassify_restores_types(self):
        migration_module.reclassify_and_clean(_StubApps(), None)
        migration_module.unreclassify(_StubApps(), None)
        self.assertEqual(
            Achievement.objects.filter(portfolio=self.portfolio, type="other").count(), 2
        )


class AchievementTypeDeliveryTests(TestCase):
    """The public API must deliver the new content types for the FE to label."""

    def setUp(self):
        user = User.objects.create_user(username="azeem-amjad", password="x")
        self.portfolio = Portfolio.objects.create(user=user, username="azeem-amjad")
        Achievement.objects.create(
            portfolio=self.portfolio,
            title="BS Software Engineering",
            type="education",
            issuer="COMSATS University Islamabad, Vehari Campus",
            description="Completed BS Software Engineering, February 2022-February 2026.",
            date_received="2026-02-02",
        )

    def test_portfolio_endpoint_includes_new_types(self):
        client = APIClient()
        response = client.get("/api/portfolios/azeem-amjad/")
        self.assertEqual(response.status_code, 200)
        achievements = response.data["achievements"]
        self.assertEqual(achievements[0]["type"], "education")
