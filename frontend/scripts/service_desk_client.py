import requests
import json
import os

# Configuration
API_BASE_URL = "http://localhost:3000/api/v1"
API_KEY = "sd_secret_key_123"  # Replace with your INTERNAL_API_KEY from .env

class ServiceDeskClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            "x-api-key": api_key,
            "Content-Type": "application/json"
        }

    def get_kb_articles(self):
        """Fetch all solutions for RAG indexing."""
        response = requests.get(f"{self.base_url}/kb", headers=self.headers)
        return response.json()

    def get_all_tickets(self):
        """Fetch requests, problems, and changes for context."""
        response = requests.get(f"{self.base_url}/tickets", headers=self.headers)
        return response.json()

    def create_request(self, subject, description, requester_id, category_id, priority_id, status_id):
        """Create a new ticket programmatically."""
        payload = {
            "subject": subject,
            "description": description,
            "requesterId": requester_id,
            "categoryId": category_id,
            "priorityId": priority_id,
            "statusId": status_id
        }
        response = requests.post(f"{self.base_url}/tickets", headers=self.headers, json=payload)
        return response.json()

if __name__ == "__main__":
    client = ServiceDeskClient(API_BASE_URL, API_KEY)
    
    print("--- Fetching Knowledge Base for RAG ---")
    kb = client.get_kb_articles()
    print(f"Found {kb.get('count', 0)} articles.")
    
    # print("\n--- Fetching All Tickets ---")
    # tickets = client.get_all_tickets()
    # print(f"Loaded {len(tickets['data']['requests'])} requests.")

    # Example: Create a ticket from an LLM 'thought'
    # print("\n--- Creating Sample AI Task ---")
    # new_ticket = client.create_request(
    #     subject="AI Generated: Network Latency Investigation",
    #     description="LLM identified potential bottleneck in subnet 10.0.1.x based on RAG logs.",
    #     requester_id="USER_ID_HERE", # Replace with real ID
    #     category_id="CAT_ID_HERE",
    #     priority_id="PRI_ID_HERE",
    #     status_id="STA_ID_HERE"
    # )
    # print(new_ticket)
