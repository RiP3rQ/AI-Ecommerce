FROM postgres:16.4-alpine
WORKDIR /app

RUN apk add git
RUN apk add build-base
RUN apk add clang15
RUN apk add llvm15-dev

RUN git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git

WORKDIR /app/pgvector

RUN make
RUN make install
