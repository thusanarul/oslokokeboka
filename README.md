# oslokokeboka
hele byens kokebok


## Run with docker

Minimum needed to run:
```
DATABASE_URL=postgresql://user:secret@localhost/table
````

run with (assuming env file is at `remix-oslokokeboka/.envrc`):
```
docker build -t oslokokeboka -f remix-oslokokeboka/Dockerfile .

docker run --rm -p 3000:3000 --env-file remix-oslokokeboka/.envrc oslokokeboka
```
