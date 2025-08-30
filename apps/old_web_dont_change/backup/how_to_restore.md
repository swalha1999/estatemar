here are the commands to run the PostgreSQL container and restore the .sql.gz file:

pull the PostgreSQL 15 image:

```bash
docker pull postgres:15
```

start a PostgreSQL container with the necessary environment variables:

```bash
docker run -d --name backup-postgres -p 5432:5432 -e POSTGRES_DB=mydatabase -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v $(pwd)/backup:/backup postgres:15
```

the database url will be:

```bash
postgresql://root:root@localhost:5432/mydatabase
```

move file from this directory to the container:

```bash
docker cp ./2024-11-12T00_00_00.106Z.sql.gz backup-postgres:/backup/
```

restore the .sql.gz file into the running container:

```bash
docker exec -i backup-postgres bash -c "gunzip -c /backup/2024-11-12T00_00_00.106Z.sql.gz | pg_restore -1 --no-owner --clean -U root -d mydatabase"
```

this sequence will set up the container and import the data into mydatabase.

stop and delete the container:

```bash
docker stop backup-postgres
docker rm -f backup-postgres
```

postgresql://root:y2P7u4eaNMfX3Bhr@165.227.132.165:9191/estatemar
estatemar-db-75xgbh.1.jwq5s9wqu4svd18nuifll4jko

move file from this directory to the container:

```bash
docker cp ./backup.sql.gz estatemar-db-75xgbh.1.jwq5s9wqu4svd18nuifll4jko:/
```

```bash
docker exec -i estatemar-db-75xgbh.1.jwq5s9wqu4svd18nuifll4jko bash -c "gunzip -c /backup.sql.gz | pg_restore -1 --no-owner --clean -U root -d estatemar"
```

this is what worked for me:

```bash
root@solletics-vps:~# docker exec -i estatemar-db-23yjwu.1.vxakcbromldowsm7rnddcks4o bash -c "gunzip -c /backup.sql.gz | pg_restore -1 --no-owner --clean --if-exists -U root -d estatemar"
```

docker exec -i estatemar-db-uvikip.1.w4mlqiytp0qgucmhfld9s9u5d bash -c "gunzip -c /backup.sql.gz | pg_restore -1 --no-owner --clean --if-exists -U root -d estatemar