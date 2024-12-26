import pandas as pd
from .models import PurchasedItem

def get_average_sales():
    return {
        'total_sales': 50897,
        'this_month_percentage': 8
    }

def get_total_sales():
    return {
        'total': 550897,
        'increase_last_month': 3.48
    }

def get_total_inquieries():
    return {
        'total': 750897,
        'increase_last_month': 3.48
    }

def get_total_invoices():
    return {
        'total': 897,
        'increase_last_month': 3.48
    }

def get_graph_sales():
    return {
        'profit': [10, 20, 15, 40, 50, 70, 90],
        'sales': [5, 15, 25, 35, 30, 60, 80],
        'categories': ['Apple', 'Samsung', 'Vivo', 'Oppo'],
        'categories_percentage': [40, 30, 20, 10]
    }