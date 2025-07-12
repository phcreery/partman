package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// REFERENCES:
// https://github.com/pocketbase/dbx
// https://github.com/mbecker/pocketstrava/blob/main/main.go
// https://github.com/ItsShawn/scripturealone.app/blob/main/server/server.go (reverse proxy alternative?)

func AddDashboardRequests(app core.App, se *core.ServeEvent, version string) {

	se.Router.GET("/api/custom/dashboard/info", func(e *core.RequestEvent) error {

		// extend the models.Record{} type with additional fields of stock
		type ComponentRecord struct {
			// models.Record
			Id string `json:"id"`
			// MPN 					string `json:"mpn"`
			// Description 			string `json:"description"`
			Stock string `json:"stock"`
			// Comment 				string `json:"comment"`'
			StorageLocation string `json:"storageLocation"`
		}
		type ProjectRecord struct {
			// models.Record
			Id string `json:"id"`
		}
		type StorageLocationRecord struct {
			// models.Record
			Id                 string `json:"id"`
			NumberOfComponents string `json:"numberOfComponents"`
		}
		type ProjectBuildsRecord struct {
			// models.Record
			Id string `json:"id"`
		}

		componentsRecords := []ComponentRecord{}
		projectRecords := []ProjectRecord{}
		storageLocationRecords := []StorageLocationRecord{}
		projectBuildsRecords := []ProjectBuildsRecord{}

		db := app.DB()

		db.
			NewQuery("SELECT `id`, `stock`, `storage_location` FROM `components`").
			All(&componentsRecords)

		db.
			NewQuery("SELECT * FROM `projects`").
			All(&projectRecords)

		db.
			NewQuery("SELECT * FROM `storage_locations`").
			All(&storageLocationRecords)

		db.
			NewQuery("SELECT * FROM `project_builds`").
			All(&projectBuildsRecords)

		// add up all records stock
		totalComponents := 0
		for _, record := range componentsRecords {
			// read record column "stock"
			stock := record.Stock
			// convert to int
			stockInt, err := strconv.Atoi(stock)

			if err != nil {
				// handle error
				fmt.Println(err)
				// return c.String(http.StatusBadRequest, "cant query records")
				return apis.NewNotFoundError("cant query records", err)
			}
			// add to total
			totalComponents += stockInt
		}

		// loop though all storage locations and add up all records whose record.Storage_location field matches the storage location record id
		// and set the storage location record.Number_of_components field to the total
		for _, storageLocationRecord := range storageLocationRecords {
			// read storage location record id
			storageLocationRecordId := storageLocationRecord.Id
			// set total to 0
			total := 0
			// loop through all components records
			for _, componentRecord := range componentsRecords {
				// read component record storage location
				componentRecordStorageLocation := componentRecord.StorageLocation
				// if component record storage location matches storage location record id
				if componentRecordStorageLocation == storageLocationRecordId {
					// read component record stock
					stock := componentRecord.Stock
					// convert to int
					stockInt, err := strconv.Atoi(stock)
					// stockInt := stock.(int)
					if err != nil {
						// handle error
						fmt.Println(err)
						// return c.JSON(http.StatusUnauthorized, rest.NewBadRequestError("cant query records", nil))
						// return c.String(http.StatusBadRequest, "cant query records")
						return apis.NewNotFoundError("cant query records", err)
					}
					// add to total
					total += stockInt
				}
			}
			// find index of storage location record in storage location records and number of components to total
			for i, storageLocationRecord := range storageLocationRecords {
				if storageLocationRecord.Id == storageLocationRecordId {
					storageLocationRecords[i].NumberOfComponents = strconv.Itoa(total)
				}
			}
		}

		// create type DashboardInfo struct
		type DashboardInfo struct {
			UniqueComponents      int `json:"uniqueComponents"`
			TotalComponents       int `json:"totalComponents"`
			TotalProjects         int `json:"totalProjects"`
			TotalStorageLocations int `json:"totalStorageLocations"`
			TotalBuilds           int `json:"totalProjectBuilds"`
			// StorageLocationTree   []StorageLocation       `json:"storageLocationTree"`
			Components       []ComponentRecord       `json:"components"`
			StorageLocations []StorageLocationRecord `json:"storageLocations"`
			Version          string                  `json:"version"`
		}

		// get dashboard info
		dashboardInfo := DashboardInfo{
			UniqueComponents:      len(componentsRecords),
			TotalComponents:       totalComponents,
			TotalProjects:         len(projectRecords),
			TotalStorageLocations: len(storageLocationRecords),
			TotalBuilds:           len(projectBuildsRecords),
			// StorageLocationTree:   storageLocationTree,
			Components:       componentsRecords,
			StorageLocations: storageLocationRecords,
			Version:          version,
		}

		// print dashboardInfo
		fmt.Println(dashboardInfo)

		// obj := map[string]interface{}{"message": "Hello world!"}
		apiData := map[string]interface{}{"data": dashboardInfo}
		return e.JSON(http.StatusOK, apiData)
	},
	).Bind(apis.RequireAuth())
}
