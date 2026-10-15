"""
AquaGuard AI — Backend Automated Test Suite
Tests all FastAPI endpoints, standards evaluation, and batch workflows.
"""

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app

class TestAquaGuardAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.headers = {"X-Session-Id": "test-automated-suite"}

    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("uptime", data)
        self.assertIn("version", data)

    def test_02_model_card(self):
        res = self.client.get("/api/model-card")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["version"], "v2.4 · Calibrated GBDT")
        self.assertIn("metrics", data)
        self.assertIn("accuracy", data["metrics"])
        self.assertIn("rocAuc", data["metrics"])
        self.assertIn("modelsBenchmark", data)
        self.assertIn("confusionMatrix", data)

    def test_03_create_sample_analysis(self):
        payload = {
            "label": "Test Station Alpha",
            "location": "Upper River Watershed",
            "ph": 7.4,
            "turbidity": 2.2,
            "solids": 340.0,
            "conductivity": 510.0,
            "hardness": 180.0,
            "chloramines": 2.4,
            "organic_carbon": 5.1,
            "sulfate": 220.0,
            "trihalomethanes": 42.0,
            "standard": "BIS IS 10500",
        }
        res = self.client.post("/api/analyze", json=payload, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data["id"].startswith("sample-"))
        self.assertEqual(data["label"], "Test Station Alpha")
        self.assertEqual(data["completeness"]["provided"], 9)
        self.assertEqual(data["completeness"]["percent"], 100)
        self.assertIn(data["ml"]["band"], ["Lower Concern", "Inconclusive — lab testing recommended", "Elevated Concern"])
        self.assertIn("shap", data)
        self.assertEqual(len(data["shap"]["contributions"]), 9)
        self.assertEqual(data["standards"]["standard"], "BIS IS 10500")
        self.assertIn("recommendations", data)
        self.assertIn("limitations", data)

        # Store id for single fetch test
        self.__class__.created_id = data["id"]

    def test_04_list_analyses(self):
        res = self.client.get("/api/analyses?page=1&pageSize=10", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("items", data)
        self.assertGreater(data["total"], 0)
        self.assertEqual(data["page"], 1)

    def test_05_get_single_analysis(self):
        created_id = getattr(self.__class__, "created_id", None)
        if created_id:
            res = self.client.get(f"/api/analyses/{created_id}", headers=self.headers)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["id"], created_id)

    def test_06_toggle_save(self):
        created_id = getattr(self.__class__, "created_id", None)
        if created_id:
            res = self.client.post(f"/api/analyses/{created_id}/save", headers=self.headers)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertTrue(data["saved"])

    def test_07_dashboard_summary(self):
        res = self.client.get("/api/dashboard/summary", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["totalAnalyses"], 0)
        self.assertIn("scoreDistribution", data)
        self.assertIn("parameterAverages", data)
        self.assertEqual(len(data["parameterAverages"]), 9)

    def test_08_batch_validate(self):
        payload = {
            "rows": [
                {
                    "rowNumber": 1,
                    "label": "Valid Station",
                    "location": "North Basin",
                    "ph": 7.1,
                    "turbidity": 2.2,
                    "solids": 340,
                    "conductivity": 510,
                    "hardness": 180,
                    "chloramines": 2.4,
                    "organic_carbon": 5.1,
                    "sulfate": 220,
                    "trihalomethanes": 42,
                },
                {
                    "rowNumber": 2,
                    "label": "Invalid Station",
                    "location": "South Basin",
                    "ph": 16.5,  # Invalid pH > 14
                    "turbidity": -4.0,  # Invalid negative
                },
            ]
        }
        res = self.client.post("/api/batch/validate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["totalRows"], 2)
        self.assertEqual(len(data["validRows"]), 1)
        self.assertEqual(len(data["invalidRows"]), 1)
        self.assertGreater(len(data["errorsSummary"]), 0)

    def test_09_batch_analyze(self):
        payload = {
            "rows": [
                {
                    "rowNumber": 1,
                    "label": "Batch Station 1",
                    "location": "Basin 1",
                    "ph": 7.2,
                    "turbidity": 1.8,
                    "solids": 280,
                    "conductivity": 420,
                    "hardness": 150,
                    "chloramines": 2.0,
                    "organic_carbon": 4.5,
                    "sulfate": 190,
                    "trihalomethanes": 35,
                    "isValid": True,
                }
            ]
        }
        res = self.client.post("/api/batch/analyze", json=payload, headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["label"], "Batch Station 1")

    def test_10_delete_analysis(self):
        created_id = getattr(self.__class__, "created_id", None)
        if created_id:
            res = self.client.delete(f"/api/analyses/{created_id}", headers=self.headers)
            self.assertEqual(res.status_code, 204)

            # Confirm 404 after deletion
            get_res = self.client.get(f"/api/analyses/{created_id}", headers=self.headers)
            self.assertEqual(get_res.status_code, 404)

if __name__ == "__main__":
    unittest.main()

