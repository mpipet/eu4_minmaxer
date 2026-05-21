FROM python:3.14-alpine AS base

WORKDIR /app

RUN apk add --update --no-cache python3 py3-pip gcc musl-dev python3-dev libffi-dev openssl-dev

COPY . /app/
RUN pip3 install -r requirements.txt --break-system-packages

FROM base AS development

EXPOSE 8000

CMD ["flask", "--app", "app", "run", "--debug", "--host", "0.0.0.0", "--port", "8000"]

FROM base AS production

EXPOSE 5000

ENV FLASK_ENV=production

CMD ["gunicorn", \
     "--bind", "0.0.0.0:5000", \
     "--workers", "13", \
     "--worker-connections", "1000", \
     "--backlog", "4096", \
     "--timeout", "120", \
     "--graceful-timeout", "30", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "50", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "--log-level", "info", \
     "app:app"]     