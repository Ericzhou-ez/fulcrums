.PHONY: up down logs build restart clean

# Start all services
up:
	docker-compose up -d

# Start with development overrides
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Build images
build:
	docker-compose build

# Restart services
restart:
	docker-compose restart

# Stop and remove volumes (clean slate)
clean:
	docker-compose down -v

# Run in foreground
up-fg:
	docker-compose up
