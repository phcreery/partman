package server

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
)

// https://pocketbase.io/docs/custom-models/
// https://pocketbase.io/docs/record-methods/

// function to look up component and return JSON
func getComponentValue(app core.App, id string) (string, error) {
	// collection, err := app.Dao().FindCollectionByNameOrId("components")
	// if err != nil {
	// 	return "", err
	// }

	record, err := app.Dao().FindRecordById("components", id)
	if err != nil {
		return "", err
	}

	// convert record to JSON
	b, err := record.MarshalJSON()
	if err != nil {
		return "", err
	}
	return string(b), err
}

func ComponentLogsHook(app core.App) {


	createComponentLogEntry := func(e *core.ModelEvent) error {
		if e.Model.TableName() == "components" {

			collection, err := app.Dao().FindCollectionByNameOrId("component_log")
			if err != nil {
				// log error
				fmt.Println("error finding collection", err)
				// return err
			}

			record := models.NewRecord(collection)

			// 	// with data validation
			form := forms.NewRecordUpsert(app, record)

			newComponentValue, err := getComponentValue(app, e.Model.GetId())
			if err != nil {
				// log error
				fmt.Println("error getting component value", err)
				// return err
			}

			// or form.LoadRequest(r, "")
			form.LoadData(map[string]any{
				"component": e.Model.GetId(),
				"description": "someone has created a new component",
				"new_value": newComponentValue,
			})

			// validate and submit (internally it calls app.Dao().SaveRecord(record) in a transaction)
			if err := form.Submit(); err != nil {
				// print error
				fmt.Println("submit error", err)
				// return err
			}
		}
		return nil
	}


	app.OnModelAfterCreate().Add(createComponentLogEntry)
	app.OnModelAfterUpdate().Add(createComponentLogEntry)
	app.OnModelAfterDelete().Add(createComponentLogEntry)

}
