# Use the official Go image as the base image
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

# Development stage
FROM cosmtrek/air AS dev
WORKDIR /app
COPY . .
RUN go get github.com/cosmtrek/air
CMD ["air"]

# Production stage
FROM alpine AS prod
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
ENV GIN_MODE=release
CMD ["./main"]