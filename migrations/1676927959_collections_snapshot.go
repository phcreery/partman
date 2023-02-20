package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "_pb_users_auth_",
				"created": "2023-02-20 21:13:05.121Z",
				"updated": "2023-02-20 21:17:32.481Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "users_name",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "users_avatar",
						"name": "avatar",
						"type": "file",
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
								"image/gif",
								"image/vnd.mozilla.apng",
								"image/webp",
								"image/bmp"
							],
							"thumbs": null
						}
					}
				],
				"listRule": null,
				"viewRule": null,
				"createRule": "id = @request.auth.id",
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
				"created": "2023-02-20 21:15:51.061Z",
				"updated": "2023-02-20 21:15:51.061Z",
				"name": "components",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "syciha1l",
						"name": "mpn",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "59imzptn",
						"name": "description",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "n86n1k8s",
						"name": "stock",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "9r6ybycy",
						"name": "comment",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "u45a0ykm",
						"name": "storage_location",
						"type": "relation",
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
						"system": false,
						"id": "zc3c7j3h",
						"name": "category",
						"type": "relation",
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
						"system": false,
						"id": "nmut5phn",
						"name": "footprint",
						"type": "relation",
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
						"system": false,
						"id": "ixv5n8hz",
						"name": "ipn",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "xgjvaol7",
						"name": "specs",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "o2x5hbbz",
						"name": "manufacturer",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "9p1jm0qv",
						"name": "supplier",
						"type": "relation",
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
						"system": false,
						"id": "yytllum7",
						"name": "spn",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "rslzp7cs",
						"name": "image",
						"type": "file",
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
				"created": "2023-02-20 21:15:51.064Z",
				"updated": "2023-02-20 21:15:51.064Z",
				"name": "component_categories",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "ugyeezkr",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "q0qdbtj2",
						"name": "parent",
						"type": "relation",
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
						"system": false,
						"id": "tvvoskkg",
						"name": "description",
						"type": "text",
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
				"created": "2023-02-20 21:15:51.066Z",
				"updated": "2023-02-20 21:15:51.066Z",
				"name": "storage_categories",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "gx0hygbe",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "jyqhc2ul",
						"name": "desciption",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "p0fjxvum",
						"name": "parent",
						"type": "relation",
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
				"created": "2023-02-20 21:15:51.069Z",
				"updated": "2023-02-20 21:15:51.069Z",
				"name": "storage_locations",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "rgaovqsm",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "3qoh3vjk",
						"name": "description",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "jhpabp2g",
						"name": "category",
						"type": "relation",
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
				"created": "2023-02-20 21:15:51.071Z",
				"updated": "2023-02-20 21:15:51.071Z",
				"name": "footprint_categories",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "clwl2uza",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "aiolgfxq",
						"name": "parent",
						"type": "relation",
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
						"system": false,
						"id": "avn8npib",
						"name": "description",
						"type": "text",
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
				"created": "2023-02-20 21:15:51.072Z",
				"updated": "2023-02-20 21:15:51.072Z",
				"name": "footprints",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "jbghdwms",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "bpsvhzqj",
						"name": "description",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "vczmw3yv",
						"name": "category",
						"type": "relation",
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
				"created": "2023-02-20 21:15:51.074Z",
				"updated": "2023-02-20 21:15:51.074Z",
				"name": "projects",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "elvd2bod",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "p28enlsq",
						"name": "description",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "xde3pykd",
						"name": "components",
						"type": "relation",
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
				"created": "2023-02-20 21:15:51.075Z",
				"updated": "2023-02-20 21:15:51.075Z",
				"name": "project_components",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "oubdrbgj",
						"name": "bom_id",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "hmqb0yhc",
						"name": "component",
						"type": "relation",
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
						"system": false,
						"id": "ghbni22c",
						"name": "quantity",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": 0,
							"max": null
						}
					},
					{
						"system": false,
						"id": "fqubwz9b",
						"name": "refdesignators",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "qjmpwj3j",
						"name": "comment",
						"type": "text",
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
				"created": "2023-02-20 21:15:51.078Z",
				"updated": "2023-02-20 21:15:51.078Z",
				"name": "project_builds",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "dnfto6ly",
						"name": "project",
						"type": "relation",
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
						"system": false,
						"id": "qbceylux",
						"name": "qty",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": 1,
							"max": null
						}
					},
					{
						"system": false,
						"id": "skg2i4ry",
						"name": "comment",
						"type": "text",
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
				"created": "2023-02-20 21:15:51.081Z",
				"updated": "2023-02-20 21:15:51.081Z",
				"name": "manufacturers",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "2zivxocn",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "gufs6wcl",
						"name": "url",
						"type": "url",
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
				"created": "2023-02-20 21:15:51.082Z",
				"updated": "2023-02-20 21:15:51.082Z",
				"name": "suppliers",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "oonuiwzw",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "iarhbn7l",
						"name": "url",
						"type": "url",
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
				"created": "2023-02-20 21:15:51.084Z",
				"updated": "2023-02-20 21:15:51.084Z",
				"name": "config",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "wdbikvsk",
						"name": "category",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "dxado5l0",
						"name": "value",
						"type": "json",
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
				"created": "2023-02-20 21:15:51.085Z",
				"updated": "2023-02-20 21:15:51.085Z",
				"name": "component_log",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "b3iqf8d9",
						"name": "component",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "gu6tejbh",
						"name": "description",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "rleulryy",
						"name": "new_value",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "lgpgauiz",
						"name": "old_value",
						"type": "json",
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
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
