CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vaults (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT
);

CREATE TABLE vault_users (
    vault_id INTEGER REFERENCES vaults(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (vault_id, user_id)
);

CREATE TABLE passwords (
    id SERIAL PRIMARY KEY,
    vault_id INTEGER REFERENCES vaults(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    username TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
