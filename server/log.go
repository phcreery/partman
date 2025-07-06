package server

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
)

// https://pocketbase.io/docs/record-methods/

func getRecordJSON(record *core.Record) (string, error) {
	// convert record to JSON
	b, err := record.MarshalJSON()
	if err != nil {
		return "", err
	}
	return string(b), err
}

// function to look up component and return JSON
func getComponentValue(app core.App, id string) (string, error) {
	record, err := app.FindRecordById("components", id)
	if err != nil {
		return "", err
	}
	return getRecordJSON(record)
}

func ComponentLogsHook(app core.App) {
	// https://pocketbase.io/docs/hooks/
	createComponentLogEntry := func(record *core.Record, eventType string) error {
		if record.Collection().Name == "components" {
			// print id
			app.Logger().Debug(record.Id)

			description := ""
			oldComponentValue := ""
			newComponentValue := ""
			switch eventType {
			case "create":
				description = "Component created"
				newComponentValue, _ = getRecordJSON(record)
			case "update":
				description = "Component updated"
				newComponentValue, _ = getRecordJSON(record)
				oldComponentValue, _ = getComponentValue(app, record.Id)
			case "delete":
				description = "Component deleted"
				oldComponentValue, _ = getComponentValue(app, record.Id)
			}

			collection, err := app.FindCollectionByNameOrId("component_log")
			if err != nil {
				fmt.Println("error finding collection 'component_log'", err)
				return err
			}

			newLogRecord := core.NewRecord(collection)

			// with data validation
			form := forms.NewRecordUpsert(app, newLogRecord)

			// newLogRecord.

			form.Load(map[string]any{
				"component":   record.Id,
				"description": description,
				"new_value":   newComponentValue,
				"old_value":   oldComponentValue,
			})

			// validate and submit (internally it calls app.Dao().SaveRecord(record) in a transaction)
			if err := form.Submit(); err != nil {
				// fmt.Println("create log entry error", err)
				app.Logger().Error("create log entry error", err)
				return err
			}
		}
		return nil
	}

	app.OnRecordCreate().BindFunc(func(e *core.RecordEvent) error {
		createComponentLogEntry(e.Record, "create")
		return e.Next()
	})
	app.OnRecordUpdate().BindFunc(func(e *core.RecordEvent) error {
		createComponentLogEntry(e.Record, "update")
		return e.Next()
	})
	app.OnRecordDelete().BindFunc(func(e *core.RecordEvent) error {
		createComponentLogEntry(e.Record, "delete")
		return e.Next()
	})

}

// func ComponentTotalStockCounterHook(app core.App) {
// 	type CustomComponent struct {
// 		*core.Record
// 		TotalQuantity int `json:"_total_quantity"`
// 	}

// 	app.OnRecordViewRequest("components").Add(func(e *core.RecordViewEvent) error {
// 		record := e.Record
// 		newRecord := CustomComponent{Record: record}
// 		newRecord.TotalQuantity = 0
// 		e.HttpContext.JSON(http.StatusOK, newRecord)
// 		return hook.StopPropagation
// 	})
// 	app.OnRecordsListRequest().Add(func(e *core.RecordsListEvent) error {
// 		return nil
// 	})
// }
