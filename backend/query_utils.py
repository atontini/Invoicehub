import flask_sqlalchemy
from sqlalchemy.orm.query import Query

def apply_filters(query: Query, model, filters: dict) -> Query:
    """
    Applies filters to the query based on the model and filters dictionary.
    """
    for field, value in filters.items():
        if hasattr(model, field) and value is not None:
            query = query.filter(getattr(model, field).ilike(f"%{value}%"))
    return query

def apply_ordering(query: Query, model, order_by: str, order_dir: str) -> Query:
    """
    Applies ordering to the query based on the model and ordering parameters.
    """
    if hasattr(model, order_by):
        if order_dir == "desc":
            query = query.order_by(getattr(model, order_by).desc())
        else:
            query = query.order_by(getattr(model, order_by).asc())
    return query

def apply_pagination(query: Query, page: int, per_page: int) -> flask_sqlalchemy.pagination:
    """
    Applies pagination to the query and returns a paginated result.
    """
    return query.paginate(page=page, per_page=per_page, error_out=False)
