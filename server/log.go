package server

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
)

// https://pocketbase.io/docs/custom-models/
// https://pocketbase.io/docs/record-methods/

func getRecordJSON(record *models.Record) (string, error) {
	// convert record to JSON
	b, err := record.MarshalJSON()
	if err != nil {
		return "", err
	}
	return string(b), err
}

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

	return getRecordJSON(record)
}

func ComponentLogsHook(app core.App) {
	// https://pocketbase.io/docs/hooks/
	createComponentLogEntry := func(record *models.Record, eventType string) error {
		if record.Collection().Name == "components" {
			// print id
			fmt.Println(record.Id)

			description := ""
			oldComponentValue := ""
			newComponentValue := ""
			if eventType == "create" {
				description = "Component created"
				newComponentValue, _ = getRecordJSON(record)
			} else if eventType == "update" {
				description = "Component updated"
				newComponentValue, _ = getRecordJSON(record)
				oldComponentValue, _ = getComponentValue(app, record.Id)
			} else if eventType == "delete" {
				description = "Component deleted"
				oldComponentValue, _ = getComponentValue(app, record.Id)
			}

			collection, err := app.Dao().FindCollectionByNameOrId("component_log")
			if err != nil {
				fmt.Println("error finding collection 'component_log'", err)
				return err
			}

			newLogRecord := models.NewRecord(collection)

			// with data validation
			form := forms.NewRecordUpsert(app, newLogRecord)

			form.LoadData(map[string]any{
				"component": record.Id,
				"description": description,
				"new_value": newComponentValue,
				"old_value": oldComponentValue,
			})

			// validate and submit (internally it calls app.Dao().SaveRecord(record) in a transaction)
			if err := form.Submit(); err != nil {
				fmt.Println("create log entry error", err)
				return err
			}
		}
		return nil
	}

	// app.OnModelAfterCreate().Add(createComponentLogEntry)
	// app.OnModelAfterUpdate().Add(createComponentLogEntry)
	// app.OnModelAfterDelete().Add(createComponentLogEntry)

	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		return createComponentLogEntry(e.Record, "create")
	})
	app.OnRecordBeforeUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		return createComponentLogEntry(e.Record, "update")
	})
	app.OnRecordBeforeDeleteRequest().Add(func(e *core.RecordDeleteEvent) error {
		return createComponentLogEntry(e.Record, "delete")
	})

}
