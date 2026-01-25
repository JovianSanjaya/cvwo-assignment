FROM golang:1.21-alpine

WORKDIR /app

RUN apk add --no-cache bash postgresql-client

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["sh", "-c", "while ! pg_isready -h postgres -p 5432 > /dev/null 2>&1; do sleep 1; done && ./main"]
