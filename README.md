Something like this probably already exists but I need this for an upcoming flight where I can work offline 😂

# local-mongodb-data-api

Use the MongoDB Data API but proxy it to a local MongoDB.

## Usage

```
npm install
npm run start
```

```
open http://localhost:3000
```

`http://localhost:3000/insertOne`

```json
{
  "dataSource": "Anything",
  "database": "anything",
  "collection": "products",
  "document": {
    "slug": "stickers",
    "price": 1000
  }
}
```

`http://localhost:3000/find`

```json
{
  "dataSource": "Anything",
  "database": "anything",
  "collection": "products",
  "sort": {
    "price": -1
  },
  "limit": 100
}
```

`http://localhost:3000/findOne`

```json
{
  "dataSource": "Anything",
  "database": "anything",
  "collection": "products",
  "document": {
    "slug": "stickers"
  }
}
```
