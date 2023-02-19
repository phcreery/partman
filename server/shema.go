package server

// NOTE: the following JSON string is generated by PocketBase, do not edit manually

var Schema string = `
[
    {
        "id": "2K6tASoFfJIsf9K",
        "name": "users",
        "type": "auth",
        "system": false,
        "schema": [
            {
                "id": "yr471swz",
                "name": "name",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "v7zfv7jk",
                "name": "avatar",
                "type": "file",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "mimeTypes": [
                        "image/jpg",
                        "image/jpeg",
                        "image/png",
                        "image/svg+xml",
                        "image/gif"
                    ],
                    "thumbs": null
                }
            }
        ],
        "listRule": null,
        "viewRule": null,
        "createRule": "",
        "updateRule": "id = @request.auth.id",
        "deleteRule": null,
        "options": {
            "allowEmailAuth": false,
            "allowOAuth2Auth": false,
            "allowUsernameAuth": true,
            "exceptEmailDomains": null,
            "manageRule": null,
            "minPasswordLength": 8,
            "onlyEmailDomains": null,
            "requireEmail": false
        }
    },
    {
        "id": "4cKEGHHm79jmqFg",
        "name": "components",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "syciha1l",
                "name": "mpn",
                "type": "text",
                "system": false,
                "required": true,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "59imzptn",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "n86n1k8s",
                "name": "stock",
                "type": "number",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null
                }
            },
            {
                "id": "9r6ybycy",
                "name": "comment",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "u45a0ykm",
                "name": "storage_location",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "AZPyYgFSyUPXw0F",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "id": "zc3c7j3h",
                "name": "category",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "66i7hRx2SIiCgmh",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "id": "nmut5phn",
                "name": "footprint",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "BOjtTDeCj7NQRAJ",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "id": "ixv5n8hz",
                "name": "ipn",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "xgjvaol7",
                "name": "specs",
                "type": "json",
                "system": false,
                "required": false,
                "unique": false,
                "options": {}
            },
            {
                "id": "o2x5hbbz",
                "name": "manufacturer",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "9p1jm0qv",
                "name": "supplier",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "al6ner5vsc3vhnn",
                    "cascadeDelete": false,
                    "maxSelect": 5,
                    "displayFields": null
                }
            },
            {
                "id": "yytllum7",
                "name": "spn",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "rslzp7cs",
                "name": "image",
                "type": "file",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "mimeTypes": [
                        "image/jpg",
                        "image/jpeg",
                        "image/png",
                        "image/svg+xml",
                        "image/gif"
                    ],
                    "thumbs": []
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "66i7hRx2SIiCgmh",
        "name": "component_categories",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "ugyeezkr",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "q0qdbtj2",
                "name": "parent",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "66i7hRx2SIiCgmh",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "id": "tvvoskkg",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "u5hDISrpBElJcpS",
        "name": "storage_categories",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "gx0hygbe",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "jyqhc2ul",
                "name": "desciption",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "p0fjxvum",
                "name": "parent",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "u5hDISrpBElJcpS",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "AZPyYgFSyUPXw0F",
        "name": "storage_locations",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "rgaovqsm",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "3qoh3vjk",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "jhpabp2g",
                "name": "category",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "u5hDISrpBElJcpS",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "06ULXCMWwKzFwaD",
        "name": "footprint_categories",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "clwl2uza",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "aiolgfxq",
                "name": "parent",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "06ULXCMWwKzFwaD",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "id": "avn8npib",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "BOjtTDeCj7NQRAJ",
        "name": "footprints",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "jbghdwms",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "bpsvhzqj",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "vczmw3yv",
                "name": "category",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "06ULXCMWwKzFwaD",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "kI0bAn7Cl6PVZYH",
        "name": "projects",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "elvd2bod",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "p28enlsq",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "xde3pykd",
                "name": "components",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "rf9e9a5xllc0fdx",
                    "cascadeDelete": false,
                    "maxSelect": null,
                    "displayFields": null
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "rf9e9a5xllc0fdx",
        "name": "project_components",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "oubdrbgj",
                "name": "bom_id",
                "type": "text",
                "system": false,
                "required": true,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "hmqb0yhc",
                "name": "component",
                "type": "relation",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "collectionId": "4cKEGHHm79jmqFg",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "id": "ghbni22c",
                "name": "quantity",
                "type": "number",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": 0,
                    "max": null
                }
            },
            {
                "id": "fqubwz9b",
                "name": "refdesignators",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "qjmpwj3j",
                "name": "comment",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "7b9ap40dd7w0yd5",
        "name": "project_builds",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "dnfto6ly",
                "name": "project",
                "type": "relation",
                "system": false,
                "required": true,
                "unique": false,
                "options": {
                    "collectionId": "kI0bAn7Cl6PVZYH",
                    "cascadeDelete": false,
                    "maxSelect": 1,
                    "displayFields": []
                }
            },
            {
                "id": "qbceylux",
                "name": "qty",
                "type": "number",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": 1,
                    "max": null
                }
            },
            {
                "id": "skg2i4ry",
                "name": "comment",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": null,
        "options": {}
    },
    {
        "id": "wrjxg3v7wad00a9",
        "name": "manufacturers",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "2zivxocn",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "gufs6wcl",
                "name": "url",
                "type": "url",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "exceptDomains": null,
                    "onlyDomains": null
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "al6ner5vsc3vhnn",
        "name": "suppliers",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "oonuiwzw",
                "name": "name",
                "type": "text",
                "system": false,
                "required": true,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "iarhbn7l",
                "name": "url",
                "type": "url",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "exceptDomains": [],
                    "onlyDomains": []
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "0228kh0i31mqu83",
        "name": "config",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "wdbikvsk",
                "name": "category",
                "type": "text",
                "system": false,
                "required": true,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "dxado5l0",
                "name": "value",
                "type": "json",
                "system": false,
                "required": false,
                "unique": false,
                "options": {}
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": "",
        "options": {}
    },
    {
        "id": "xgrbvzo7a43p5kd",
        "name": "component_log",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "b3iqf8d9",
                "name": "component",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "gu6tejbh",
                "name": "description",
                "type": "text",
                "system": false,
                "required": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "rleulryy",
                "name": "new_value",
                "type": "json",
                "system": false,
                "required": false,
                "unique": false,
                "options": {}
            },
            {
                "id": "lgpgauiz",
                "name": "old_value",
                "type": "json",
                "system": false,
                "required": false,
                "unique": false,
                "options": {}
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    }
]
`

// form method have to be wrapped around
// {
//     "deleteMissing": true,
//     "collections":
//     [ ... ]
// }

var SchemaAsForm = `
{
    "deleteMissing": true,
    "collections":
    ` + Schema + `
}
`
