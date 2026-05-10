# File uploading

---

## Table of Contents <!-- omit in toc -->

- [Drivers support](#drivers-support)
- [Uploading and attach file flow for `local` driver](#uploading-and-attach-file-flow-for-local-driver)
  - [An example of uploading an avatar to a user profile (local)](#an-example-of-uploading-an-avatar-to-a-user-profile-local)
  - [Video example](#video-example)
- [Uploading and attach file flow for `s3` driver](#uploading-and-attach-file-flow-for-s3-driver)
  - [Configuration for `s3` driver](#configuration-for-s3-driver)
  - [An example of uploading an avatar to a user profile (S3)](#an-example-of-uploading-an-avatar-to-a-user-profile-s3)
- [Uploading and attach file flow for `s3-presigned` driver](#uploading-and-attach-file-flow-for-s3-presigned-driver)
  - [Configuration for `s3-presigned` driver](#configuration-for-s3-presigned-driver)
  - [An example of uploading an avatar to a user profile (S3 Presigned URL)](#an-example-of-uploading-an-avatar-to-a-user-profile-s3-presigned-url)
- [File upload security scanning](#file-upload-security-scanning)
  - [Local driver scanning flow](#local-driver-scanning-flow)
  - [S3 presigned driver scanning flow](#s3-presigned-driver-scanning-flow)
  - [Prerequisites](#prerequisites)
  - [Environment variables](#environment-variables)
- [How to delete files?](#how-to-delete-files)

---

## Drivers support

Out-of-box boilerplate supports the following drivers: `local`, `s3`, and `s3-presigned`. You can set it in the `.env` file, variable `FILE_DRIVER`. If you want to use another service for storing files, you can extend it.

> For production we recommend using the "s3-presigned" driver to offload your server.

---

## Uploading and attach file flow for `local` driver

Endpoint `/api/v1/files/upload` is used for uploading files, which returns `File` entity with `id` and `path`. After receiving `File` entity you can attach this to another entity.

### An example of uploading an avatar to a user profile (local)

```mermaid
sequenceDiagram
    participant A as Fronted App
    participant B as Backend App

    A->>B: Upload file via POST /api/v1/files/upload
    B->>A: Receive File entity with "id" and "path" properties
    note left of A: Attach File entity to User entity
    A->>B: Update user via PATCH /api/v1/auth/me
```

### Video example

<https://user-images.githubusercontent.com/6001723/224558636-d22480e4-f70a-4789-b6fc-6ea343685dc7.mp4>

## Uploading and attach file flow for `s3` driver

Endpoint `/api/v1/files/upload` is used for uploading files, which returns `File` entity with `id` and `path`. After receiving `File` entity you can attach this to another entity.

### Configuration for `s3` driver

1. Open https://s3.console.aws.amazon.com/s3/buckets
1. Click "Create bucket"
1. Create bucket (for example, `your-unique-bucket-name`)
1. Open your bucket
1. Click "Permissions" tab
1. Find "Cross-origin resource sharing (CORS)" section
1. Click "Edit"
1. Paste the following configuration

```json
    [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
      }
    ]
```

1. Click "Save changes"
1. Update `.env` file with the following variables:

```dotenv
    FILE_DRIVER=s3
    ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
    SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
    AWS_S3_REGION=YOUR_AWS_S3_REGION
    AWS_DEFAULT_S3_BUCKET=YOUR_AWS_DEFAULT_S3_BUCKET
```

### An example of uploading an avatar to a user profile (S3)

```mermaid
sequenceDiagram
    participant A as Fronted App
    participant B as Backend App
    participant C as AWS S3

    A->>B: Upload file via POST /api/v1/files/upload
    B->>C: Upload file to S3
    B->>A: Receive File entity with "id" and "path" properties
    note left of A: Attach File entity to User entity
    A->>B: Update user via PATCH /api/v1/auth/me
```

## Uploading and attach file flow for `s3-presigned` driver

Endpoint `/api/v1/files/upload` is used for uploading files. In this case `/api/v1/files/upload` receives only `fileName` property (without binary file), and returns the `presigned URL` and `key`. After receiving the `presigned URL` you need to upload your file directly to S3, then call `POST /api/v1/files/confirm` with the `key`, `fileName`, and `mimeType` to scan and commit the file.

### Configuration for `s3-presigned` driver

1. Open https://s3.console.aws.amazon.com/s3/buckets
1. Click "Create bucket"
1. Create **two** buckets:
   - Production bucket (for example, `your-unique-bucket-name`)
   - Quarantine bucket (for example, `your-unique-bucket-name-quarantine`)
1. Open your production bucket
1. Click "Permissions" tab
1. Find "Cross-origin resource sharing (CORS)" section
1. Click "Edit"
1. Paste the following configuration

```json
    [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
      }
    ]
```

   For production we recommend to use more strict configuration:

```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["PUT"],
       "AllowedOrigins": ["https://your-domain.com"],
       "ExposeHeaders": []
     },
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
      }
   ]
```

1. Repeat the same CORS configuration for the quarantine bucket
1. Click "Save changes"
1. Update `.env` file with the following variables:

```dotenv
    FILE_DRIVER=s3-presigned
    ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
    SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
    AWS_S3_REGION=YOUR_AWS_S3_REGION
    AWS_DEFAULT_S3_BUCKET=YOUR_AWS_DEFAULT_S3_BUCKET
    AWS_DEFAULT_S3_BUCKET_QUARANTINE=YOUR_AWS_DEFAULT_S3_BUCKET_QUARANTINE
```

### An example of uploading an avatar to a user profile (S3 Presigned URL)

```mermaid
sequenceDiagram
    participant C as AWS S3
    participant A as Fronted App
    participant B as Backend App

    A->>B: Send file name via POST /api/v1/files/upload
    note right of B: Generate presigned URL pointing to quarantine bucket
    B->>A: Receive presigned URL and key
    A->>C: Upload file to quarantine bucket via presigned URL
    A->>B: Confirm upload via POST /api/v1/files/confirm (key, fileName, mimeType)
    note right of B: Download from quarantine and scan with ClamAV
    B->>C: Promote clean file to production bucket
    B->>A: Receive File entity with "id" and "path" properties
    note left of A: Attach File entity to User entity
    A->>B: Update user via PATCH /api/v1/auth/me
```

---

## File upload security scanning

All uploaded files are scanned using [pompelmi](https://github.com/pompelmi/pompelmi) with ClamAV before being written to disk or committed to the database. Blocked uploads return `422 Unprocessable Entity`. The server fails closed — if ClamAV is unreachable, the upload is rejected.

### Local driver scanning flow

```mermaid
sequenceDiagram
    participant A as Frontend App
    participant B as Backend App

    A->>B: Upload file via POST /api/v1/files/upload
    note right of B: File lands in memory (memoryStorage)
    note right of B: Buffer scanned via ClamAV
    B->>A: 422 if malicious or scan error
    note right of B: Write to disk only if clean
    B->>A: 201 with File entity
```

### S3 presigned driver scanning flow

```mermaid
sequenceDiagram
    participant A as Frontend App
    participant B as Backend App
    participant C as AWS S3 Quarantine
    participant D as AWS S3 Production

    A->>B: POST /api/v1/files/upload (fileName, fileSize)
    B->>A: presigned URL + key
    A->>C: Upload file directly to quarantine bucket
    A->>B: POST /api/v1/files/confirm (key, fileName, mimeType)
    note right of B: Download from quarantine into memory
    note right of B: Scan buffer via ClamAV
    B->>C: Delete from quarantine if malicious
    B->>A: 422 if malicious or scan error
    B->>D: Copy clean file to production bucket
    B->>C: Delete from quarantine
    note right of B: Save DB record only if clean
    B->>A: 201 with File entity
```

### Prerequisites

ClamAV must be running and reachable. The fastest way to get started during development:

```bash
docker run -d --name clamav -p 3310:3310 clamav/clamav:stable
```

Wait for ClamAV to finish loading virus definitions before uploading files:

```bash
docker inspect --format='{{.State.Health.Status}}' clamav
# wait until output is: healthy
```

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `CLAMAV_HOST` | Hostname of the ClamAV daemon | `127.0.0.1` |
| `CLAMAV_PORT` | Port of the ClamAV daemon | `3310` |
| `AWS_DEFAULT_S3_BUCKET_QUARANTINE` | S3 quarantine bucket name (s3-presigned only) | — |

---

## How to delete files?

We prefer not to delete files, as this may have negative experience during restoring data. Also for this reason we also use [Soft-Delete](https://orkhan.gitbook.io/typeorm/docs/delete-query-builder#soft-delete) approach in database. However, if you need to delete files you can create your own handler, cronjob, etc.

---

Previous: [Serialization](serialization.md)

Next: [Tests](tests.md)