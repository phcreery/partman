package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/rest"
)

// REFERENCES:
// https://github.com/pocketbase/dbx
// https://github.com/mbecker/pocketstrava/blob/main/main.go
// https://github.com/ItsShawn/scripturealone.app/blob/main/server/server.go (reverse proxy alternative?)

func AddDashboardRequests(app core.App, e *core.ServeEvent) {

	e.Router.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/api/dashboard/info",
		Handler: func(c echo.Context) error {

			// collection, err := app.Dao().FindCollectionByNameOrId("components")
			// if err != nil {
			// 	return c.JSON(http.StatusUnauthorized, rest.NewNotFoundError("collection not found", nil))
			// }
			// expr := dbx.HashExp{"id": "*"}
			// records, err := app.Dao().FindRecordsByExpr(collection, expr)
			// if err != nil {
			// 	return c.JSON(http.StatusUnauthorized, rest.NewBadRequestError("cant query records", nil))
			// }
			// if len(records) == 0 {
			// 	return c.JSON(http.StatusUnauthorized, rest.NewBadRequestError("no records", nil))
			// }

			// extend the models.Record{} type with additional fields of stock
			type ComponentRecord struct {
				// models.Record
				Id		  string
				// MPN string `json:"mpn"`
				// Description string `json:"description"`
				Stock string `json:"stock"`
				// Comment string `json:"comment"`
			}
			type ProjectRecord struct {
				models.Record
			}
			type StorageLocationRecord struct {
				models.Record
			}

			componentsRecords := []ComponentRecord{}
			projectRecords := []ProjectRecord{}
			storageLocationRecords := []StorageLocationRecord{}

			db := app.Dao().DB()

			db.
			NewQuery("SELECT `id`, `stock` FROM `components`").
			All(&componentsRecords)

			db.
			NewQuery("SELECT * FROM `projects`").
			All(&projectRecords)

			db.
			NewQuery("SELECT * FROM `storage_locations`").
			All(&storageLocationRecords)

			// add up all records stock
			totalComponents := 0
			for _, record := range componentsRecords {
				// read record column "stock"
				stock := record.Stock
				// convert to int
				stockInt, err := strconv.Atoi(stock)
				// stockInt := stock.(int)
				if err != nil {
					// handle error
					fmt.Println(err)
					return c.JSON(http.StatusUnauthorized, rest.NewBadRequestError("cant query records", nil))
				}
				// add to total
				totalComponents += stockInt
			}
							
			// create type DashboardInfo struct
			type DashboardInfo struct {
				UniqueComponents int `json:"uniqueComponents"`
				TotalComponents int `json:"totalComponents"`
				TotalProjects int `json:"totalProjects"`
				TotalStorageLocations int `json:"totalStorageLocations"`
				// StorageLocationTree []models.StorageLocation `json:"storageLocationTree"`
				Components []ComponentRecord `json:"components"`
			}

			// get dashboard info
			dashboardInfo := DashboardInfo{
				UniqueComponents: len(componentsRecords),
				TotalComponents: totalComponents,
				TotalProjects: len(projectRecords),
				TotalStorageLocations: len(storageLocationRecords),
				// StorageLocationTree: storageLocationTree,
				Components: componentsRecords,
			}

			// print dashboardInfo
			fmt.Println(dashboardInfo)
			
			// obj := map[string]interface{}{"message": "Hello world!"}
			return c.JSON(http.StatusOK, dashboardInfo)
		},
		Middlewares: []echo.MiddlewareFunc{
			// apis.RequireAdminOrUserAuth(),
		},
	})

}
