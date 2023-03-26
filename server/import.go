package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func AddImportComponentsRoute(app core.App, e *core.ServeEvent) {

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

	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/api/custom/importcomponents",
		Handler: func(c echo.Context) error {

			var json_map ImportComponents
			err := json.NewDecoder(c.Request().Body).Decode(&json_map)
			if err != nil {
				return apis.NewBadRequestError("cant decode body (import data)", err)
			}
			data := json_map.Data

			// loop through the data and create a new component record for each

			collection, err := app.Dao().FindCollectionByNameOrId("components")
			if err != nil {
				return apis.NewNotFoundError("cant find collection components", err)
			}

			for _, component := range data {
				fmt.Println(component)
				record := models.NewRecord(collection)
				// if component Action is "update" then find the record and update it
				if component.Action == "update" {
					record, err = app.Dao().FindRecordById("components", component.ID)
					if err != nil {
						return apis.NewNotFoundError("cant find record", err)
					}
				}
				// record, err := app.Dao().FindRecordById("articles", "RECORD_ID")
				record.Set("mpn", component.MPN)
				record.Set("manufacturer", component.Manufacturer)
				record.Set("description", component.Description)
				record.Set("stock", component.Stock)
				record.Set("ipn", component.IPN)

				// search for the category and set the category id
				category_record, err := app.Dao().FindRecordById("component_categories", component.Category)
				if err != nil {
					category_record, err = app.Dao().FindFirstRecordByData("component_categories", "name", component.Category)
					if err != nil {
						// return apis.NewNotFoundError("cant find category", err)
						// create a new category
						category_collection, err := app.Dao().FindCollectionByNameOrId("component_categories")
						if err != nil {
							return apis.NewNotFoundError("cant find collection component_categories", err)
						}
						category_record = models.NewRecord(category_collection)
						category_record.Set("name", component.Category)
						if err := app.Dao().SaveRecord(category_record); err != nil {
							return apis.NewBadRequestError("cant save category record", err)
						}
						// find the category again
						category_record, err = app.Dao().FindFirstRecordByData("component_categories", "name", component.Category)
						if err != nil {
							return apis.NewNotFoundError("cant find category", err)
						}
					}
				}
				record.Set("category", category_record.Id)

				// search for the footprint and set the footprint id
				footprint_record, err := app.Dao().FindRecordById("footprints", component.Footprint)
				if err != nil {
					footprint_record, err = app.Dao().FindFirstRecordByData("footprints", "name", component.Footprint)
					if err != nil {
						// return apis.NewNotFoundError("cant find footprint", err)
						// create a new footprint
						footprint_collection, err := app.Dao().FindCollectionByNameOrId("footprints")
						if err != nil {
							return apis.NewNotFoundError("cant find collection footprints", err)
						}
						footprint_record = models.NewRecord(footprint_collection)
						footprint_record.Set("name", component.Footprint)
						if err := app.Dao().SaveRecord(footprint_record); err != nil {
							return apis.NewBadRequestError("cant save footprint record", err)
						}
						// find the footprint again
						footprint_record, err = app.Dao().FindFirstRecordByData("footprints", "name", component.Footprint)
						if err != nil {
							return apis.NewNotFoundError("cant find footprint", err)
						}
					}
				}
				record.Set("footprint", footprint_record.Id)

				// search for the storage location and set the storage location id
				storage_location_record, err := app.Dao().FindRecordById("storage_locations", component.Storage_location)
				if err != nil {
					storage_location_record, err = app.Dao().FindFirstRecordByData("storage_locations", "name", component.Storage_location)
					if err != nil {
						// return apis.NewNotFoundError("cant find storage location", err)
						// create a new storage location
						storage_location_collection, err := app.Dao().FindCollectionByNameOrId("storage_locations")
						if err != nil {
							return apis.NewNotFoundError("cant find collection storage_locations", err)
						}
						storage_location_record = models.NewRecord(storage_location_collection)
						storage_location_record.Set("name", component.Storage_location)
						if err := app.Dao().SaveRecord(storage_location_record); err != nil {
							return apis.NewBadRequestError("cant save storage location record", err)
						}
						// find the storage location again
						storage_location_record, err = app.Dao().FindFirstRecordByData("storage_locations", "name", component.Storage_location)
						if err != nil {
							return apis.NewNotFoundError("cant find storage location", err)
						}
					}
				}
				record.Set("storage_location", storage_location_record.Id)

				if err := app.Dao().SaveRecord(record); err != nil {
					// return err
					return apis.NewBadRequestError("cant save record", err)
				}

			}

			return c.String(http.StatusOK, "ok")
		},
		Middlewares: []echo.MiddlewareFunc{
			// apis.RequireAdminOrUserAuth(),
		},
	})
}
