# IoT Dashboard Models Documentation

This document provides an overview of the data models used in the IoT Dashboard application. Each model represents a table in the PostgreSQL database.

## Table of Contents
1. [User](#user)
2. [Table](#table)
3. [Data](#data)
4. [Device](#device)

## User

The User model represents registered users of the application.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Unique identifier for the user | Primary Key |
| username | String | User's chosen username | Required, Unique, Min length: 3, Max length: 50 |
| passwordHash | String | Hashed password | Required |
| createdAt | DateTime | Timestamp of user creation | Default: current timestamp |
| updatedAt | DateTime | Timestamp of last update | Default: current timestamp |

## Table

The Table model represents data tables created by users to store IoT data.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Unique identifier for the table | Primary Key |
| name | String | Name of the table | Required, Min length: 1, Max length: 50 |
| schema | JSONB | JSON schema defining the structure of the data | Required |
| userId | UUID | Reference to the User who created the table | Required, Foreign Key (User) |
| createdAt | DateTime | Timestamp of table creation | Default: current timestamp |
| updatedAt | DateTime | Timestamp of last update | Default: current timestamp |

## Data

The Data model represents the actual IoT data stored in the tables.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Unique identifier for the data entry | Primary Key |
| tableId | UUID | Reference to the Table this data belongs to | Required, Foreign Key (Table) |
| content | JSONB | The actual data, conforming to the table's schema | Required |
| createdAt | DateTime | Timestamp of data creation | Default: current timestamp |

## Device

The Device model represents IoT devices registered in the system.

### Schema

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Unique identifier for the device | Primary Key |
| name | String | Name of the device | Required, Min length: 1, Max length: 50 |
| apiKey | String | API key for device authentication | Required, Unique |
| userId | UUID | Reference to the User who owns the device | Required, Foreign Key (User) |
| createdAt | DateTime | Timestamp of device registration | Default: current timestamp |
| updatedAt | DateTime | Timestamp of last update | Default: current timestamp |

## Relationships

- A User can have multiple Tables (one-to-many)
- A User can have multiple Devices (one-to-many)
- A Table can have multiple Data entries (one-to-many)

## Indexes

Consider adding indexes to frequently queried fields for better performance:

```sql
CREATE INDEX idx_table_user_id ON "Table" ("userId");
CREATE INDEX idx_data_table_id ON "Data" ("tableId");
CREATE INDEX idx_device_user_id ON "Device" ("userId");
CREATE INDEX idx_device_api_key ON "Device" ("apiKey");
```

## Notes

1. All models use UUID for primary keys to ensure uniqueness across distributed systems.
2. The `Table` model uses a JSONB field for flexible schema definition.
3. The `Data` model uses a JSONB field to store IoT data according to the table's schema.
4. Passwords are hashed before storage in the User model.
5. API keys for devices should be securely generated and stored.
6. Proper error handling should be implemented when interacting with these models, especially for unique constraint violations.
7. Consider implementing data retention policies for the `Data` model to manage long-term storage of IoT data.