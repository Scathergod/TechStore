# Docker local

This compose file runs only the backend and connects it to the MySQL instance
installed on the host machine through `host.docker.internal`. The database is
not moved into Docker.

From the repository root:

```powershell
.\mvnw.cmd -pl apps/backend -am package
$env:DB_USERNAME = "your_user"
$env:DB_PASSWORD = "your_password"
docker compose -f infra/docker/docker-compose.yml up --build
```
