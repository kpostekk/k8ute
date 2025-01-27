FROM python:3.12-alpine

RUN pip install httpx

WORKDIR /root

COPY inject_secret.py /root/inject.py

ENV WP_JSON_URL=http://wordpress/wp-json/wp/v2
ENV WP_USERNAME=admin
ENV WP_PASSWORD=admin
ENV WP_SECRET=example_secret

CMD ["python", "inject.py"]
