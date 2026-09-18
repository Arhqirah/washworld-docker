# Miljøvariabler (`.env`) til lokal udvikling

## Trin

1. Hent det nyeste commit som sædvanligt.
2. Opret en ny fil med navnet `.env` i samme mappe som `docker-compose.yml` (altså i roden af projektet).
3. Udfyld filen med variablerne nedenfor (brug eksemplet som udgangspunkt og tilpas værdierne).

## Variabler som `docker-compose.yml` bruger


| Variabel              | Beskrivelse                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DOCKER_PLATFORM`     | Docker-image platform for MariaDB-containeren. På Apple Silicon er `linux/arm64` typisk passende; brug `linux/amd64` hvis I har brug for AMD64-emulering. |
| `MYSQL_ROOT_PASSWORD` | Root-adgangskode til MariaDB. Den samme værdi bruges også af phpMyAdmin-servicen til at logge på databasen.
| `MYSQL_PASSWORD` | Valgfri adgangskode til din bruger.                 |
| `MYSQL_DATABASE`      | Navnet på den database, MariaDB opretter ved start (sammen med root-adgangskoden).                                                                        |
| `MYSQL_USER`      | Sendes som miljøvariabel til MariaDB-containeren sammen med de øvrige databaseindstillinger (jf. `docker-compose.yml`).                                   |
| `SECRET_KEY`      | Hemmelig nøgle til login-tokens (Flask). Brug en lang tilfældig streng i produktion.                                                                      |


## Eksempel på `.env`-indhold

Kopier blokken herunder ind i jeres `.env` og ret til efter behov:

```env
# DATABASE CONNECTIONS
MYSQL_USER=yourOwnUsername
MYSQL_PASSWORD=yourOwnPassword
MYSQL_ROOT_PASSWORD=yourOwnPassword
MYSQL_DATABASE=washworld_backend

# AUTH (Flask login-tokens)
SECRET_KEY=skift-mig-til-en-lang-tilfaeldig-streng

# PLATFORM
DOCKER_PLATFORM=linux/amd64
```

## Kørsel

Når `.env` findes i roden, kan I starte stacken som normalt, med:

```bash
docker compose up
```

