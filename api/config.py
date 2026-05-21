import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    ENV = os.getenv("FLASK_ENV", "production")
    EU4_PATH = os.getenv("EU4_PATH")
    ES_HOST = os.getenv("ES_HOST", "localhost")
    ES_USER = os.getenv("ES_USER", "")
    ES_PASSWORD = os.getenv("ES_PASSWORD", "")
    ES_SSL_CERT = os.getenv("ES_SSL_CERT", "")
    ES_PORT = int(os.getenv("ES_PORT", 9200))
    ES_INDEX_PREFIX = os.getenv("ES_INDEX_PREFIX", "eu4_")

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")


class PaginationConfig:
    DEFAULT_PAGE_SIZE = int(os.getenv("DEFAULT_PAGE_SIZE", 20))

    MAX_PAGE_SIZE = int(os.getenv("MAX_PAGE_SIZE", 100))

    MIN_PAGE_SIZE = int(os.getenv("MIN_PAGE_SIZE", 5))

    DEFAULT_PAGE = int(os.getenv("DEFAULT_PAGE", 1))

    @staticmethod
    def get_page_size_options() -> List[int]:
        options_str = os.getenv("PAGE_SIZE_OPTIONS", "10,20,50,100")
        return [int(x.strip()) for x in options_str.split(",")]

    @staticmethod
    def validate_page_size(size: int) -> int:
        if size < PaginationConfig.MIN_PAGE_SIZE:
            return PaginationConfig.MIN_PAGE_SIZE
        if size > PaginationConfig.MAX_PAGE_SIZE:
            return PaginationConfig.MAX_PAGE_SIZE
        return size

    @staticmethod
    def validate_page(page: int) -> int:
        return max(1, page)

    @staticmethod
    def get_pagination_params(request_args: dict) -> dict:
        page = request_args.get("page", PaginationConfig.DEFAULT_PAGE, type=int)
        page_size = request_args.get(
            "page_size", PaginationConfig.DEFAULT_PAGE_SIZE, type=int
        )

        page = PaginationConfig.validate_page(page)
        page_size = PaginationConfig.validate_page_size(page_size)

        return {"page": page, "page_size": page_size, "offset": (page - 1) * page_size}

    @staticmethod
    def format_pagination_response(
        data: list, total: int, page: int, page_size: int
    ) -> dict:
        total_pages = (total + page_size - 1) // page_size

        return {
            "results": data,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },
        }


pagination_config = PaginationConfig()
