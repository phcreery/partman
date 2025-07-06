package server

import (
	"fmt"
	"net/http"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func GetRelationID(app core.App, collection_name string, relation_name string, relation_value string) (string, error) {
	// relation_name is the name OR id of the field in the collection
	// search for the record by id
	record, err := app.FindRecordById(collection_name, relation_value)
	// if not found search for the record by name
	if err != nil {
		record, err = app.FindFirstRecordByData(collection_name, relation_name, relation_value)
		if err != nil {
			// if still not found, create a new record
			collection, err := app.FindCollectionByNameOrId(collection_name)
			if err != nil {
				return "", err
			}
			record = core.NewRecord(collection)
			record.Set(relation_name, relation_value)
			if err := app.Save(record); err != nil {
				return "", err
			}
			// find the category again
			record, err = app.FindFirstRecordByData(collection_name, relation_name, relation_value)
			if err != nil {
				return "", err
			}
		}
	}
	return record.Id, nil
}

func AddImportComponentsRoute(app core.App, se *core.ServeEvent) {

	type ImportComponent struct {
		Action           string `json:"action"`
		ID               string `json:"id"`
		MPN              string `json:"mpn"`
		Manufacturer     string `json:"manufacturer"`
		Description      string `json:"description"`
		Category         string `json:"category"`
		Stock            int    `json:"stock"`
		Footprint        string `json:"footprint"`
		IPN              string `json:"ipn"`
		Storage_location string `json:"storage_location"`
	}

	type ImportComponents struct {
		Data []ImportComponent `json:"data"`
	}

	se.Router.GET("/api/custom/importcomponents", func(e *core.RequestEvent) error {

		var json_map ImportComponents
		// err := json.NewDecoder(e.Request().Body).Decode(&json_map)
		err := e.BindBody(&json_map)
		if err != nil {
			return apis.NewBadRequestError("cant decode body (import data)", err)
		}
		data := json_map.Data

		// loop through the data and create a new component record for each

		collection, err := app.FindCollectionByNameOrId("components")
		if err != nil {
			return apis.NewNotFoundError("cant find collection components", err)
		}

		for _, component := range data {
			fmt.Println(component)
			record := core.NewRecord(collection)
			// if component Action is "update" then find the record and update it
			if component.Action == "update" {
				record, err = app.FindRecordById("components", component.ID)
				if err != nil {
					return apis.NewNotFoundError("cant find record", err)
				}
			}
			record.Set("mpn", component.MPN)
			record.Set("manufacturer", component.Manufacturer)
			record.Set("description", component.Description)
			record.Set("stock", component.Stock)
			record.Set("ipn", component.IPN)

			category_record_id, err := GetRelationID(app, "component_categories", "name", component.Category)
			if err != nil {
				return apis.NewNotFoundError("cant find category", err)
			}
			record.Set("category", category_record_id)

			footprint_record_id, err := GetRelationID(app, "footprints", "name", component.Footprint)
			if err != nil {
				return apis.NewNotFoundError("cant find footprint", err)
			}
			record.Set("footprint", footprint_record_id)

			storage_location_record_id, err := GetRelationID(app, "storage_locations", "name", component.Storage_location)
			if err != nil {
				return apis.NewNotFoundError("cant find storage_location", err)
			}
			record.Set("storage_location", storage_location_record_id)

			if err := app.Save(record); err != nil {
				return apis.NewBadRequestError("cant save record", err)
			}

		}

		return e.String(http.StatusOK, "ok")
	},
	).Bind(apis.RequireAuth())
}

func AddImportProjectComponentsRoute(app core.App, e *core.ServeEvent) {

	// { prop: "bom_id", label: "BOM ID", mergeOptions: { single: true, required: true } },
	// { prop: "component", label: "MPN", uniqueKey: "mpn", mergeOptions: { single: true } },
	// { prop: "quantity", label: "Quantity", mergeOptions: { required: true, defaultBoth: true } },
	// { prop: "refdesignators", label: "Ref. Designators", mergeOptions: { defaultBoth: true } },
	// { prop: "comment", label: "Comment", mergeOptions: { defaultBoth: true } }

	type ImportComponent struct {
		Action         string `json:"action"`
		ID             string `json:"id"`
		Project_ID     string `json:"project_id"`
		BOM_ID         string `json:"bom_id"`
		Component      string `json:"component"`
		Quantity       int    `json:"quantity"`
		Refdesignators string `json:"refdesignators"`
		Comment        string `json:"comment"`
	}

	type ImportComponents struct {
		Data []ImportComponent `json:"data"`
	}

	e.Router.POST("/api/custom/importprojectcomponents", func(e *core.RequestEvent) error {

		var json_map ImportComponents
		// err := json.NewDecoder(c.Request().Body).Decode(&json_map)
		err := e.BindBody(&json_map)
		if err != nil {
			return apis.NewBadRequestError("cant decode body (import data)", err)
		}
		data := json_map.Data

		// loop through the data and create a new component record for each

		collection, err := app.FindCollectionByNameOrId("project_components")
		if err != nil {
			return apis.NewNotFoundError("cant find collection project_components", err)
		}

		for _, component := range data {
			fmt.Println(component)
			record := core.NewRecord(collection)
			// if component Action is "update" then find the record and update it
			if component.Action == "update" {
				record, err = app.FindRecordById("components", component.ID)
				if err != nil {
					return apis.NewNotFoundError("cant find record", err)
				}
			}
			record.Set("bom_id", component.BOM_ID)
			record.Set("quantity", component.Quantity)
			record.Set("refdesignators", component.Refdesignators)
			record.Set("comment", component.Comment)

			component_record_id, err := GetRelationID(app, "components", "mpn", component.Component)
			if err != nil {
				return apis.NewNotFoundError("cant find component", err)
			}
			record.Set("component", component_record_id)

			if err := app.Save(record); err != nil {
				return apis.NewBadRequestError("cant save record", err)
			}
			// find the project_component again
			record, err = app.FindFirstRecordByData("project_components", "bom_id", component.BOM_ID)
			if err != nil {
				return apis.NewBadRequestError("cant find newly created record", err)
			}
			// find the project
			project_record, err := app.FindFirstRecordByData("projects", "id", component.Project_ID)
			if err != nil {
				return apis.NewBadRequestError("cant find project", err)
			}
			// append the project_component ID to the project "components" relation
			project_record.Set("components", append(project_record.Get("components").([]string), record.Id))
			if err := app.Save(project_record); err != nil {
				return apis.NewBadRequestError("cant save newly updated project record", err)
			}
		}

		return e.String(http.StatusOK, "ok")
	},
	).Bind(apis.RequireAuth())
}
